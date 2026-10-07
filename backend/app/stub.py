"""Anchor Stub Mode Helpers.

When ANCHOR_STUB=1, routes return contract example responses from contract/examples/.
"""

import os
from pathlib import Path

CONTRACT_EXAMPLES_DIR = Path(__file__).resolve().parent.parent.parent / "contract" / "examples"


def is_stub_mode() -> bool:
    """Return True if ANCHOR_STUB environment variable is set to true/1."""
    return os.getenv("ANCHOR_STUB", "0") in ("1", "true", "True")


def get_stub_response(filename: str) -> str:
    """Read and return raw JSON content from contract/examples/."""
    file_path = CONTRACT_EXAMPLES_DIR / filename
    return file_path.read_text(encoding="utf-8")
