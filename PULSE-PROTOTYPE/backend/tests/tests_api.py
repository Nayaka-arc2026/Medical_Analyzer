
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_root():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json()["status"] == "running"


def test_health():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_models():
    response = client.get("/api/v1/models")

    assert response.status_code == 200
    assert "brain" in response.json()["models"]


def test_invalid_modality():
    response = client.post(
        "/api/v1/scans/upload",
        params={"modality": "unknown"},
    )

    assert response.status_code == 422
