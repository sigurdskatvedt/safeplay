# apps/fields/views.py
import pytz
from datetime import timedelta
from dateutil.parser import isoparse
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .serializers import BookingSerializer, FieldSerializer
from .models import Field, Booking
from django.utils.dateparse import parse_datetime
from django.utils import timezone  # Correct import for timezone


class FieldListView(generics.ListAPIView):
    queryset = Field.objects.all()
    serializer_class = FieldSerializer


class BookingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bookings = Booking.objects.all()
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)


class BookFieldView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, field_id):
        user = request.user

        # Check if the user is a manager
        if user.user_type != 'manager':
            raise PermissionDenied("Only managers can book fields")

        field = get_object_or_404(Field, pk=field_id)
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


class FieldBookingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, field_id):
        field = get_object_or_404(Field, pk=field_id)
        date_str = request.query_params.get('date')
        user_timezone_str = request.query_params.get('timezone')

        if date_str is None:
            return Response({'error': 'Date is required'}, status=status.HTTP_400_BAD_REQUEST)
        if user_timezone_str is None:
            return Response({'error': 'Timezone is required'}, status=status.HTTP_400_BAD_REQUEST)

        date_obj = isoparse(date_str)

        # Convert UTC date to user's timezone
        user_timezone = pytz.timezone(user_timezone_str)
        local_date_obj = date_obj.astimezone(user_timezone)

        start_time = local_date_obj
        end_time = start_time + timedelta(days=1)
        print("end_time:", end_time)

        bookings = Booking.objects.filter(
            field=field, start_time__gte=start_time, end_time__lte=end_time)
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)


class CurrentFieldsView(APIView):
    """
    API endpoint that returns all fields that are currently in use.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get the current time
        now = timezone.now()

        # Query for bookings that are currently active
        current_bookings = Booking.objects.filter(
            start_time__lte=now, end_time__gte=now)

        # Get the fields related to these bookings
        current_fields = Field.objects.filter(
            booking__in=current_bookings).distinct()

        # Serialize the field data
        field_data = [{'field_id': field.id, 'field_name': field.name}
                      for field in current_fields]

        # Return the response
        return Response(field_data)
