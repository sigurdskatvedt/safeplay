# backend/apps/matches/serializers.py

from .models import Match, Team, ConsentRequest
from rest_framework import serializers

class ConsentRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsentRequest
        fields = '__all__'

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'

class MatchSerializer(serializers.ModelSerializer):
    team1 = TeamSerializer()
    team2 = TeamSerializer()
    consent_requests = ConsentRequestSerializer(many=True, read_only=True)

    class Meta:
        model = Match
        fields = '__all__'

