# Generated by Django 4.0 on 2024-04-29 13:40

import course_content.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('course_content', '0004_alter_topicinfo_text'),
    ]

    operations = [
        migrations.AddField(
            model_name='programtask',
            name='programLanguage',
            field=models.CharField(choices=[('py', 'python'), ('ja', 'java'), ('js', 'javascript'), ('c#', 'c#'), ('', '--')], default='', max_length=2),
        ),
        migrations.AlterField(
            model_name='task',
            name='desctiption',
            field=models.FileField(default='', upload_to=course_content.models.courseDescriptionFilePath),
        ),
    ]
