from fastapi import FastAPI

app = FastAPI()

@app.get("/inicio")
def read_root():
    return {"message": "Hello, World"}
