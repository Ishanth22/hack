from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import startup_routes, metrics_routes, analytics_routes
from app.database import connect_db, close_db

app = FastAPI(
    title="Startup Progress Monitor API",
    description="Track and analyze startup growth metrics with ML-powered risk detection",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_event_handler("startup", connect_db)
app.add_event_handler("shutdown", close_db)

app.include_router(startup_routes.router, prefix="/api", tags=["Startups"])
app.include_router(metrics_routes.router, prefix="/api", tags=["Metrics"])
app.include_router(analytics_routes.router, prefix="/api", tags=["Analytics"])


@app.get("/")
def root():
    return {"message": "Startup Progress Monitor API v1.0", "status": "operational"}


@app.get("/health")
def health():
    return {"status": "healthy"}
