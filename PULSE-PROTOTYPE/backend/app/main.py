
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.database import initialize_database
from app.config import APP_NAME, APP_VERSION


@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize_database()
    yield


app = FastAPI(
    title=APP_NAME,
    description="Medical Image Analysis Platform",
    version=APP_VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(
    router,
    prefix="/api/v1",
    tags=["Medical Imaging"]
)


@app.get("/")
async def root():
    return {
        "application": APP_NAME,
        "version": APP_VERSION,
        "status": "running",
        "documentation": "/docs"
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": APP_NAME,
        "version": APP_VERSION
    }
@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize_database()

    from app.services.model_service import model_service
    model_service.load_models()

    yield