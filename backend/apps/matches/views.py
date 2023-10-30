# backend/apps/matches/views.py

from django.http import JsonResponse
from .models import Match
from .serializers import MatchSerializer
from rest_framework import viewsets

class MatchViewSet(viewsets.ModelViewSet):
    queryset = Match.objects.all().prefetch_related('consent_requests')
    serializer_class = MatchSerializer

