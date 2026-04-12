from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.auth.exceptions import AuthError
from fastapi.middleware.cors import CORSMiddleware # CORS
from app.auth.router import router as auth_router
from app.dashboard.router import router as dashboard_router
from app.analytics.router import router as analytics_router
from app.expenses.router import router as expenses_router
from app.goals.router import router as goals_router
from app.notifications.router import router as notifications_router
from app.onboarding.router import router as onboarding_router
from app.rollover.router import router as rollover_router
from app.insights.router import router as insights_router

app = FastAPI()

# Include routers
app.include_router(auth_router, tags=["Auth"])
app.include_router(dashboard_router, tags=["Dashboard"])
app.include_router(analytics_router, tags=["Analytics"])
app.include_router(expenses_router, tags=["Expenses"])
app.include_router(goals_router, tags=["Goals"])
app.include_router(notifications_router, tags=["Notifications"])
app.include_router(onboarding_router, tags=["Onboarding"])
app.include_router(rollover_router, tags=["Rollover"])
app.include_router(insights_router, tags=["Insights"])

# Frontend origin
origins = [
    "https://www.allocare.online",
    "https://allocare.online",
    "http://localhost:3000"
]

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Set-Cookie", "Authorization", "Access-Control-Allow-Credentials"],
)

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