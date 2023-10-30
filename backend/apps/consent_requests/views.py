# backend/apps/consent_requests/views.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import ConsentRequest
from .serializers import ConsentRequestSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response


class ConsentRequestViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ConsentRequestSerializer
    queryset = ConsentRequest.objects.all()  # Add this line

    def get_queryset(self):
        # Return only the pending requests for the authenticated user
        return ConsentRequest.objects.filter(user=self.request.user, is_approved=False)


class AllConsentRequestViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ConsentRequestSerializer
    queryset = ConsentRequest.objects.all()


class UserConsentRequestViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ConsentRequestSerializer

    def get_queryset(self):
        return ConsentRequest.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_request(request, request_id):
    try:
        consent_request = ConsentRequest.objects.get(
            id=request_id, user=request.user)
        consent_request.is_approved = True
        consent_request.save()
        return Response({"message": "Request approved successfully."}, status=200)
    except ConsentRequest.DoesNotExist:
        return Response({"error": "Request not found."}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_approval(request, request_id):
    try:
        consent_request = ConsentRequest.objects.get(
            id=request_id, user=request.user)
        consent_request.is_approved = False
        consent_request.save()
        return Response({"message": "Approval removed successfully."}, status=200)
    except ConsentRequest.DoesNotExist:
        return Response({"error": "Request not found."}, status=404)
