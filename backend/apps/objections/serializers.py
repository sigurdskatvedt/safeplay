from rest_framework import serializers
from .models import Objection
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse_lazy
from django.conf import settings

class ObjectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Objection
        fields = ('id', 'document')

class ObjectionPostSerializer(serializers.ModelSerializer):
    """
    Serializer for the upload Documents.
    """
    class Meta:
        model = Objection
        fields = ('id', 'document')


class ObjectionGetSerializer(serializers.ModelSerializer):
    """
    Serializer for the download of Documents.
    """
    link = serializers.SerializerMethodField()  # link to download the document
    name = serializers.SerializerMethodField()  # name of the document

    class Meta:
        model = Objection
        fields = ('id', 'user', 'link', 'name')

    def get_link(self, obj):  # get the link to download the document
        domain = get_current_site(self.context["request"])
        link = reverse_lazy('document-download', kwargs={"pk": obj.id})

        link = f"{settings.PROTOCOL}://{domain}{link}"
        return link

    def get_name(self, obj):
        # name is stored as documents/id/filename, so splitting and selecting last item gets only the filename.
        return obj.document.name.split('/')[-1]
