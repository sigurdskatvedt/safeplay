from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserConsentRequestViewSet, approve_request, remove_approval, past_consent_requests

router = DefaultRouter()
router.register(r'user-requests', UserConsentRequestViewSet,
                basename='user-consent-request')


urlpatterns = [
    path('', include(router.urls)),
    path('approve/<int:request_id>/', approve_request, name='approve_request'),
    path('remove-approval/<int:request_id>/',
         remove_approval, name='remove_approval'),
    path('past_requests/', past_consent_requests, name='past-requests'),
]
