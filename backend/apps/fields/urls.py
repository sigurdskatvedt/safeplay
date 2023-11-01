from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FieldViewSet, BookFieldView

router = DefaultRouter()
router.register(r'fields', FieldViewSet, basename='field')

urlpatterns = [
    path('', include(router.urls)),
    path('<int:field_id>/book/', BookFieldView.as_view(), name='book-field'),
]
