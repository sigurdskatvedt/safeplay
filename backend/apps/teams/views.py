from rest_framework import generics, mixins, status
from rest_framework.response import Response
from .models import Team
from .serializers import TeamSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied


class TeamListView(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    queryset = Team.objects.all()
    serializer_class = TeamSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        user = request.user

        # Check if the user is a manager
        if user.user_type != 'manager':
            raise PermissionDenied("Only managers can create teams")

        description = request.data.get('description', '')
        if len(description) > 255:
            return Response({'error': 'Description must be less than 256 characters.'}, status=status.HTTP_400_BAD_REQUEST)

        return self.create(request, *args, **kwargs)
