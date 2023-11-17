# backend/apps/matches/views.py

from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_datetime
from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from .models import Match
from .serializers import MatchSerializer
from apps.fields.models import Booking, Field
from apps.fields.serializers import BookingSerializer
from apps.teams.models import Team  # Assuming you have a Team model
from django.utils.timezone import make_aware, utc
import pytz

class MatchViewSet(viewsets.ModelViewSet):
    queryset = Match.objects.all().prefetch_related('consent_requests')
    serializer_class = MatchSerializer

class CreateMatchView(APIView):
    def post(self, request):
        # Extract the necessary data from the request
        team1_id = request.data.get('team1')
        team2_id = request.data.get('team2')
        field_id = request.data.get('field')
        date_time = request.data.get('date_time')
        user_timezone_str = request.data.get('timezone', 'UTC')  # Default to UTC if not provided

            # Convert date_time to a datetime object in the user's timezone
        user_timezone = pytz.timezone(user_timezone_str)
        start_time_naive = parse_datetime(date_time)
        start_time_user_tz = make_aware(start_time_naive, user_timezone)

        # Convert to UTC
        start_time_utc = start_time_user_tz.astimezone(utc)

        # Calculate end_time in UTC
        end_time_utc = start_time_utc + timedelta(hours=1)


        # Check if the field is available
        field = get_object_or_404(Field, pk=field_id)
        bookings = Booking.objects.filter(
            field=field,
            start_time__lt=end_time_utc,
            end_time__gt=start_time_utc
        )
        if bookings.exists():
            return Response({'error': 'Field is not available during the requested time period'}, status=status.HTTP_400_BAD_REQUEST)

        # If the field is available, create the booking
        new_booking = Booking.objects.create(
            field=field,
            start_time=start_time_utc,
            end_time=end_time_utc
        )

        # Now create the match
        team1 = get_object_or_404(Team, pk=team1_id)
        team2 = get_object_or_404(Team, pk=team2_id)

        new_match = Match.objects.create(
            team1=team1,
            team2=team2,
            date_time=start_time_utc,
            # Assuming you add a booking field to the Match model
            booking=new_booking
        )

        # Serialize the match to return with the response
        match_serializer = MatchSerializer(new_match)

        # Return a success response with serialized data
        return Response({
            'message': 'Match and booking created successfully',
            'booking_id': new_booking.id,  # Assuming you want to return the booking ID
            'match': match_serializer.data
        }, status=status.HTTP_201_CREATED)

