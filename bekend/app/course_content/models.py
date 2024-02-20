from course.models import Course
from course.genarationSlug import genarationSlug


from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.contrib.postgres.fields import ArrayField
from autoslug import AutoSlugField


class Topic(models.Model):
    name = models.CharField(max_length=50)
    idCourse = models.ForeignKey(Course, on_delete=models.CASCADE)
    serialNumber = models.PositiveSmallIntegerField()
    slug = AutoSlugField(unique=True, populate_from='name', slugify=genarationSlug)

    class Meta:
        verbose_name = 'Topic'
        verbose_name_plural = 'Topics'

class TopicNavigate(models.Model):
    idTopic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    serialNumber = models.PositiveSmallIntegerField()

    contentType = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    objectId = models.PositiveIntegerField()
    contentObject = GenericForeignKey(ct_field='contentType', fk_field='objectId')

    class Meta:
        verbose_name = 'Topic navigate'
        verbose_name_plural = 'Topics navigate'

class TopicInfo(models.Model):
    name = models.CharField(max_length=50)
    text = ArrayField(base_field=models.TextField())
    slug = AutoSlugField(unique=True, populate_from='name', slugify=genarationSlug)

    class Meta:
        verbose_name = 'Topic info'
        verbose_name_plural = 'Topics info'

class Task(models.Model):
    name = models.CharField(max_length=50)
    desctiption = ArrayField(base_field=models.TextField())

    contentType = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    objectId = models.PositiveIntegerField()
    conetntObject = GenericForeignKey(ct_field='contentType', fk_field='objectId')
    topicNavigate = GenericRelation(TopicNavigate, content_type_field='contentType', object_id_field='objectId')
    slug = AutoSlugField(unique=True, populate_from='name', slugify=genarationSlug)

    class Meta:
        verbose_name = 'Task'
        verbose_name_plural = 'Tasks'

def courseProgramFilePath(instance):
    return 'course/course_' + instance.task.topicNavigate.idTopic.idCource.name.replace(' ', '_').lower() + '/program'

class ProgramTask(models.Model):
    testFile = models.FileField(upload_to=courseProgramFilePath)
    task = GenericRelation(Task, content_type_field='contentType', object_id_field='objectId')

    class Meta:
        verbose_name = 'Program task'
        verbose_name_plural = 'Program tasks'

class QuestionTask(models.Model):
    choiceQuestions = ArrayField(base_field=models.CharField(max_length=50), size=10)
    choiceRight = ArrayField(base_field=models.CharField(max_length=50), size=10)

    class Meta:
        verbose_name = 'Question task'
        verbose_name_plural = 'Question tasks'

class OpenQuestion(models.Model):
    rigthText = models.CharField(max_length=50)

    class Meta:
        verbose_name = 'Open question'
        verbose_name_plural = 'Open questions'