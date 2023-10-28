from django.urls import path
from . import views

urlpatterns = [
    path('matches/', views.matches_list, name='matches_list'),
    #   path('api/matches/<int:match_id>/consent-requests/', views.consent_requests, name='consent_requests'),
]
