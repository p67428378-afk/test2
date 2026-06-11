
import os, re, sys, json
_PYTHON_STDLIB = sys.stdlib_module_names if sys.version_info >= (3, 10) else set()
_COMMON_ALIASES = {"PIL": "pillow", "cv2": "opencv-python", "sklearn": "scikit-learn", "yaml": "pyyaml", "dotenv": "python-dotenv", "jwt": "pyjwt", "bs4": "beautifulsoup4", "dateutil": "python-dateutil", "jose": "python-jose", "multipart": "python-multipart", "passlib": "passlib", "decouple": "python-decouple", "aiofiles": "aiofiles", "google.cloud": "google-cloud-core", "google.auth": "google-auth", "starlette": "starlette", "pydantic": "pydantic", "fastapi": "fastapi", "uvicorn": "uvicorn", "sqlalchemy": "sqlalchemy", "alembic": "alembic", "celery": "celery", "redis": "redis", "pymongo": "pymongo", "motor": "motor", "httpx": "httpx", "aiohttp": "aiohttp", "requests": "requests", "cryptography": "cryptography", "tzdata": "tzdata", "zoneinfo": "tzdata"}

def extract_imports_ast(filepath):
    try:
        import ast
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            source = f.read()
        tree = ast.parse(source, filename=filepath)
        imports = []
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    imports.append(alias.name.split(".")[0])
            elif isinstance(node, ast.ImportFrom):
                if node.module and node.level == 0:
                    imports.append(node.module.split(".")[0])
        return imports
    except Exception:
        return []

def discover_local_modules(workspace):
    modules = set()
    for root, dirs, files in os.walk(workspace):
        dirs[:] = [d for d in dirs if not d.startswith(".") and d not in ("__pycache__", ".venv", "venv", "node_modules")]
        if "__init__.py" in files:
            modules.add(os.path.basename(root))
        for fname in files:
            if fname.endswith(".py") and fname != "__init__.py":
                modules.add(fname[:-3])
    return modules

def parse_requirements(workspace):
    declared = set()
    req_file = os.path.join(workspace, "server", "requirements.txt")
    if not os.path.exists(req_file):
        req_file = os.path.join(workspace, "requirements.txt")
    if os.path.exists(req_file):
        with open(req_file, "r", encoding="utf-8", errors="ignore") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and not line.startswith("-"):
                    pkg = re.split(r"[>=<!~\s\[]", line)[0].strip()
                    if pkg:
                        declared.add(pkg.lower().replace("-", "_"))
    return declared

workspace = "."
all_imports = set()
for root, dirs, files in os.walk(workspace):
    dirs[:] = [d for d in dirs if not d.startswith(".") and d not in ("__pycache__", ".venv", "venv", "node_modules")]
    for fname in files:
        if fname.endswith(".py") and fname != ".auto_deps.py":
            all_imports.update(extract_imports_ast(os.path.join(root, fname)))

local_modules = discover_local_modules(workspace)
declared = parse_requirements(workspace)

root_packages = set()
for item in os.listdir(workspace):
    item_path = os.path.join(workspace, item)
    if os.path.isdir(item_path) and not item.startswith(".") and item not in ("node_modules", "venv", ".venv"):
        if os.path.isfile(os.path.join(item_path, "__init__.py")):
            root_packages.add(item)
            root_packages.add(item.lower())

missing_packages = {}
for pkg in all_imports:
    pkg_l = pkg.lower()
    if pkg_l in _PYTHON_STDLIB:
        continue
    if pkg in local_modules or pkg_l in local_modules:
        continue
    if pkg in root_packages or pkg_l in root_packages:
        continue
    normalised = pkg_l.replace("-", "_")
    if normalised in declared:
        continue
    alias = _COMMON_ALIASES.get(pkg, "").lower().replace("-", "_")
    if alias and alias in declared:
        continue
    pypi_name = _COMMON_ALIASES.get(pkg, pkg)
    missing_packages[pkg] = pypi_name

if not missing_packages:
    print("✓ All imports are already declared.")
    sys.exit(0)

# Write missing to requirements
req_file = os.path.join(workspace, "server", "requirements.txt")
if not os.path.exists(req_file):
    req_file = os.path.join(workspace, "requirements.txt")

with open(req_file, "r+", encoding="utf-8", errors="ignore") as f:
    content = f.read().strip()
    lines = content.splitlines() if content else []
    for import_name, pypi_name in missing_packages.items():
        if pypi_name not in lines:
            lines.append(pypi_name)
    f.seek(0)
    f.write("\n".join(sorted(set(lines))) + "\n")
    f.truncate()

print("✓ Added packages:", list(missing_packages.values()))
