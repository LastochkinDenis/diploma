from .models import (TopicNavigate, TopicInfo, Topic,
                      Task, ProgramTask, QuestionTask,
                      OpenQuestion)
from course.models import Course
from .serializer import TopicSerializer
from course.permissions import UpdateCoursePermissions
from authentication.permissions import AuthorizedUserPermissions


from django.core.exceptions import ObjectDoesNotExist
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView


class CreateTopicApi(CreateAPIView):
    
    serializer_class = TopicSerializer
    permission_classes = [AuthorizedUserPermissions, UpdateCoursePermissions]
    queryset = Topic.objects.all()

    def get_serializer_context(self):

        context = super().get_serializer_context()

        course = Course.objects.get(slug=self.kwargs.get('slug', ''))

        context['course'] = course

        return context

class getTopicApi(APIView):

    permission_classes = [AuthorizedUserPermissions]

    def get(self, request, slug, slugtopic):

        try:
            topic = Topic.objects.get(slug=slugtopic)
        except ObjectDoesNotExist:
            return Response(data={
                'error': 'Topic did\'t find'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = TopicSerializer(topic)
        print(topic.serialNumber)
        print(serializer.data)

        return Response(data=serializer.data, status=status.HTTP_200_OK)