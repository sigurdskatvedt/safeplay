from .models import Match, Team
from rest_framework import serializers

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'

class MatchSerializer(serializers.ModelSerializer):
    team1 = TeamSerializer()
    team2 = TeamSerializer()

    class Meta:
        model = Match
        fields = '__all__'

