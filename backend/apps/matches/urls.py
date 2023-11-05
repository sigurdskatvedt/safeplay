# backend/apps/matches/urls.py

from django.urls import path
from .views import MatchViewSet, CreateMatchView
from rest_framework.routers import DefaultRouter

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'matches', MatchViewSet)

urlpatterns = router.urls

# Add the URL pattern for creating a match
urlpatterns += [
    path('create_match/', CreateMatchView.as_view(), name='create-match'),
]
