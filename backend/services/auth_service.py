import base64
import hashlib
import hmac
import json
import os
import secrets
import time
from pathlib import Path

USERS_FILE = Path(__file__).resolve().parent.parent / "db" / "users.json"
TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7
SECRET = os.getenv("AUTH_SECRET", "podcastai-dev-secret")


def _load_users():
    if not USERS_FILE.exists():
        return []
    with USERS_FILE.open("r", encoding="utf-8") as file:
        return json.load(file)


def _save_users(users):
    USERS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with USERS_FILE.open("w", encoding="utf-8") as file:
        json.dump(users, file, indent=2)


def _hash_password(password, salt):
    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        120000,
    )
    return base64.urlsafe_b64encode(password_hash).decode("utf-8")


def _b64url_encode(value):
    return base64.urlsafe_b64encode(value).decode("utf-8").rstrip("=")


def _b64url_decode(value):
    padding = "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode(value + padding)


def _sign(data):
    return hmac.new(SECRET.encode("utf-8"), data, hashlib.sha256).digest()


def get_user_by_email(email):
    normalized_email = email.strip().lower()
    users = _load_users()
    return next((user for user in users if user["email"] == normalized_email), None)


def create_user(name, email, password):
    normalized_email = email.strip().lower()
    if get_user_by_email(normalized_email):
        raise ValueError("User already exists")

    users = _load_users()
    salt = secrets.token_hex(16)
    password_hash = _hash_password(password, salt)

    user = {
        "id": secrets.token_hex(12),
        "name": name.strip(),
        "email": normalized_email,
        "salt": salt,
        "password_hash": password_hash,
        "plan": "Free",
        "created_at": int(time.time()),
    }

    users.append(user)
    _save_users(users)

    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "plan": user["plan"],
    }


def authenticate_user(email, password):
    user = get_user_by_email(email)
    if not user:
        return None

    candidate_hash = _hash_password(password, user["salt"])
    if not hmac.compare_digest(candidate_hash, user["password_hash"]):
        return None

    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "plan": user["plan"],
    }


def create_token(user):
    payload = {
        "sub": user["id"],
        "name": user["name"],
        "email": user["email"],
        "plan": user.get("plan", "Free"),
        "exp": int(time.time()) + TOKEN_TTL_SECONDS,
    }
    payload_bytes = json.dumps(payload, separators=(",", ":")).encode("utf-8")
    encoded_payload = _b64url_encode(payload_bytes)
    signature = _b64url_encode(_sign(encoded_payload.encode("utf-8")))
    return f"{encoded_payload}.{signature}"


def verify_token(token):
    try:
        encoded_payload, signature = token.split(".", 1)
        expected_signature = _b64url_encode(_sign(encoded_payload.encode("utf-8")))
        if not hmac.compare_digest(signature, expected_signature):
            return None

        payload = json.loads(_b64url_decode(encoded_payload).decode("utf-8"))
        if payload.get("exp", 0) < int(time.time()):
            return None

        return {
            "id": payload["sub"],
            "name": payload["name"],
            "email": payload["email"],
            "plan": payload.get("plan", "Free"),
        }
    except Exception:
        return None
