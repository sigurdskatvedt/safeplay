from django.db import models
from apps.users.models import User
from .validators import FileValidator

def document_directory_path(instance, filename):
    """
    Return the path for document file
    :param instance: Current instance containing a user
    :param filename: Name of the file
    :return: Path of file as a string
    """
    return f"documents/{instance.user.id}/{filename}"


class Objection(models.Model):
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


