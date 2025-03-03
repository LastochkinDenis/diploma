from authentication.jwtToken import AccessToken
from authentication.permissions import AuthorizedUserPermissions
from .permissions import UserEnrollmentCourse
from .models import UserTry, UserTryOpenQuestion, UserTryProgramTask, UserTryQuestionTask
from course_content.models import Task, TopicInfo, Topic, TopicNavigate, ProgramTask, QuestionTask, OpenQuestion
from user.models import User
from course.models import Course
from user.getUser import getUser
from .CodeTest import testPy


from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.response import Response
from rest_framework import status
from jwt.exceptions import ExpiredSignatureError, DecodeError


@api_view(['GET'])
@permission_classes([AuthorizedUserPermissions, UserEnrollmentCourse])
def RederectLessonCourse(request, slug):
    """
    The user is redirected to the last task they completed. if user hasn't try rederected firs lesson.
    """
    try:
        course = Course.objects.get(slug=slug)
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    user = getUser(request)

    if user is None:
        return Response(status=status.HTTP_403_FORBIDDEN)
    
    userTry = UserTry.objects.filter(user=user,tasks__topicNavigate__idTopic__idCourse=course)

    if userTry.exists():
        userTry = userTry.latest('date')
        return Response(
            data={'link': f'/course/{course.slug}/topic/{userTry.tasks.topicNavigate.first().idTopic.slug}/lesson/{userTry.tasks.slug}'},
            status=status.HTTP_200_OK
        )
    else:
        try:
            topic = course.topic_set.get(serialNumber=1)
            task = topic.topicnavigate_set.get(serialNumber=1).contentObject
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(
            data={'link': f'/course/{course.slug}/topic/{topic.slug}/lesson/{task.slug}'},
            status=status.HTTP_200_OK
        )

@api_view(['GET'])
@permission_classes([AuthorizedUserPermissions, UserEnrollmentCourse])
def GetTopicsCourse(request, slug):
    try:
        course = Course.objects.get(slug=slug)
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    topics = []

    for topic in course.topic_set.all():
        topics.append({'name': topic.name, 'slug': topic.slug, 'slugFirstLesson': topic.topicnavigate_set.get(serialNumber=1).contentObject.slug})
    
    return Response(data=topics, status=status.HTTP_200_OK)

class Lesson(APIView):

    permission_classes = [AuthorizedUserPermissions, UserEnrollmentCourse]

    def get(self, request, slug, slugTopic, slugLesson):

        lesson = None

        user = getUser(request)

        try:
            lesson = Task.objects.get(slug=slugLesson)
        except ObjectDoesNotExist:
            pass

        try:
            if lesson is None:
                lesson = TopicInfo.objects.get(slug=slugLesson)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        if isinstance(lesson, TopicInfo):
            return Response(data=self.getTopicInfo(lesson), status=status.HTTP_200_OK)
        if isinstance(lesson, Task) and isinstance(lesson.conetntObject, OpenQuestion):
            return Response(data=self.getOpenQuestion(lesson, user), status=status.HTTP_200_OK)
        if isinstance(lesson, Task) and isinstance(lesson.conetntObject, QuestionTask):
            return Response(data=self.getQuestionTask(lesson, user), status=status.HTTP_200_OK)
        if isinstance(lesson, Task) and isinstance(lesson.conetntObject, ProgramTask):
            return Response(data=self.getProgramoTask(lesson, user), status=status.HTTP_200_OK)

        return Response(status=status.HTTP_200_OK)

    def getTopicInfo(self, lesson):
        
        text = ''

        if lesson.text != '':
            text = lesson.text.read()

        return {'name': lesson.name, 'description': text, 'type': 'TextInfo', 'languageName': "" }

    def getProgramoTask(self, lesson, user):
        description = ''
        
        userTry = lesson.usertry_set.filter(user=user)
        lastTry = None
        result = ''

        try:
            if userTry.exists():
                userTry = userTry.latest('date')
                lastTry = userTry.objectContent.program
                result = userTry.result
        except AttributeError:
            pass
        
        if lesson.description != '':
            description = lesson.description.read()

        return {'name': lesson.name, 'description': description,
                'type': 'ProgramoTask', 'languageName': lesson.conetntObject.programLanguage, 
                'lastAnswer': lastTry or '',
                'result': result, 'resultText': ''}


    def getOpenQuestion(self, lesson, user):
        description = ''
        
        userTry = lesson.usertry_set.filter(user=user)
        lastTry = None
        result = ''

        try:
            if userTry.exists():
                userTry = userTry.latest('date')
                lastTry = userTry.objectContent.answer
                result = userTry.result
        except AttributeError:
            pass
        
        if lesson.description != '':
            description = lesson.description.read()

        return {'name': lesson.name, 'description': description,
                'type': 'OpenQuestion', 'languageName': '', 
                'lastAnswer': lastTry or '',
                'result': result}

    def getQuestionTask(self, lesson, user):
        description = ''

        userTry = lesson.usertry_set.filter(user=user)
        lastTry = None
        result = ''
        
        try:
            if userTry.exists():
                userTry = userTry.latest('date')
                lastTry = userTry.objectContent.choiceAnswer
                result = userTry.result
        except AttributeError:
            pass
        
        if lesson.description != '':
            description = lesson.description.read()

        return {'name': lesson.name, 'description': description,
                'type': 'QuestionTask', 'languageName': "", 
                'lastAnswer': lastTry or [], 'answer': lesson.conetntObject.choiceQuestions
                ,'result': result}

