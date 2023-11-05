from django.db import models

class Objection(models.Model):
    text = models.TextField()

    # Assuming you want to store the document in the database
    # You might want to use a FileField or an ImageField depending on your exact requirements
    document = models.FileField(upload_to='objections_documents/')

