# Generated by Django 4.0.8 on 2023-11-05 08:16

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0010_remove_user_is_manager'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='guardian',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='players', to=settings.AUTH_USER_MODEL),
        ),
    ]
