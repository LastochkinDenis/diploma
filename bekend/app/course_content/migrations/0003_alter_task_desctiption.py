# Generated by Django 4.0 on 2024-04-23 14:18

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('course_content', '0002_alter_task_desctiption_alter_topicinfo_text'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='desctiption',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.JSONField(), null=True, size=None),
        ),
    ]