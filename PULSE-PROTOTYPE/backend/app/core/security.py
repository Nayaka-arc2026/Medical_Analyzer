
import re


def sanitize_filename(filename: str) -> str:
    filename = filename.replace("\\", "/").split("/")[-1]

    filename = re.sub(
        r"[^a-zA-Z0-9._-]",
        "_",
        filename
    )

    return filename[:100] or "medical_scan"
