# backend/apps/consent_requests/serializers.py

from .models import ConsentRequest
from apps.teams.models import Team
from apps.matches.models import Match
from apps.users.models import User
from rest_framework import serializers


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class MatchSerializer(serializers.ModelSerializer):
    team1 = TeamSerializer()
    team2 = TeamSerializer()

    class Meta:
        model = Match
        fields = '__all__'


class ConsentRequestSerializer(serializers.ModelSerializer):
    match = MatchSerializer()
    user = UserSerializer()

    class Meta:
        model = ConsentRequest
        fields = '__all__'
