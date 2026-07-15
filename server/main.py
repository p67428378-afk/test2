from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
import os
from server.api.v1.endpoints import password_reset
from server.app.api.v1.endpoints import schedule
from server.database import Base, engine

# Import models to ensure they are registered on Base.metadata before creation

Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    # Extract the first error message and put it in detail as a string to satisfy QA test
    errors = exc.errors()
    detail_msg = "Validation error"
    if errors:
        # Convert any non-serializable objects (like ValueError) to string
        err = errors[0]
        msg = err.get("msg", "Validation error")
        if isinstance(msg, Exception):
            detail_msg = str(msg)
        else:
            detail_msg = str(msg)

    # Clean up errors list to make sure it is fully JSON serializable
    serializable_errors = []
    for error in errors:
        clean_error = dict(error)
        if "ctx" in clean_error:
            clean_ctx = {}
            for k, v in clean_error["ctx"].items():
                if isinstance(v, Exception):
                    clean_ctx[k] = str(v)
                else:
                    clean_ctx[k] = v
            clean_error["ctx"] = clean_ctx
        if isinstance(clean_error.get("msg"), Exception):
            clean_error["msg"] = str(clean_error["msg"])
        serializable_errors.append(clean_error)

    return JSONResponse(
        status_code=422, content={"detail": detail_msg, "errors": serializable_errors}
    )


ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(schedule.router, prefix="/api/v1", tags=["schedule"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Password Reset Microservice"}
