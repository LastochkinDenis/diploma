# Generated by Django 4.0 on 2024-05-07 07:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('course_content', '0006_rename_desctiption_task_description'),
        ('course_lesson', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='usertry',
            name='tasks',
        ),
        migrations.AddField(
            model_name='usertry',
            name='tasks',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='course_content.task'),
        ),
    ]