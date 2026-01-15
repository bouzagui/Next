from typing import Any, Dict

import requests
from django.views.decorators.cache import cache_page
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .services.tmdb import get_trending_movies, get_movie_details, search_movies
from .serializers import MovieSerializer

# Cache the trending endpoint for 10 minutes (adjust between 5-15m as needed)
CACHE_TTL_SECONDS = 60 * 10


@cache_page(CACHE_TTL_SECONDS)
@api_view(["GET"])
def trending_movies(request):
    """Return a list of trending movies (cached).

    This view calls the TMDB service and serializes the raw movie dicts
    using `MovieSerializer`. The view maps upstream network errors to
    appropriate HTTP responses so the frontend can react accordingly.
    """
    try:
        data: Dict[str, Any] = get_trending_movies()
    except requests.exceptions.Timeout:
        return Response({"detail": "Upstream timed out"}, status=status.HTTP_504_GATEWAY_TIMEOUT)
    except requests.exceptions.ConnectionError:
        return Response({"detail": "Could not connect to upstream service"}, status=status.HTTP_502_BAD_GATEWAY)
    except requests.exceptions.HTTPError as e:
        # If the upstream responded with a status code, forward it where
        # it makes sense; otherwise, return a generic 502.
        upstream_status = getattr(e.response, "status_code", None) if getattr(e, "response", None) else None
        return Response({"detail": "Upstream service error"}, status=upstream_status or status.HTTP_502_BAD_GATEWAY)
    except requests.exceptions.RequestException:
        return Response({"detail": "Upstream request failed"}, status=status.HTTP_502_BAD_GATEWAY)

    # TMDB returns the list under the 'results' key; default to empty list.
    results = data.get("results", []) if isinstance(data, dict) else []

    # Use the DRF serializer to produce the clean JSON for the frontend.
    serializer = MovieSerializer(instance=results, many=True)
    return Response(serializer.data)
@api_view(["GET"])
def movie_details(request, movie_id):
    data = get_movie_details(movie_id)
    return Response(data)

@api_view(["GET"])
def search_movie(request):
    query = request.GET.get("q", "")
    data = search_movies(query)
    return Response(data)
