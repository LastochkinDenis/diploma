from user.models import User
from .genarationSlug import genarationSlug


from django.db import models
from autoslug import AutoSlugField
from django.db.models.signals import pre_save
from django.dispatch import receiver

def courseImagePath(instance, filename):
    return 'course/course_' + instance.name.replace(' ', '_').lower() + '/image'

class Course(models.Model):

    KINDS_OF_STATUS = (
        ('a', 'active'),
        ('d', 'draft'),
        ('r', 'remove')
    )
    
    name = models.CharField(max_length=100)
    description = models.TextField()
    imageCourse = models.ImageField(upload_to=courseImagePath, null=True)
    status = models.CharField(max_length=1, choices=KINDS_OF_STATUS, default='d')
    tags = models.ManyToManyField('Tag', db_table='CourseTag')
    authors = models.ManyToManyField(User, db_table='AuthCourse')
    slug = AutoSlugField(unique=True, populate_from='name', slugify=genarationSlug)

    class Meta:
        verbose_name = 'Course'
        verbose_name_plural = 'Courses'

@receiver(pre_save, sender=Course)
def updateNameCourse(sender, instance, **kwarg):
    if instance.name:
        instance.slug = genarationSlug(instance.name)

class UserCertificate(models.Model):

    idCourse = models.ForeignKey(Course, on_delete=models.PROTECT)
    idUser = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)

    class Meta:
        verbose_name = 'User certificate'
        verbose_name_plural = 'Users certificates'

class Tag(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name = 'Tag cource'
        verbose_name_plural = 'Tags cource'