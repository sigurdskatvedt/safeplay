from django.urls import path
from .views import ObjectionAPIView, ObjectionViewSet
from rest_framework.routers import DefaultRouter


# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'objections', ObjectionViewSet)

urlpatterns = router.urls

# Add the URL pattern for creating a match
urlpatterns += [
    path('create_objection/', ObjectionAPIView.as_view(), name='create-objection'),
    ]