class OpenQuestionCheck(APIView):
    permission_classes = [AuthorizedUserPermissions, UserEnrollmentCourse]

    def post(self, request, slug, slugTopic, slugLesson):

        data = request.data

        user = getUser(request)

        if user is None:
            return Response(status=status.HTTP_403_FORBIDDEN)

        try:
            lesson = Task.objects.get(slug=slugLesson)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        if lesson.conetntObject.rigthText == data.get('answer'):
            self.createUserTry(data.get('answer'), True, lesson, user)
            return Response(data={'result':True}, status=status.HTTP_200_OK)
        else:
            self.createUserTry(data.get('answer'), False, lesson, user)
            return Response(data={'result':False}, status=status.HTTP_200_OK)
    
    def createUserTry(self, answer, result, lesson, user):
        userTry = UserTry()
        userTry.result = result
        userTry.tasks = lesson
        userTry.user = user

        userTry.objectContent = UserTryOpenQuestion.objects.create(answer=answer)

        userTry.save()
        return userTry

class QuestionTaskCheck(APIView):

    permission_classes = [AuthorizedUserPermissions, UserEnrollmentCourse]

    def post(self, request, slug, slugTopic, slugLesson):

        data = request.data

        choiceRight = []

        user = getUser(request)

        if user is None:
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        try:
            lesson = Task.objects.get(slug=slugLesson)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
        for answer, choice in data.items():
            if choice:
                choiceRight.append(answer)
        
        if choiceRight == lesson.conetntObject.choiceRight:
            self.createUserTry([key for key in data if data[key]], True, lesson, user)
            return Response(data={'result':True}, status=status.HTTP_200_OK)
        else:
            self.createUserTry([key for key in data if data[key]], False, lesson, user)
            return Response(data={'result':False}, status=status.HTTP_200_OK)
    
    def createUserTry(self, answer, result, lesson, user):
        userTry = UserTry()
        userTry.result = result
        userTry.tasks = lesson
        userTry.user = user

        userTry.objectContent = UserTryQuestionTask.objects.create(choiceAnswer=answer)

        userTry.save()
        return userTry

class ProgramTaskCheck(APIView):
    permission_classes = [AuthorizedUserPermissions, UserEnrollmentCourse]

    def post(self, request, slug, slugTopic, slugLesson):

        data = request.data
        result = False

        user = getUser(request)

        if user is None:
            return Response(status=status.HTTP_403_FORBIDDEN)

        try:
            lesson = Task.objects.get(slug=slugLesson)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
       # try:
        #    result, resultText = testPy(lesson, data.get('program', ''))
       # except Exception:
        #     pass

        result, resultText = testPy(lesson, data.get('program', ''))
        self.createUserTry(data.get('program', ''), result, lesson, user)
        return Response(data={'result':result, 'resultText': resultText}, status=status.HTTP_200_OK)
    
    def createUserTry(self, answer, result, lesson, user):
        userTry = UserTry()
        userTry.result = result
        userTry.tasks = lesson
        userTry.user = user

        userTry.objectContent = UserTryProgramTask.objects.create(program=answer)

        userTry.save()
        return userTry
