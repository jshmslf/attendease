import csv
import os

LOG_FILE = "face_engine/attendance.csv"

def log_attendance(full_name, dob, time, date, entry_type):
    file_exists = os.path.isfile(LOG_FILE)

    with open(LOG_FILE, "a", newline="") as f:
        writer = csv.writer(f)

        if not file_exists:
            writer.writerow(["Name", "Birthdate", "Time", "Date", "Type"])

        writer.writerow([full_name, dob, time, date, entry_type])
