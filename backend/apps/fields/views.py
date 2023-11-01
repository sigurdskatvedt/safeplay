from rest_framework import viewsets
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from .models import Field, Booking
from django.utils.dateparse import parse_datetime


class BookFieldView(APIView):
    def post(self, request, field_id):
        field = get_object_or_404(Field, pk=field_id)
        # ... (rest of the implementation)

        start_time = parse_datetime(request.data.get('start_time'))
        end_time = parse_datetime(request.data.get('end_time'))

        if start_time is None or end_time is None:
            return Response({'error': 'Invalid start_time or end_time'})

        bookings = Booking.objects.filter(field=field)

        for booking in bookings:
            if (start_time >= booking.start_time and start_time < booking.end_time) or \
               (end_time > booking.start_time and end_time <= booking.end_time):
                return Response({'error': 'Field is not available during the requested time period'})

        new_booking = Booking.objects.create(
            field=field, start_time=start_time, end_time=end_time)
        return Response({'message': 'Field booked successfully', 'booking_id': new_booking.id})
