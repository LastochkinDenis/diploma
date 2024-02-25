from .models import (TopicNavigate, TopicInfo, Topic,
                      Task, ProgramTask, QuestionTask,
                      OpenQuestion)
from course.models import Course
from .serializer import TopicSerializer, UpdateTopicSerializer
from course.permissions import UpdateCoursePermissions
from authentication.permissions import AuthorizedUserPermissions


from django.core.exceptions import ObjectDoesNotExist
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
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