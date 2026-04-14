import uuid

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def unique_user(prefix: str) -> tuple[str, str, str]:
    suffix = uuid.uuid4().hex[:8]
    username = f"{prefix}_{suffix}"
    email = f"{prefix}_{suffix}@example.com"
    password = "testpass123"
    return username, email, password


def test_admin_login_rejects_normal_user():
    username, email, password = unique_user("player")

    register = client.post(
        "/api/auth/register",
        json={"username": username, "email": email, "password": password},
    )
    assert register.status_code == 200

    admin_login = client.post(
        "/api/auth/admin/login",
        json={"username": email, "password": password},
    )
    assert admin_login.status_code == 403


def test_admin_puzzles_requires_admin_token():
    username, email, password = unique_user("player2")

    register = client.post(
        "/api/auth/register",
        json={"username": username, "email": email, "password": password},
    )
    assert register.status_code == 200
    token = register.json()["token"]

    forbidden = client.get(
        "/api/puzzles",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert forbidden.status_code == 403


def test_admin_register_and_access_puzzles():
    username, email, password = unique_user("admin")

    admin_register = client.post(
        "/api/auth/admin/register",
        json={"username": username, "email": email, "password": password},
    )
    assert admin_register.status_code == 200
    payload = admin_register.json()

    assert payload["user"]["isAdmin"] is True

    token = payload["token"]
    ok = client.get(
        "/api/puzzles",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert ok.status_code == 200
    assert isinstance(ok.json(), list)
