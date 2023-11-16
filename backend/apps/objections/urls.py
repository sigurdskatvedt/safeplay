from django.urls import path
from .views import ObjectionViewSet
from rest_framework.routers import DefaultRouter


# Create a router and register our viewsets with it.
router = DefaultRouter()

urlpatterns = router.urls

# Add the URL pattern for creating a match
urlpatterns += [
    path('objections/create_objection/', ObjectionViewSet.as_view({'post': 'create'}), name='create_objection'),
    ]
