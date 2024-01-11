from django.urls import path
from .views import MatchViewSet, CreateMatchView

urlpatterns = [
    # Manually define URL for listing matches
    path('matches/', MatchViewSet.as_view({'get': 'list'}), name='match-list'),

     # URL pattern for creating a match (already defined)
    path('matches/create_match/', CreateMatchView.as_view(), name='create-match'),
]

