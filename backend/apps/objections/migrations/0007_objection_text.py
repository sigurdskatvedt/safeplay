# Generated by Django 4.0.8 on 2023-11-16 12:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('objections', '0006_objection_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='objection',
            name='text',
            field=models.CharField(default=' ', max_length=3000),
            preserve_default=False,
        ),
    ]
