from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Objection
from .serializers import ObjectionSerializer, ObjectionPostSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import viewsets


class ObjectionViewSet(viewsets.ModelViewSet):
    queryset = Objection.objects.all()
    serializer_class = ObjectionSerializer


class ObjectionAPIView(APIView):
    def post(self, request):
        serializer = ObjectionPostSerializer(data=request)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Add other methods (put, delete, etc.) as needed
