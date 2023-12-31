import datetime
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings
from django.contrib.auth.models import update_last_login
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core import exceptions
from django.core.mail import EmailMessage
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse_lazy
from django.conf import settings
from .models import User, Team
from rest_framework.exceptions import AuthenticationFailed
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import PasswordResetTokenGenerator

"""Serializer for users"""


class Meta:
    model = get_user_model()
    fields = ['id', 'username', 'email',
              'team_id', 'first_name', 'last_name', 'user_type', 'guardian']
    read_only_fields = ['id']


class UserSerializer(serializers.ModelSerializer):
    """Serializer for users"""

    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'email',
              'team_id', 'first_name', 'last_name', 'user_type', 'guardian']
        read_only_fields = ['id']


class LoginSerializer(TokenObtainPairSerializer):
    """Serializer for login"""

    def validate(self, attrs):
        data = super().validate(attrs)

        # use get_token() from TokenObtainPairSerializer to get refresh token and access token
        refresh = self.get_token(self.user)

        # add user data to response
        data['user'] = UserSerializer(self.user).data
        # add refresh token to response
        data['refresh'] = str(refresh)
        # add access token to response
        data['access'] = str(refresh.access_token)

        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)

        return data  # return response


class RegisterSerializer(UserSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(
        max_length=128, min_length=1, write_only=True, required=True)
    email = serializers.CharField(
        max_length=128, min_length=1,  required=True)
    team_id = serializers.IntegerField(write_only=True, required=False)
    birthdate = serializers.DateField(required=False)
    first_name = serializers.CharField(max_length=30, required=True)
    last_name = serializers.CharField(max_length=30, required=True)
    user_type = serializers.ChoiceField(
        choices=User.USER_TYPES, required=True)  # Add user_type field
    guardian_username = serializers.CharField(
        max_length=150, write_only=True, required=False)

    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'email', 'password', 'user_type',
                  'team_id', 'birthdate', 'first_name', 'last_name', 'guardian_username']

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)

        user.is_active = False  # set user to inactive until email is verified
        user.save()

        # create email to send to user
        email = validated_data["email"]
        email_subject = "Activate your account"
        uid = urlsafe_base64_encode(user.username.encode())
        domain = get_current_site(self.context["request"])
        token = PasswordResetTokenGenerator().make_token(user)
        # Added token to link variable
        link = reverse_lazy('verify-email', kwargs={"uid": uid, "token": token})
        url = f"{settings.PROTOCOL}://{domain}{link}"
        mail = EmailMessage(
            email_subject,
            url,
            None,
            [email],
        )

        mail.send(fail_silently=False)

        return user

    def validate(self, data):

        # get the password from the data
        password = data.get('password')
        # Custom validation for 'birthday' field based on 'user_type'
        user_type = data.get('user_type')
        guardian_username = data.get('guardian_username', None)
        birthdate = data.get('birthdate')

        if user_type == 'player' and not birthdate:
            raise serializers.ValidationError(
                {'birthdate': 'This field is required for players.'})

        if user_type == 'player' and guardian_username:
            try:
                guardian = get_user_model().objects.get(username=guardian_username)
                data['guardian'] = guardian
                del data['guardian_username']  # Remove guardian_username from validated_data
            except get_user_model().DoesNotExist:
                raise serializers.ValidationError(
                    {"guardian_username": "A user with this username does not exist."})

        errors = dict()
        try:
            # validate the password and catch the exception
            validate_password(password=password)

        # the exception raised here is different than serializers.ValidationError
        except exceptions.ValidationError as e:
            errors['password'] = list(e.messages)

        if errors:
            raise serializers.ValidationError(errors)

        return super(RegisterSerializer, self).validate(data)


class SendNewEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['email', "username"]


class ResetPasswordSerializer(serializers.ModelSerializer):
    """Serializer for password reset"""

    class Meta:
        model = get_user_model()
        fields = ['email', "username"]


class SetNewPasswordSerializer(serializers.Serializer):
    """Serializer for setting new password"""

    password = serializers.CharField(
        style={"input_type": "password"}, write_only=True)
    password1 = serializers.CharField(
        style={"input_type": "password"}, write_only=True)
    token = serializers.CharField(
        min_length=1, write_only=True)
    uid = serializers.CharField(
        min_length=1, write_only=True)

    class Meta:
        fields = ['password', 'password1', 'token', 'uid']

    def validate(self, attrs):
        password = attrs.get('password')
        password1 = attrs.get('password1')
        token = attrs.get('token')
        uid = attrs.get('uid')

        id = force_str(urlsafe_base64_decode(uid))
        user = get_user_model().objects.get(id=id)
        errorMessage = dict()

        try:
            # validate password using django's validate_password
            validate_password(password)
        except exceptions.ValidationError as error:
            errorMessage['message'] = list(error.messages)

        if errorMessage:  # if there is an error, raise it
            raise serializers.ValidationError(errorMessage)

        if password != password1:  # check if passwords match
            raise serializers.ValidationError("Passwords must match!")

        user.set_password(password)  # set new password
        user.save()

        return user

class AssignTeamSerializer(serializers.ModelSerializer):
    team_id = serializers.IntegerField()

    class Meta:
        model = get_user_model()
        fields = ['team_id']

    def update(self, instance, validated_data):
        instance.team_id = validated_data['team_id']
        instance.save()
        return instance

