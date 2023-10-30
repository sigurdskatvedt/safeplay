# apps/fields/views.py

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import Field, Booking


class FieldViewSet(viewsets.ViewSet):
    @action(detail=True, methods=['post'])
    def book(self, request, field_id):
        if request.method == 'POST':
            # Extract start_time and end_time from the request body
            start_time = request.data.get('start_time')
            end_time = request.data.get('end_time')

            field = get_object_or_404(Field, id=field_id)
            bookings = Booking.objects.filter(field=field)

            # Convert start_time and end_time to datetime objects
            # ...

            # Check if the requested time period is available
            for booking in bookings:
                if (start_time >= booking.start_time and start_time < booking.end_time) or \
                   (end_time > booking.start_time and end_time <= booking.end_time):
                    return Response({'error': 'Field is not available during the requested time period'})

            # Create a new booking
            new_booking = Booking.objects.create(field=field, start_time=start_time, end_time=end_time)
            return Response({'message': 'Field booked successfully', 'booking_id': new_booking.id})
        else:
            return Response({'error': 'Invalid request method'})

