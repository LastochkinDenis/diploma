from datetime import datetime, timedelta


from typing import Any
from user.models import User


from django.db import models


class RefreshUser(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    refresh = models.TextField()
    exp = models.DateField(null=True)