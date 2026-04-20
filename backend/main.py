from fastapi import FastAPI

app = FastAPI()

count = 0

@app.get("/")
def read_root():
    return {"count": count}

@app.post("/increment")
def increment():
    global count
    count += 1
    return {"count": count}
