# server/tests/conftest.py
import sys
import os

# Ensure the repo root is at the very beginning of sys.path
repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if repo_root in sys.path:
    sys.path.remove(repo_root)
sys.path.insert(0, repo_root)

# Remove any path ending with 'server' to prevent duplicate imports
sys.path = [
    p
    for p in sys.path
    if not p.endswith("server")
    and not p.endswith("server\\")
    and not p.endswith("server/")
]
