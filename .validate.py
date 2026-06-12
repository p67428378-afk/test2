
import os, sys, re, json, subprocess
import ast

_PYTHON_STDLIB = sys.stdlib_module_names if sys.version_info >= (3, 10) else set()
_COMMON_ALIASES = {"PIL": "pillow", "cv2": "opencv-python", "sklearn": "scikit-learn", "yaml": "pyyaml", "dotenv": "python-dotenv", "jwt": "pyjwt", "bs4": "beautifulsoup4", "dateutil": "python-dateutil", "jose": "python-jose", "multipart": "python-multipart", "passlib": "passlib", "decouple": "python-decouple", "aiofiles": "aiofiles", "google.cloud": "google-cloud-core", "google.auth": "google-auth", "starlette": "starlette", "pydantic": "pydantic", "fastapi": "fastapi", "uvicorn": "uvicorn", "sqlalchemy": "sqlalchemy", "alembic": "alembic", "celery": "celery", "redis": "redis", "pymongo": "pymongo", "motor": "motor", "httpx": "httpx", "aiohttp": "aiohttp", "requests": "requests", "cryptography": "cryptography", "tzdata": "tzdata", "zoneinfo": "tzdata"}

def extract_imports_ast(filepath):
    try:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            source = f.read()
        tree = ast.parse(source, filename=filepath)
        imports = []
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    imports.append((alias.name.split(".")[0], node.lineno))
            elif isinstance(node, ast.ImportFrom):
                if node.module and node.level == 0:
                    imports.append((node.module.split(".")[0], node.lineno))
        return imports
    except SyntaxError as e:
        return [("__SYNTAX_ERROR__", e.lineno or 0)]
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
    for d in (workspace, os.path.join(workspace, "server")):
        req = os.path.join(d, "requirements.txt")
        if os.path.exists(req):
            with open(req, "r", encoding="utf-8", errors="ignore") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and not line.startswith("-"):
                        pkg = re.split(r"[>=<!~\s\[]", line)[0].strip()
                        if pkg:
                            declared.add(pkg.lower().replace("-", "_"))
    return declared

workspace = "."
errors = []

# Collect and run compilation
py_files = []
for root, dirs, files in os.walk(workspace):
    dirs[:] = [d for d in dirs if not d.startswith(".") and d not in ("__pycache__", ".venv", "venv", "node_modules", ".git")]
    for fname in files:
        if fname.endswith(".py") and fname not in (".validate.py", ".auto_deps.py"):
            py_files.append(os.path.join(root, fname))

syntax_errors = []
all_imports = {}
for f in py_files:
    imports = extract_imports_ast(f)
    rel = os.path.relpath(f, workspace).replace("\\", "/")
    for pkg, lineno in imports:
        if pkg == "__SYNTAX_ERROR__":
            syntax_errors.append(f"  {rel}:{lineno} — SyntaxError")
        else:
            all_imports.setdefault(rel, []).append((pkg, lineno))

if syntax_errors:
    errors.append("CHECK 1 FAILED — Syntax errors:\n" + "\n".join(syntax_errors))

# Check unresolved imports
local_modules = discover_local_modules(workspace)
declared = parse_requirements(workspace)
missing_imports = []
for rel_path, imports in all_imports.items():
    for pkg, lineno in imports:
        pkg_l = pkg.lower()
        if pkg_l in _PYTHON_STDLIB:
            continue
        if pkg in local_modules or pkg_l in local_modules:
            continue
        normalised = pkg_l.replace("-", "_")
        if normalised in declared:
            continue
        alias = _COMMON_ALIASES.get(pkg, "").lower().replace("-", "_")
        if alias and alias in declared:
            continue
        missing_imports.append(f"  {rel_path}:{lineno} — import '{pkg}' not in requirements")

if missing_imports:
    errors.append("CHECK 2 FAILED — Unresolved imports:\n" + "\n".join(missing_imports))

# Check missing __init__.py
init_errors = []
for root, dirs, files in os.walk(workspace):
    dirs[:] = [d for d in dirs if not d.startswith(".") and d not in ("__pycache__", ".venv", "venv", "node_modules", ".git")]
    has_py = any(f.endswith(".py") and f != "__init__.py" for f in files)
    if has_py and root != workspace and "__init__.py" not in files:
        rel_dir = os.path.relpath(root, workspace).replace("\\", "/")
        init_errors.append(f"  {rel_dir}/ — missing __init__.py")

if init_errors:
    errors.append("CHECK 3 FAILED — Missing __init__.py files:\n" + "\n".join(init_errors))

if errors:
    print(json.dumps({"status": "FAILED", "errors": errors}))
    sys.exit(0)

# Check 4: Install dependencies
# Requirements file resolution
req_file = "server/requirements.txt" if os.path.exists("server/requirements.txt") else "requirements.txt"
if os.path.exists(req_file):
    install_res = subprocess.run(["pip", "install", "-r", req_file], capture_output=True, text=True)
    if install_res.returncode != 0:
        errors.append(f"CHECK 4 FAILED: pip install failed:\n{install_res.stderr}")
        print(json.dumps({"status": "FAILED", "errors": errors}))
        sys.exit(0)

# Check 5: Pytest execution
test_files = []
for root, dirs, files in os.walk(workspace):
    dirs[:] = [d for d in dirs if not d.startswith(".") and d not in ("__pycache__", ".venv", "venv", "node_modules", ".git")]
    for fname in files:
        if fname.startswith("test_") and fname.endswith(".py"):
            test_files.append(os.path.join(root, fname))

if test_files:
    env = os.environ.copy()
    env["TESTING"] = "true"
    env["PYTHONPATH"] = os.path.pathsep.join([os.path.abspath(workspace), os.path.abspath("server")]) + os.path.pathsep + env.get("PYTHONPATH", "")
    
    test_res = subprocess.run(["python", "-m", "pytest", "-v", "--tb=short", "--no-header"], capture_output=True, text=True, env=env)
    if test_res.returncode != 0:
        errors.append(f"CHECK 5 FAILED: pytest did not pass\n{test_res.stdout}\n{test_res.stderr}")
        print(json.dumps({"status": "FAILED", "errors": errors}))
        sys.exit(0)

print(json.dumps({"status": "PASSED"}))
