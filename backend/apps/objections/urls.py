from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter


router = DefaultRouter()

router.register('api/objection', views.ObjectionViewSet, basename='objection')

urlpatterns = [*router.urls]


