from django.urls import path
from .views import trending_movies, movie_details, search_movie

urlpatterns = [
    path("trending/", trending_movies),
    path("details/<int:movie_id>/", movie_details),
    path("search/", search_movie),
]
