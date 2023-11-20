from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserConsentRequestViewSet
from apps.consent_requests import views

router = DefaultRouter()
router.register(r'user-requests', UserConsentRequestViewSet,
                basename='user-consent-request')


urlpatterns = [
    path('', include(router.urls)),
    path('approve/', views.ApproveRequestView.as_view(),
         name='approve_request'),
    path('remove-approval/', views.RemoveApprovalView.as_view(),
         name='remove_approval'),
    path('past-requests/', views.PastConsentRequestsView.as_view(),
         name='past-requests'),
]
