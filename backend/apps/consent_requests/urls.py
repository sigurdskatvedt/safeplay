from django.urls import path
from .views import UserConsentRequestViewSet, ApproveRequestView, RemoveApprovalView, PastConsentRequestsView

urlpatterns = [
    # Manually define URL for listing consent requests
    path('consent-requests/', UserConsentRequestViewSet.as_view({'get': 'list'}), name='consent-request-list'),

    # URL pattern for approving a request (already defined)
    path('consent-requests/approve/', ApproveRequestView.as_view(), name='approve_request'),

    # URL pattern for removing approval (already defined)
    path('consent-requests/remove-approval/', RemoveApprovalView.as_view(), name='remove_approval'),

    # URL pattern for listing past requests (already defined)
    path('consent-requests/past-requests/', PastConsentRequestsView.as_view(), name='past_requests'),
]

