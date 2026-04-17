import cv2
import face_recognition
import numpy as np
import threading
import queue
from datetime import datetime
from face_engine.face_utils import load_encodings
from services.attendance_logger import log_attendance

running = False

# Shared frame for MJPEG stream
output_frame = None
output_lock = threading.Lock()

def get_camera():
    for index in range(3):
        cap = cv2.VideoCapture(index, cv2.CAP_DSHOW)
        if cap.isOpened():
            cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
            print(f"🎥 Camera found at index {index}")
            return cap
    raise RuntimeError("No camera found")

def parse_name(raw):
    parts = raw.split("_")
    if len(parts) < 2:
        return raw, "N/A"
    dob = parts[-1]
    full_name = " ".join(parts[:-1])
    return full_name, dob

def generate_frames():
    global output_frame
    while True:
        with output_lock:
            if output_frame is None:
                continue
            _, buffer = cv2.imencode(".jpg", output_frame, [cv2.IMWRITE_JPEG_QUALITY, 70])
        yield (b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + buffer.tobytes() + b"\r\n")

def run_scanner():
    global output_frame

    data = load_encodings()
    known_encodings = data["encodings"]
    known_names = data["names"]

    cap = get_camera()
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1920)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 1080)
    cap.set(cv2.CAP_PROP_FPS, 30)

    # Read actual resolution the camera settled on
    actual_w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    actual_h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    print(f"📐 Resolution: {actual_w}x{actual_h}")

    scale = 0.25
    inv   = int(1 / scale)

    face_boxes = []
    lock = threading.Lock()
    frame_queue = queue.Queue(maxsize=1)
    stop_event = threading.Event()

    logged = {}

    def should_log(name, now):
        today = now.strftime("%Y-%m-%d")
        if name not in logged:
            logged[name] = {}
        if today not in logged[name]:
            logged[name][today] = []
            return True
        entries = logged[name][today]
        if not entries:
            return True
        diff = (now - entries[-1]).total_seconds()
        if diff < 30:
            return False
        if diff >= 7200:
            return True
        return False

    def recognition_worker():
        while not stop_event.is_set():
            try:
                frame = frame_queue.get(timeout=0.5)
            except queue.Empty:
                continue

            small = cv2.resize(frame, (0, 0), fx=scale, fy=scale)
            rgb = cv2.cvtColor(small, cv2.COLOR_BGR2RGB)

            locations = face_recognition.face_locations(rgb, model="hog")
            encs = face_recognition.face_encodings(rgb, locations, num_jitters=0)

            boxes = []
            for enc, loc in zip(encs, locations):
                top, right, bottom, left = [v * inv for v in loc]
                matches = face_recognition.compare_faces(known_encodings, enc, tolerance=0.5)

                if True in matches:
                    idx = np.argmin(face_recognition.face_distance(known_encodings, enc))
                    raw_name = known_names[idx]
                    now = datetime.now()

                    if should_log(raw_name, now):
                        today = now.strftime("%Y-%m-%d")
                        entry_count = len(logged[raw_name].get(today, []))
                        entry_type = "entry" if entry_count == 0 else "reentry"
                        full_name, dob = parse_name(raw_name)

                        log_attendance(full_name, dob, now.strftime("%H:%M:%S"), today, entry_type)
                        logged[raw_name][today].append(now)
                        print(f"✅ {entry_type.upper()}: {full_name}")

                boxes.append((top, right, bottom, left))

            with lock:
                face_boxes.clear()
                face_boxes.extend(boxes)

    worker = threading.Thread(target=recognition_worker, daemon=True)
    worker.start()

    cv2.namedWindow("AttendEase Scanner", cv2.WINDOW_NORMAL)
    cv2.resizeWindow("AttendEase Scanner", actual_w, actual_h)

    print("🚀 Scanner started — press Q or close window to quit")

    frame_skip = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_skip += 1
        if frame_skip % 15 == 0 and not frame_queue.full():
            frame_queue.put(frame.copy())

        with lock:
            boxes = list(face_boxes)

        for top, right, bottom, left in boxes:
            cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)

        # Update shared frame for web stream
        with output_lock:
            output_frame = frame.copy()

        cv2.imshow("AttendEase Scanner", frame)

        key = cv2.waitKey(1) & 0xFF
        if key == ord("q") or cv2.getWindowProperty("AttendEase Scanner", cv2.WND_PROP_VISIBLE) < 1:
            break

    stop_event.set()
    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    run_scanner()


def start_scanner():
    global running
    if not running:
        running = True
        thread = threading.Thread(target=run_scanner, daemon=True)
        thread.start()
