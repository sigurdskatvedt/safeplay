from rest_framework import serializers
from .models import Team
from rest_framework.permissions import BasePermission, IsAuthenticated

class IsManager(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_manager

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'created_at', 'updated_at']

