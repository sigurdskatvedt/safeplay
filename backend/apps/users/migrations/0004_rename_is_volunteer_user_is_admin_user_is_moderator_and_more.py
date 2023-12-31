# Generated by Django 4.0.8 on 2023-10-07 10:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_auto_20230116_1753'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='is_volunteer',
            new_name='is_admin',
        ),
        migrations.AddField(
            model_name='user',
            name='is_moderator',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='document',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='user',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
