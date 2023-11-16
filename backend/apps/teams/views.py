from rest_framework import generics, mixins, status
from rest_framework.response import Response
from .models import Team
from .serializers import TeamSerializer


class TeamListView(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        description = request.data.get('description', '')
        if len(description) > 255:
            return Response({'error': 'Description must be less than 256 characters.'}, status=status.HTTP_400_BAD_REQUEST)

        return self.create(request, *args, **kwargs)
