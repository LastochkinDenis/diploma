from .models import TopicNavigate, TopicInfo, Task, ProgramTask, QuestionTask, OpenQuestion

from django.core.exceptions import ObjectDoesNotExist


class ChageTypeLesson:

    def __init__(self, newLesson, oldLesson):
        self.newLesson = newLesson
        self.oldLesson = oldLesson

    def changeType(self):
        if isinstance(self.newLesson, TopicInfo):
            self.changeType()


    def __changeNavigate(self):
        if isinstance(self.newLesson, TopicInfo):
            topicNavigate = self.oldLesson.topicNavigate.first()
        else:
            topicNavigate = self.oldLesson.task.first().topicNavigate.first()

        topicNavigate.conetntObject = self.newLesson

        topicNavigate.save()
        self.oldLesson.delete()