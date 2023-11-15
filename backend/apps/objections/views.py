from django.shortcuts import render
from rest_framework import viewsets
from .models import Objection
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import ObjectionGetSerializer, ObjectionPostSerializer


class ObjectionViewSet(viewsets.ModelViewSet):
    """ViewSet for the Document model"""

    queryset = Objection.objects.all()

    # permission_classes = [DocumentPermission]
    parser_classes = [MultiPartParser, FormParser]

    http_method_names = ['get', 'head', 'post', 'delete']

    # Return different serializers for different actions
    def get_serializer_class(self):
        if self.action == 'create':
            return ObjectionPostSerializer

        return ObjectionGetSerializer

    def perform_create(self, serializer):
        serializer.save(
            content_type=self.request.data.get('document').content_type, user=self.request.user)

    def get_queryset(self):
        return Objection.objects.filter(user=self.request.user)
