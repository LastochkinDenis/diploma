# Generated by Django 4.0 on 2024-02-18 15:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('course', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='course',
            name='isActive',
        ),
        migrations.AddField(
            model_name='course',
            name='status',
            field=models.CharField(choices=[('a', 'active'), ('d', 'draft'), ('r', 'remove')], default='d', max_length=1),
        ),
    ]
