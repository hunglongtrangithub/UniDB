import os
from pathlib import Path

from textual import log
from gotrue.types import AuthResponse
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(Path(__file__).parents[2] / ".env")

url: str | None = os.environ.get("SUPABASE_URL")
if not url:
    raise ValueError("SUPABASE_URL is required.")
key: str | None = os.environ.get("SUPABASE_KEY")
if not key:
    raise ValueError("SUPABASE_KEY is required.")
supabase: Client = create_client(url, key)


def sign_up(email: str, password: str) -> AuthResponse:
    """Sign up a new user with email and password. Return the session if successful, and None otherwise."""
    session = supabase.auth.sign_up({"email": email, "password": password})
    log.debug(f"Signup session: {session.model_dump_json(indent=4)}")
    return session


def log_in(email: str, password: str) -> AuthResponse:
    """Log in an existing user with email and password. Return the session if successful, and None otherwise."""
    session = supabase.auth.sign_in_with_password(
        {"email": email, "password": password}
    )
    log.debug(f"Login session: {session.model_dump_json(indent=4)}")
    return session


def log_out():
    supabase.auth.sign_out()
