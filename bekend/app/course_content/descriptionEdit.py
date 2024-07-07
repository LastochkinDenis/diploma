from .models import Task

from datetime import datetime

from django.core.files.base import ContentFile


def descriptionEdit(task, description):
    if task.description == '':
        task.description.save(task.description, ContentFile(bytes(description, 'utf-8')), save=True)
    else:
        task.description.save(f"{datetime.now().strftime('%Y-%m-%d-%s')}.html", ContentFile(bytes(description, 'utf-8')), save=True)
    
    return task