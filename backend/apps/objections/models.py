from django.db import models
from apps.users.models import User
from .validators import FileValidator


class Objection(models.Model):
    # The document itself
    document = models.FileField(upload_to="objections", validators=[FileValidator(
        allowed_mimetypes='', allowed_extensions='', max_size=1024*1024*5)], blank=False, null=False)

    name = models.CharField(max_length=255)
    text = models.TextField(max_length=3000)

    def __str__(self):
        return self.name
