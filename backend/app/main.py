from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from auth.exception import AuthError

app = FastAPI()

@app.exception_handler(AuthError)
def auth_error_handler(request: Request, exc: AuthError):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "code": exc.code,
            "message": exc.message
        }
    )


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}