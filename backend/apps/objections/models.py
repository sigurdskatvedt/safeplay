from django.db import models
from django.core.validators import FileExtensionValidator


class Objection(models.Model):
    # The document itself
    document = models.FileField(
        upload_to="objections",
        validators=[
            FileExtensionValidator(allowed_extensions=['pdf'])
        ],
        max_length=255,
        blank=False,
        null=False
    )

    name = models.CharField(max_length=255)
    text = models.TextField(max_length=3000)

    def __str__(self):
        return self.name
