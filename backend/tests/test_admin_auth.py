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


def test_player_total_score_uses_best_score_per_building():
    admin_username, admin_email, admin_password = unique_user("admin_summary")
    admin_register = client.post(
        "/api/auth/admin/register",
        json={"username": admin_username, "email": admin_email, "password": admin_password},
    )
    assert admin_register.status_code == 200
    admin_token = admin_register.json()["token"]

    player_username, player_email, player_password = unique_user("player_summary")
    player_register = client.post(
        "/api/auth/register",
        json={"username": player_username, "email": player_email, "password": player_password},
    )
    assert player_register.status_code == 200
    player_payload = player_register.json()
    player_token = player_payload["token"]

    building_id = f"building-{uuid.uuid4().hex[:8]}"
    first_attempt = client.post(
        "/api/scores/submit",
        json={
            "buildingId": building_id,
            "score": 120,
            "livesRemaining": 2,
            "timeTaken": 90,
        },
        headers={"Authorization": f"Bearer {player_token}"},
    )
    assert first_attempt.status_code == 200

    second_attempt = client.post(
        "/api/scores/submit",
        json={
            "buildingId": building_id,
            "score": 260,
            "livesRemaining": 1,
            "timeTaken": 75,
        },
        headers={"Authorization": f"Bearer {player_token}"},
    )
    assert second_attempt.status_code == 200

    players_response = client.get(
        "/api/admin/players",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert players_response.status_code == 200
    players = players_response.json()["players"]
    player_row = next(player for player in players if player["id"] == player_payload["user"]["id"])
    assert player_row["total_score"] == 260
    assert player_row["buildings_completed"] == 1

    detail_response = client.get(
        f"/api/admin/players/{player_payload['user']['id']}",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert detail_response.status_code == 200
    detail = detail_response.json()

    assert detail["summary"]["total_score"] == 260
    assert detail["summary"]["buildings_completed"] == 1
    assert detail["buildings"][building_id]["best_score"] == 260
    assert detail["buildings"][building_id]["attempts"] == 2
