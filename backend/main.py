from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow all origins for simplicity, but in a real application, you'd
# want to restrict this to the frontend's domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

count = 0

@app.get("/api/count")
def get_count():
    return {"count": count}

@app.post("/api/increment")
def increment_count():
    global count
    count += 1
    return {"count": count}
