from django.db import models

from django.contrib.auth.models import AbstractUser
from apps.teams.models import Team

from .validators import FileValidator

import django.utils.timezone


class User(AbstractUser):
    USER_TYPES = (
        ('manager', 'Manager'),
        ('player', 'Player'),
        ('guardian', 'Guardian'),
    )

    user_type = models.CharField(
        max_length=20, choices=USER_TYPES, default='player')
    birthdate = models.DateField(
        blank=True, null=True, verbose_name='Birthdate')
    verify_email_timer = models.DateTimeField(
        default=django.utils.timezone.now, blank=True, null=True, verbose_name='verify email timer')
    login_attempts = models.IntegerField(default=0)
    login_timeout = models.DateTimeField(auto_now_add=True)
    first_name = models.CharField(max_length=30, blank=True, null=True)
    last_name = models.CharField(max_length=30, blank=True, null=True)
    team = models.ForeignKey(
        Team, on_delete=models.SET_NULL, blank=True, null=True, related_name='members')


def document_directory_path(instance, filename):
    """
    Return the path for document file
    :param instance: Current instance containing a user
    :param filename: Name of the file
    :return: Path of file as a string
    """
    return f"documents/{instance.user.id}/{filename}"


class Document(models.Model):
    # The user who uploaded the document
    user = models.ForeignKey(User, on_delete=models.CASCADE,
                             related_name='documents', blank=False, null=False)

    # The document itself
    document = models.FileField(upload_to=document_directory_path, validators=[FileValidator(
        allowed_mimetypes='', allowed_extensions='', max_size=1024*1024*5)], blank=False, null=False)

    # The date the document was uploaded
    date_uploaded = models.DateTimeField(auto_now_add=True)

    # The content type of the document. For example: application/pdf, image/png, image/jpeg
    content_type = models.CharField(max_length=64)

    def __str__(self):
        return self.name
