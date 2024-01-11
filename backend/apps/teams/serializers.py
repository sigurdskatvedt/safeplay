from rest_framework import serializers
from .models import Team
from rest_framework.permissions import BasePermission, IsAuthenticated

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id', 'name', 'created_at', 'updated_at']

