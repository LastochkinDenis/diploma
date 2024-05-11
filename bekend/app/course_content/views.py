from .models import (TopicNavigate, TopicInfo, Topic,
                      Task, ProgramTask, QuestionTask,
                      OpenQuestion)
from course.models import Course
from .serializer import TopicSerializer, UpdateTopicSerializer
from course.permissions import UpdateCoursePermissions
from authentication.permissions import AuthorizedUserPermissions
from .descriptionEdit import descriptionEdit

from datetime import datetime
import io
import os
import base64

from django.core.exceptions import ObjectDoesNotExist
from django.http import QueryDict
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from django.core.files.base import ContentFile
from rest_framework.decorators import api_view, permission_classes


class CreateTopicApi(CreateAPIView):
    
    serializer_class = TopicSerializer
    permission_classes = [AuthorizedUserPermissions, UpdateCoursePermissions]
    queryset = Topic.objects.all()

    def get_serializer_context(self):

        context = super().get_serializer_context()

        course = Course.objects.get(slug=self.kwargs.get('slug', ''))

        context['course'] = course

        return context

class GetTopicApi(APIView):

    permission_classes = [AuthorizedUserPermissions]

    def get(self, request, slug, slugtopic):

        try:
            topic = Topic.objects.get(slug=slugtopic)
        except ObjectDoesNotExist:
            return Response(data={
                'error': 'Topic did\'t find'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = TopicSerializer(topic)

        return Response(data=serializer.data, status=status.HTTP_200_OK)
    
class UpdateTopicSerialNumberApi(APIView):

    permission_classes = [AuthorizedUserPermissions, UpdateCoursePermissions]

    def put(self, request, slug):
        
        slugTopic = request.data.get('slug', None)
        
        try:
            topicList = list(Topic.objects.filter(idCourse__slug=slug))
            topicUpdate = Topic.objects.get(slug=slugTopic)
        except ObjectDoesNotExist:
            return Response(data={
                'error': 'Topic did\'t find'
            }, status=status.HTTP_404_NOT_FOUND)
        
        try:
            topicList.remove(topicUpdate)
            serialNumber = request.data.get('serialnumber', None)
            
            if serialNumber is None and not isinstance(serialNumber, (int, float)):
                return Response(data={
                    'error': 'serial number is wrong'
                }, status=status.HTTP_400_BAD_REQUEST)

            topicList.insert(serialNumber - 1, topicUpdate)

            for number, topic in enumerate(topicList, start=1):
                topic.serialNumber = number
                topic.save()
        except ValueError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        return Response(status=status.HTTP_201_CREATED)

@api_view(['PUT'])
@permission_classes([AuthorizedUserPermissions, UpdateCoursePermissions])
def UpdateTopicNameApi(request, slug, slugtopic):
    
    try:
        topic = Topic.objects.get(slug=slugtopic)
    except ObjectDoesNotExist:
        return Response(data={
                'error': 'Topic did\'t find'
            }, status=status.HTTP_404_NOT_FOUND)
    
    serializer = UpdateTopicSerializer(data=request.data, 
                                       instance=topic)
    serializer.is_valid(raise_exception=True)
    serializer.save()

    return Response(data={
        'course': serializer.data
    }, status=status.HTTP_201_CREATED)

class CreateTopicInfoApi(APIView):
    """ 
    Сreating an information block on the topic.
    """

    permission_classes = [AuthorizedUserPermissions, UpdateCoursePermissions]

    def post(self, request, slug, slugtopic):
        
        infoList = []

        try:
            topic = Topic.objects.get(slug=slugtopic)
        except ObjectDoesNotExist:
            return Response(data={
                'error': 'Topic did\'t find'
            }, status=status.HTTP_404_NOT_FOUND)
        
        topicInfoData = request.data.get('topicInfo', None)

        if topicInfoData is None or not request.data.get('name'):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        for info in topicInfoData:
            if info.get('type') == 'text' and len(info.get('data')) > 1:
                infoList.append(info)

            if info.get('type') == 'image':
                pass
        
        topicInfo = TopicInfo.objects.create(
            name=request.data.get('name'),
            text=infoList
        )

        topicNavigate = TopicNavigate.objects.create(
            idTopic=topic,
            contentObject=topicInfo
        )

        return Response(data={
            'name': topicInfo.name,

        },status=status.HTTP_201_CREATED)

class CourseContent(APIView):
    """
    Topic and task create and get
    """
    current_topic = None
    current_course = None
    permission_classes = [AuthorizedUserPermissions, UpdateCoursePermissions]

    def get(self, request, slug):
        
        try:
            course = Course.objects.get(slug=slug)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        topics = course.topic_set.all().order_by('serialNumber')

        data = {}

        for topic in topics:

            dataTopic = {'info': {}, 'content': {}}
            dataTopic['info'] = {
                'name': topic.name,
                'slug': topic.slug,
                'serialNumber': topic.serialNumber,
                'courseSlug': course.slug
            }

            topicsNavigate = topic.topicnavigate_set.all().order_by('serialNumber')

            for topicNavigate in topicsNavigate:
                item = topicNavigate.contentObject
                dataTopic['content'][topicNavigate.serialNumber] = {
                    'name': item.name,
                    'slug': item.slug
                }
            
            data[topic.serialNumber] = dataTopic
        
        return Response(data=data, status=status.HTTP_200_OK)

    def put(self, request, slug):
        data = request.data

        try:
            self.current_course = Course.objects.get(slug=slug)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        for topicSlug in data:
            topicData = data[topicSlug]

            if topicData.get(topicSlug):
                if topicData.get(topicSlug)['do'] == 'create':
                    self.current_topic = Topic.objects.create(
                        idCourse=self.current_course,
                        name=topicData[topicSlug]['data']['name']
                    )
                    topicData.pop(topicSlug)
                elif topicData.get(topicSlug)['do'] == 'delete':
                    try:
                        self.current_topic = Topic.objects.get(slug=topicSlug)
                        self.deleteTopic()
                    except ObjectDoesNotExist:
                        pass
                    finally:
                        continue
                elif topicData.get(topicSlug)['do'] == 'rename':
                    try:
                        self.current_topic = Topic.objects.get(slug=topicSlug)
                    except ObjectDoesNotExist:
                        continue
                    self.current_topic.name = topicData[topicSlug]['data']['name']
                    self.current_topic.save()
                    topicData.pop(topicSlug)
            else:
                try:
                    self.current_topic = Topic.objects.get(slug=topicSlug)
                except ObjectDoesNotExist:
                    continue
            
            for taskSlug in topicData:

                if 'change order' == taskSlug:
                    continue

                if topicData[taskSlug]['do'] == 'delete':
                    self.deleteTask(taskSlug)

                    if topicData.get('change order', False):
                        changeOrder = topicData['change order']
                        changeOrder.pop(taskSlug)

                elif topicData[taskSlug]['do'] == 'create task':
                    task = self.createTask(topicData[taskSlug]['data'])
                    
                    if topicData.get('change order', False):
                        changeOrder = topicData['change order']
                        indexTask = changeOrder.index(taskSlug)
                        changeOrder[indexTask] = task.slug

                        topicData['change order'] = changeOrder
            
            if topicData.get('change order', False):
                self.changeSerialNumberTask(topicData.get('change order'))

        return Response(status=status.HTTP_200_OK)

    def deleteTopic(self):
        self.current_topic.delete()

        topics = self.current_course.topic_set.all().order_by('serialNumber')

        for serialNumber, topic in enumerate(topics, start=1):
            topic.serialNumber = serialNumber
            topic.save()

    def changeSerialNumberTask(self, newOrderTask):
        serialNumber = 1

        for taskSlug in newOrderTask:
            task = None
            try:
                task = TopicInfo.objects.get(slug=taskSlug).topicNavigate.first()
            except ObjectDoesNotExist:
                pass

            try:
                task = Task.objects.get(slug=taskSlug).topicNavigate.first()
            except ObjectDoesNotExist:
                pass

            if task is None:
                continue

            task.serialNumber = serialNumber
            task.save()

            serialNumber += 1

    def createTask(self, data):
        
        task = TopicInfo.objects.create(
            name=data.get('name'),
            text = ''
        )

        TopicNavigate.objects.create(
            contentObject = task,
            idTopic = self.current_topic
        )

        return task

    def deleteTask(self, slug):

        task = None

        try:
            task = TopicInfo.objects.get(slug=slug)
        except ObjectDoesNotExist:
            pass

        try:
            task = Task.objects.get(slug=slug)
        except ObjectDoesNotExist:
            pass

        if task is None:
            return

        task.topicNavigate.first().delete()
        task.delete()

        topicNavigate = self.current_topic.topicnavigate_set.all()

        for index, task in enumerate(topicNavigate, start=1):
            task.serialNumber = index
            task.save()

@permission_classes([AuthorizedUserPermissions])
@api_view(['GET'])
def getLessonsSlug(request, slug, slugTopic):
    try:
        topic = Topic.objects.get(slug=slugTopic)
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    topicsNavigate = topic.topicnavigate_set.all().order_by('serialNumber')
    lessonsSlug = []

    for topic in topicsNavigate:
        lessonsSlug.append(topic.contentObject.slug)

    return Response(data=lessonsSlug ,status=status.HTTP_200_OK)

class GetLessonEdit(APIView):

    permission_classes = [AuthorizedUserPermissions, UpdateCoursePermissions]

    def get(self, request, slug, slugTopic, slugLesson):

        lesson = None
        data = {}

        try:
            lesson = Task.objects.get(slug=slugLesson)
        except ObjectDoesNotExist:
            pass

        try:
            if lesson is None:
                lesson = TopicInfo.objects.get(slug=slugLesson)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        if isinstance(lesson, Task) and lesson.contentType.model == 'programtask':
            data = self.getTaksProgramData(lesson)
        elif isinstance(lesson, Task) and lesson.contentType.model == 'openquestion':
            data = self.getOpenQuestionData(lesson)
        elif isinstance(lesson, Task) and lesson.contentType.model == 'questiontask':
            data = self.getQuestionTaskData(lesson)
        elif isinstance(lesson, TopicInfo):
            data = self.getTopicInfoData(lesson)
            
        return Response(data=data, status=status.HTTP_200_OK)

    def getTopicInfoData(self, lesson):
        text = ''

        if lesson.text:
            text = lesson.text.read()

        return {'text': text, 'name': lesson.name, 'type': 'TextInfo', 'languageName': ""}

    def getTaksProgramData(self, lesson):
        description = ''
        fileName = ''
        prograLangueage = {
                'py': 'Python', 
                'jv': 'Java',
                'c#': 'C#'
            }

        if lesson.description:
            description = lesson.description.read()

        
        if lesson.conetntObject.testFile:
            fileName = str(lesson.conetntObject.testFile).split('/')[-1]
        
        return {'description': description, 'name': lesson.name, 'type': 'ProgramTask',
                 'languageName': prograLangueage.get(lesson.conetntObject.programLanguage), 'fileName': fileName}
    
    def getQuestionTaskData(self, lesson):
        description = ''
        answerChoices = {}

        if lesson.description:
            description = lesson.description.read()

        for answer in lesson.conetntObject.choiceQuestions:
            answerChoices[answer] = answer in lesson.conetntObject.choiceRight

        return {'description': description, 'name': lesson.name, 'type': 'QuestionTask', 'languageName': "", 'answerChoices': answerChoices}

    def getOpenQuestionData(self, lesson):
        description = ''

        if lesson.description:
            description = lesson.description.read()

        return {'description': description, 'name': lesson.name, 'rigthText': lesson.conetntObject.rigthText, 'type': 'OpenQuestion', 'languageName': ""}


class TopicInfoEditApi(APIView):

    permission_classes = [AuthorizedUserPermissions, UpdateCoursePermissions]
    
    def put(self, request, slug, slugTopic, slugLesson):
        data = request.data
        oldLesson = None

        try:
            if data.get('changeType', False) and data.get('changeType').get('lessonType') == 'TextInfo':
                topicInfo = TopicInfo()
                topicInfo.slug = slugLesson

                try:
                    oldLesson = TopicInfo.objects.get(slug=slugLesson)
                except ObjectDoesNotExist:
                    oldLesson = Task.objects.get(slug=slugLesson)

            else:
                topicInfo = TopicInfo.objects.get(slug=slugLesson)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        topicInfo.name = data.get('name') or topicInfo.name

        if oldLesson is not None:
            topicInfo.save()
            navigate = oldLesson.topicNavigate.first()
            navigate.contentObject = topicInfo
            navigate.save()
            oldLesson.delete()
        else:
            topicInfo.save()

        if data.get('text', False):

            text = bytes(data.get('text'), 'utf-8')

            if topicInfo.text:
                topicInfo.text.save(topicInfo.text, ContentFile(text), save=True)
            else:          
                topicInfo.text.save(f'{datetime.now().strftime("%Y-%m-%d-%s")}.html', ContentFile(text), save=True)
        topicInfo.save()

        return Response(status=status.HTTP_201_CREATED)
    
class OpenQuestionEdit(APIView):

    permission_classes = [AuthorizedUserPermissions, UpdateCoursePermissions]
    
    def put(self, request, slug, slugTopic, slugLesson):
        data = request.data
        oldLesson = None

        try:
            task = Task.objects.get(slug=slugLesson)
            if data.get('changeType', False) and data.get('changeType').get('lessonType') == 'OpenQuestion':
                oldLesson = Task.objects.get(slug=slugLesson)
        except ObjectDoesNotExist:
            if data.get('changeType', False) and data.get('changeType').get('lessonType') == 'OpenQuestion':
                task = Task()
                oldLesson = TopicInfo.objects.get(slug=slugLesson)
            else:
                return Response(status=status.HTTP_404_NOT_FOUND)      
        if data.get('name', False):
            task.name = data.get('name')
    

        if data.get('changeType', False) and data.get('changeType').get('lessonType') == 'OpenQuestion':
            task.conetntObject = OpenQuestion.objects.create(rigthText = data.get('rigthText', ''))
        else:
            task.conetntObject.rigthText = data.get('rigthText', '') or task.conetntObject.rigthText
        
        if task.pk is None and oldLesson is not None:
            task.save()
            navigate = oldLesson.topicNavigate.first()
            navigate.contentObject = task
            navigate.save()
            if isinstance(oldLesson, TopicInfo):
                oldLesson.delete()
        else:
            task.conetntObject.save()
            task.save()

        if data.get('rigthText', False):
            task.conetntObject.rigthText = data.get('rigthText')
        
        if data.get('description', False):
            task = descriptionEdit(task=task, description=data.get('description'))
        
        task.save()

        return Response(status=status.HTTP_200_OK)
        
class QuestionTaskEdit(APIView):

    permission_classes = [AuthorizedUserPermissions, UpdateCoursePermissions]

    def put(self, request, slug, slugTopic, slugLesson):
        data = request.data
        oldLesson = None

        try:
            task = Task.objects.get(slug=slugLesson)
            if data.get('changeType', False) and data.get('changeType').get('lessonType') == 'QuestionTask':
                oldLesson = Task.objects.get(slug=slugLesson)
        except ObjectDoesNotExist:
            if data.get('changeType', False) and data.get('changeType').get('lessonType') == 'QuestionTask':
                task = Task()
                oldLesson = TopicInfo.objects.get(slug=slugLesson)
            else:
                return Response(status=status.HTTP_404_NOT_FOUND)
        
        if data.get('name', False):
            task.name = data.get('name')
            
        if data.get('changeType', False) and data.get('changeType').get('lessonType') == 'QuestionTask':            
            choiceQuestions, choiceRight = self.getAnswer(data.get('answerChoices', {}))

            task.conetntObject = QuestionTask.objects.create(choiceQuestions=choiceQuestions, choiceRight=choiceRight)

            task.save()
            navigate = oldLesson.topicNavigate.first()
            navigate.contentObject = task
            navigate.save()
            if isinstance(oldLesson, TopicInfo):
                oldLesson.delete()
        else:
            choiceQuestions, choiceRight = self.getAnswer(data.get('answerChoices'))

            task.conetntObject = QuestionTask.objects.create(choiceQuestions=choiceQuestions, choiceRight=choiceRight)
            task.conetntObject.save()
            task.save()

        if data.get('description', False):
            task = descriptionEdit(task=task, description=data.get('description'))
            task.save()

        return Response(status=status.HTTP_200_OK)
    
    def getAnswer(self, data):
        choiceQuestions = []
        choiceRight = []

        for answer in data.keys():
            if data.get(answer):
                choiceRight.append(answer)
            choiceQuestions.append(answer)

        return choiceQuestions, choiceRight

class ProgramTaskEdit(APIView):

    permission_classes = [AuthorizedUserPermissions, UpdateCoursePermissions]

    def put(self, request, slug, slugTopic, slugLesson):
        data = request.data

        oldLesson = None

        prograLangueage = {
                'Python': 'py', 
                'Java': 'jv',
                'C#': 'c#'
            }
        try:
            task = Task.objects.get(slug=slugLesson)
            if data.get('changeType', False) and data.get('changeType').get('lessonType') == 'ProgramTask':
                oldLesson = Task.objects.get(slug=slugLesson)
        except ObjectDoesNotExist:
            if data.get('changeType', False) and data.get('changeType').get('lessonType') == 'ProgramTask':
                task = Task()
                oldLesson = TopicInfo.objects.get(slug=slugLesson)
            else:
                return Response(status=status.HTTP_404_NOT_FOUND)
        
        if data.get('name', False):
            task.name = data.get('name')
        
        if data.get('changeType', False) and data.get('changeType').get('lessonType') == 'ProgramTask':

            navigate = oldLesson.topicNavigate.first()
            programTask = ProgramTask()
            programTask.save()
            task.conetntObject = programTask
            task.save()
            navigate.contentObject = task
            navigate.save()

            if data.get('file', False):
                programTask.programLanguage = prograLangueage.get(data['changeType'].get('language'))
                try:
                    programTask = self.updateFileTest(programTask, data.get('file'))
                except TypeError:
                    task.conetntObject.testFile.save(data['file']['fileName'], ContentFile(data['file']['file']), save=True)
                    task.conetntObject.save()
                programTask.save()
            else:
                task.conetntObject = ProgramTask.objects.create(programLanguage=prograLangueage.get(data['changeType'].get('language')), testFile='')
            task.save()
            

            if isinstance(oldLesson, TopicInfo):
                oldLesson.delete()
        else:
            task.conetntObject.programLanguage = prograLangueage.get('languageName', None) or task.conetntObject.programLanguage
            if data.get('file', False):
                task.conetntObject = self.updateFileTest(task.conetntObject, data.get('file'))
            task.save()
        
        if data.get('description', False):
            task = descriptionEdit(task=task, description=data.get('description'))
            task.save()

        return Response(status=status.HTTP_200_OK)
    
    def getFileExtension(self, file):
        return os.path.splitext(file)[1]
    
    def updateFileTest(sefl, lesson, file):
        fileTest = file.get('file').split(',')[1]

        decode_file = base64.b64decode(fileTest)

        extension = {
            'py': '.py',
            'jv': '.java',
            'c#': '.cs'
        }

        extensionFile = sefl.getFileExtension(file.get('fileName'))

        if '.json' == extensionFile or lesson.pk is None:
            lesson.testFile.save(file.get('fileName'), ContentFile(decode_file), save=True)
            lesson.save()
        else:
            raise TypeError

        return lesson

        

"""
{
    'serialNumberTopic': {
        'info': {
            info
        },
        'content': {
            'serialNumberTopic + . + serialNumberTask': {
                'name': nameTask
                'slug': slugTask
            }
        }
    }
}
"""
"""
{
    "slug-topic": {
        'slug-topic': {
            do: "delete" | "rename",
            data: {
                name: ""
            }
        }
        'slug-task': {
            do: "delete" | "rename" | "change serial number" | 'create task"
            data: {
                isCreate: bool
                name: "",
                serialNumber: ""
            }
        }
    },
    "1111": {
        isCreate: True
        "1111": {
            isCreate: bool,
            name: ""
            serialNumber: ""
        }
    }
}
"""
"""
{
  'test1api11': {
    '0.330240840721646170.35120588928983254': {
      'do': 'create task',
      'data': {
        'name': 'asdasdasd',
        'serialNumber': '1'
      }
    },
    '0.236532595249131950.4154630805778269': {
      'do': 'create task',
      'data': {
        'name': 'asdasdasd',
        'serialNumber': '2'
      }
    },
    '0.52589569691530550.2821085477055395': {
      'do': 'create task',
      'data': {
        'name': 'asdasdasd',
        'serialNumber': '3'
      }
    },
    '0.479713531166560240.21816465222484693': {
      'do': 'create task',
      'data': {
        'name': 'asdasdasd',
        'serialNumber': '4'
      }
    },
    '0.53390319172348370.5692571145107099': {
      'do': 'create task',
      'data': {
        'name': 'asdasdasd',
        'serialNumber': '5'
      }
    },
    'change order': [
      '0.52589569691530550.2821085477055395',
      '0.479713531166560240.21816465222484693',
      '0.53390319172348370.5692571145107099',
      '0.330240840721646170.35120588928983254',
      '0.236532595249131950.4154630805778269'
    ]
  },
  'test1api3': {
    'test1api3': {
      'do': 'delete'
    }
  },
  'testtest14': {
    'infotestsss-2': {
      'do': 'delete',
      'data': {
        'name': 'infoTestsss',
        'serialNumber': '1'
      }
    }
  },
  '0.326216394950554770.5440931854394938': {
    '0.326216394950554770.5440931854394938': {
      'do': 'create',
      'data': {
        'name': '1111',
        'serialNumber': 5
      }
    },
    '0.122911732848468120.3711361144851353': {
      'do': 'create task',
      'data': {
        'name': '111',
        'serialNumber': '1'
      }
    },
    '0.6609491051050760.1654310320247696': {
      'do': 'create task',
      'data': {
        'name': '111',
        'serialNumber': '2'
      }
    },
    '0.79467989522614390.7090836619725625': {
      'do': 'create task',
      'data': {
        'name': '111',
        'serialNumber': '3'
      }
    },
    '0.30068074766074770.47246089664753443': {
      'do': 'create task',
      'data': {
        'name': '111',
        'serialNumber': '4'
      }
    },
    '0.224473978721940750.021194312784120206': {
      'do': 'create task',
      'data': {
        'name': '111',
        'serialNumber': '5'
      }
    }
  }
}
"""