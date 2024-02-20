from .models import Course
from .serializer import CourseSerializer
from authentication.permissions import AuthorizedUserPermissions
from authentication.jwtToken import AccessToken

from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status


class CreateCourse(CreateAPIView):
    serializer_class = CourseSerializer
    queryset = Course.objects.all()
    permission_classes = [AuthorizedUserPermissions]

    def get_serializer_context(self):
        context = super().get_serializer_context()

        accessToken = AccessToken()

        acsecPyaload = accessToken.getPyaload(self.request.COOKIES.get('access'))

        context['user'] = int(acsecPyaload.get('idUser', None))
        
        return context

@api_view(['GET'])
def getInfoCourse(request, slug):
    try:
        course = Course.objects.get(slug=slug)
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    courseSerializer = CourseSerializer(course)
    
    context = courseSerializer.data

    context['authors'] = ['{} {}'.format(auth.firstName, auth.lastName) for auth in course.authors.all()]
    context['tags'] = [tag.name for tag in course.tags.all()]

    return Response(context, status=status.HTTP_200_OK)
    
