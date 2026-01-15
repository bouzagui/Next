"""Lightweight TMDB HTTP client with connection pooling and retries.

This module centralizes TMDB calls and improves robustness compared to
making ad-hoc `requests.get` calls. It uses a shared `requests.Session`
with a retry/backoff policy and encodes query parameters using
`params=`. Exceptions from `requests` are logged and re-raised so views
can handle them and translate to appropriate HTTP responses.
"""

from typing import Any, Dict, Optional
import logging
import os

import requests
from requests.adapters import HTTPAdapter
from urllib3.util import Retry

logger = logging.getLogger(__name__)

# Read API token at import time and fail-fast if it's missing.
TMDB_TOKEN = os.getenv("TMDB_API_KEY")
if not TMDB_TOKEN:
    # When running in production it's better to fail early than to have
    # confusing runtime errors later on.
    raise RuntimeError("TMDB_API_KEY environment variable is not set")

BASE_URL = "https://api.themoviedb.org/3"
HEADERS = {"Authorization": f"Bearer {TMDB_TOKEN}"}

# A short default timeout for upstream requests (in seconds).
DEFAULT_TIMEOUT = 10

# Create a global session with retry/backoff. This improves performance
# (connection pooling) and resilience for transient errors (5xx, 429).
SESSION = requests.Session()
retries = Retry(
    total=3,
    backoff_factor=0.3,
    status_forcelist=[429, 500, 502, 503],
    allowed_methods=["HEAD", "GET", "OPTIONS"],
)
adapter = HTTPAdapter(max_retries=retries)
SESSION.mount("https://", adapter)
SESSION.mount("http://", adapter)


def _get(path: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Perform a GET to the given TMDB API path and return parsed JSON.

    Args:
        path: API path starting with a leading slash, e.g. '/trending/movie/day'
        params: Optional query parameters to include in the request.

    Raises:
        requests.exceptions.RequestException: propagated so callers can
            map the exception to an HTTP response.
    """
    url = f"{BASE_URL}{path}"
    try:
        resp = SESSION.get(url, headers=HEADERS, params=params, timeout=DEFAULT_TIMEOUT)
        resp.raise_for_status()
        return resp.json()
    except requests.exceptions.RequestException as exc:
        # Log the exception with context; re-raise so the view layer can
        # decide how to present the error to the client.
        status_code = getattr(exc.response, "status_code", None) if hasattr(exc, "response") else None
        logger.exception("TMDB request failed: %s %s (status=%s)", url, params, status_code)
        raise


def get_trending_movies() -> Dict[str, Any]:
    """Get daily trending movies from TMDB.

    Returns the raw TMDB JSON (typically contains a `results` list).
    """
    return _get("/trending/movie/day")


def get_movie_details(movie_id: int) -> Dict[str, Any]:
    """Get details for a single movie id.

    Args:
        movie_id: The TMDB movie id.
    """
    return _get(f"/movie/{movie_id}")


def search_movies(query: str) -> Dict[str, Any]:
    """Search for movies using a query string.

    Uses `params` so the query is properly URL encoded.
    """
    return _get("/search/movie", params={"query": query})

