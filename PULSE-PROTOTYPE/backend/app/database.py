
import sqlite3
import json
from pathlib import Path

from app.config import STORAGE_DIR

DATABASE_PATH = STORAGE_DIR / "pulse.db"


def get_connection():
    STORAGE_DIR.mkdir(parents=True, exist_ok=True)

    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row

    return connection


def initialize_database():
    with get_connection() as connection:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS scans (
                id TEXT PRIMARY KEY,
                filename TEXT NOT NULL,
                modality TEXT NOT NULL,
                file_path TEXT NOT NULL,
                status TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        connection.execute("""
            CREATE TABLE IF NOT EXISTS analysis_results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                scan_id TEXT NOT NULL UNIQUE,
                detection_count INTEGER NOT NULL,
                detections TEXT NOT NULL,
                confidence_threshold REAL NOT NULL,
                annotated_image TEXT,
                analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(scan_id) REFERENCES scans(id)
            )
        """)

        connection.commit()


def create_scan(scan_id, filename, modality, file_path):
    with get_connection() as connection:
        connection.execute("""
            INSERT INTO scans
            (id, filename, modality, file_path, status)
            VALUES (?, ?, ?, ?, ?)
        """, (
            scan_id,
            filename,
            modality,
            str(file_path),
            "uploaded"
        ))


def get_scan(scan_id):
    with get_connection() as connection:
        return connection.execute(
            "SELECT * FROM scans WHERE id = ?",
            (scan_id,)
        ).fetchone()


def get_all_scans():
    with get_connection() as connection:
        return connection.execute("""
            SELECT id, filename, modality, status, created_at
            FROM scans
            ORDER BY created_at DESC
        """).fetchall()


def save_analysis(scan_id, result):
    with get_connection() as connection:
        connection.execute("""
            INSERT INTO analysis_results
            (scan_id, detection_count, detections,
             confidence_threshold, annotated_image)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(scan_id) DO UPDATE SET
                detection_count = excluded.detection_count,
                detections = excluded.detections,
                confidence_threshold = excluded.confidence_threshold,
                annotated_image = excluded.annotated_image,
                analyzed_at = CURRENT_TIMESTAMP
        """, (
            scan_id,
            result["detection_count"],
            json.dumps(result["detections"]),
            result["confidence_threshold"],
            result["annotated_image"]
        ))

        connection.execute(
            "UPDATE scans SET status = ? WHERE id = ?",
            ("analyzed", scan_id)
        )


def get_analysis(scan_id):
    with get_connection() as connection:
        row = connection.execute(
            "SELECT * FROM analysis_results WHERE scan_id = ?",
            (scan_id,)
        ).fetchone()

        if not row:
            return None

        result = dict(row)
        result["detections"] = json.loads(result["detections"])
        return result


def update_scan_status(scan_id, status):
    with get_connection() as connection:
        connection.execute(
            "UPDATE scans SET status = ? WHERE id = ?",
            (status, scan_id)
        )
