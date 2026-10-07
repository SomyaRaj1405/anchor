"""Pytest configuration for Anchor backend tests."""

import sys
from pathlib import Path

# Ensure backend directory is at the beginning of sys.path so app refers to backend/app
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))
elif sys.path[0] != str(BACKEND_DIR):
    sys.path.remove(str(BACKEND_DIR))
    sys.path.insert(0, str(BACKEND_DIR))

# If root directory is in sys.path and has app.py, ensure it doesn't mask app package
ROOT_DIR = BACKEND_DIR.parent
if "app" in sys.modules and not hasattr(sys.modules["app"], "__path__"):
    del sys.modules["app"]
