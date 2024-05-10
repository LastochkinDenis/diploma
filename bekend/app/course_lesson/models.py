from user.models import User
from course_content.models import Task

from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType

class UserTry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    contentType = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    objectId = models.PositiveIntegerField()
    objectContent = GenericForeignKey(ct_field='contentType', fk_field='objectId')
    result = models.BooleanField(default=False)
    tasks = models.ForeignKey(Task, on_delete=models.CASCADE, null=True)
    date = models.DateTimeField(auto_now_add=True, null=True)

    class Meta:
        verbose_name = 'User try'
        verbose_name_plural = 'User attempts'

class UserTryOpenQuestion(models.Model):
    userTry = GenericRelation(UserTry, content_type_field='contentType', object_id_field='objectId')
    answer = models.CharField(max_length=50)

    class Meta:
        verbose_name = 'User try open question'
    
class UserTryQuestionTask(models.Model):
    userTry = GenericRelation(UserTry, content_type_field='contentType', object_id_field='objectId')
    choiceAnswer = ArrayField(base_field=models.CharField(max_length=50), size=10)

    class Meta:
        verbose_name = 'User try question task'

class UserTryProgramTask(models.Model):
    userTry = GenericRelation(UserTry, content_type_field='contentType', object_id_field='objectId')
    program = models.TextField()
    
    class Meta:
        verbose_name = 'User try program task'