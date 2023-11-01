# apps/fields/urls.py

from django.urls import path
from .views import BookFieldView, BookingsView

urlpatterns = [
    path('<int:field_id>/book/', BookFieldView.as_view(), name='book-field'),
    path('bookings/', BookingsView.as_view(), name='bookings'),
]

