from django.urls import path
from . import views

urlpatterns = [
    path('teams/', views.TeamCreateView.as_view(), name='create-team'),
]

