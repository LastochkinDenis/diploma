from authentication.jwtToken import AccessToken
from user.models import User 
from user.getUser import getUser
from course_lesson.models import UserTry
from course_content.models import Task, Topic
from course.models import Course, UserCertificate
from authentication.permissions import AuthorizedUserPermissions
from .serializer import UserCertificateSerializer


from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.core.exceptions import ObjectDoesNotExist


@api_view(['GET'])
@permission_classes([AuthorizedUserPermissions])
def getCertificateUserInfo(request):
    user = getUser(request)

    if user is None:
        return Response(status=status.HTTP_403_FORBIDDEN)

    courses = Course.objects.filter(students=user)

    userCertificate = UserCertificate.objects.filter(idUser=user)
    for course in courses:
        if not userCertificate.filter(idCourse=course).exists():
            certificateCourse(course, user)
    
    userCertificate = UserCertificate.objects.filter(idUser=user)

    serializer = UserCertificateSerializer(data=userCertificate, many=True)
    serializer.is_valid()
    return Response(data=serializer.data, status=status.HTTP_200_OK)


def certificateCourse(course, user):
    tasks = Task.objects.filter(topicNavigate__idTopic__idCourse=course) \
    .filter(usertry__user=user, usertry__result=True).distinct()
    amoutnTask = Task.objects.filter(topicNavigate__idTopic__idCourse=course).count()

    if tasks.count() == amoutnTask:
        UserCertificate.objects.create(idCourse=course, idUser=user)