from rest_framework import serializers
from .models import Booking, Field

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

class FieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = Field
        fields = '__all__'  # Or list specific fields if you don't want to expose all
