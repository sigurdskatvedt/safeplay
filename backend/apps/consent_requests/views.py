# backend/apps/consent_requests/views.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import ConsentRequest
from .serializers import ConsentRequestSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone


class ConsentRequestViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ConsentRequestSerializer
    queryset = ConsentRequest.objects.all()  # Add this line

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'guardian':
            print("hello")
            return ConsentRequest.objects.filter(user__guardian=user, match__date_time__gte=timezone.now(), request_status="pending")
        else:
            return ConsentRequest.objects.filter(user=user, match__date_time__gte=timezone.now(), request_status="pending")

    def get_past_requests(self):
        user = self.request.user
        if user.user_type == 'guardian':
            # Filter past requests where the current user is the guardian of the associated user
            return ConsentRequest.objects.filter(user__guardian=user, match__date_time__lt=timezone.now())
        else:
            # If not a guardian, return the user's own past requests
            return ConsentRequest.objects.filter(user=user, match__date_time__lt=timezone.now())


class AllConsentRequestViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ConsentRequestSerializer
    queryset = ConsentRequest.objects.all()

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'guardian':
            print("hello")
            return ConsentRequest.objects.filter(user__guardian=user, match__date_time__gte=timezone.now(), request_status="pending")
        else:
            return ConsentRequest.objects.filter(user=user, match__date_time__gte=timezone.now(), request_status="pending")

    def get_past_requests(self):
        user = self.request.user
        if user.user_type == 'guardian':
            # Filter past requests where the current user is the guardian of the associated user
            return ConsentRequest.objects.filter(user__guardian=user, match__date_time__lt=timezone.now())
        else:
            # If not a guardian, return the user's own past requests
            return ConsentRequest.objects.filter(user=user, match__date_time__lt=timezone.now())


class UserConsentRequestViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ConsentRequestSerializer

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'guardian':
            print("objects: ", ConsentRequest.objects.filter(user__guardian=user))
            return ConsentRequest.objects.filter(user__guardian=user, match__date_time__gte=timezone.now())
        else:
            return ConsentRequest.objects.filter(user=user, match__date_time__gte=timezone.now())

    def get_past_requests(self):
        user = self.request.user
        if user.user_type == 'guardian':
             # Filter past requests where the current user is the guardian of the associated user
            return ConsentRequest.objects.filter(user__guardian=user, match__date_time__lt=timezone.now())
        else:
            # If not a guardian, return the user's own past requests
            return ConsentRequest.objects.filter(user=user, match__date_time__lt=timezone.now())


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_request(request, request_id):
    user = request.user
    if user.user_type != 'guardian':
        return Response({"error": "Only guardians can approve requests.", "error_code": "not_guardian"}, status=403)

    try:
        # Check if the consent request is for a player under the guardianship of the current user
        consent_request = ConsentRequest.objects.get(
            id=request_id, user__guardian=user)
        consent_request.request_status = "accepted"
        consent_request.save()
        return Response({"message": "Request approved successfully."}, status=200)
    except ConsentRequest.DoesNotExist:
        return Response({"error": "Request not found or you are not the guardian of the player."}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_approval(request, request_id):
    user = request.user
    if user.user_type != 'guardian':
        return Response({"error": "Only guardians can remove approvals.", "error_code": "not_guardian"}, status=403)

    try:
        # Check if the consent request is for a player under the guardianship of the current user
        consent_request = ConsentRequest.objects.get(
            id=request_id, user__guardian=user)
        consent_request.request_status = "declined"
        consent_request.save()
        return Response({"message": "Approval removed successfully."}, status=200)
    except ConsentRequest.DoesNotExist:
        return Response({"error": "Request not found or you are not the guardian of the player."}, status=404)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def past_consent_requests(request):
    viewset = ConsentRequestViewSet(request=request)
    past_requests = viewset.get_past_requests()
    serializer = ConsentRequestSerializer(past_requests, many=True)
    return Response(serializer.data)
