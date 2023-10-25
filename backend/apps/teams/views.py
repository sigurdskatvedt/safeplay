from rest_framework import generics
from .models import Team
from .serializers import TeamSerializer

class TeamCreateView(generics.CreateAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

