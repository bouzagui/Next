"""Serializers for the catalog app.

This module defines a DRF `MovieSerializer` which replaces the previous
function-based `movie_serializer`. The serializer exposes a `poster_url`
field that combines TMDB's image base URL with the `poster_path` returned
by the TMDB API so the frontend gets a ready-to-use image URL.
"""

from typing import Any, Dict, Optional

from rest_framework import serializers

# TMDB image base URL (w500 is a commonly used size). Change size if you
# want smaller/larger images (w200, w300, w780, original, etc.).
IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"


class MovieSerializer(serializers.Serializer):
    """Serializer for a TMDB movie JSON object.

    The serializer expects the raw dict returned by TMDB (not a Django
    model). It exposes the most useful fields for the frontend and
    computes `poster_url` from `poster_path`.
    """

    id = serializers.IntegerField()
    title = serializers.CharField()
    overview = serializers.CharField(allow_blank=True, allow_null=True)
    poster_path = serializers.CharField(allow_null=True, required=False)
    poster_url = serializers.SerializerMethodField()
    rating = serializers.FloatField(source="vote_average", default=None)
    release_date = serializers.CharField(allow_null=True, required=False)

    def get_poster_url(self, obj: Dict[str, Any]) -> Optional[str]:
        """Return a full poster URL or None if there is no poster path.

        obj is the raw movie dict from TMDB. We don't mutate it; we only
        derive a helpful URL for the frontend.
        """
        path = obj.get("poster_path")
        if not path:
            return None
        return f"{IMAGE_BASE_URL}{path}"

