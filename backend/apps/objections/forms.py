from django import forms
from .models import Objection

class ObjectionForm(forms.ModelForm):
    class Meta:
        model = Objection
        fields = ['text', 'document']

