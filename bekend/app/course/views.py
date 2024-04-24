from .models import Course, Tag
from .serializer import CourseSerializer, UpdateSerializer
from authentication.permissions import AuthorizedUserPermissions
from authentication.jwtToken import AccessToken
from .permissions import UpdateCoursePermissions
from user.models import User 

from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, UpdateAPIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from jwt.exceptions import ExpiredSignatureError


class CreateCourseApi(CreateAPIView):
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
def GetInfoDesctiptionCourseApi(request, slug):
    try:
        course = Course.objects.get(slug=slug)
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    courseSerializer = CourseSerializer(course)
    
    context = courseSerializer.data

    context['authors'] = ['{} {}'.format(auth.firstName, auth.lastName) for auth in course.authors.all()]
    context['tags'] = [tag.name for tag in course.tags.all()]

    return Response(data={'course' : context}, status=status.HTTP_200_OK)
        
class UpdateDescriptionCorseApi(UpdateAPIView):
    queryset = Course.objects.all()
    serializer_class = UpdateSerializer
    permission_classes = [AuthorizedUserPermissions, UpdateCoursePermissions]

    def get_object(self):
        slug = self.kwargs.get('slug', '')

        return Course.objects.get(slug=slug)

class AddAuthCourse(APIView):

    permission_classes = [AuthorizedUserPermissions, UpdateCoursePermissions]

    def post(self, request, slug):
        
        auths = request.data.get('authors', [])
        authAdded = []

        if not auths:
            return Response(data={
                'error': 'author didn\'t get'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            course = Course.objects.get(slug=slug)
        except ObjectDoesNotExist:
            return Response(data={
                'error': 'course didn\'t find'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        for IdAuth in auths:
            try:
                auth = User.objects.get(id=int(IdAuth))
            except:
                continue
            
            authAdded.append(IdAuth)
            course.authors.add(auth)
        
        return Response({
            'authors': authAdded
        }, status=status.HTTP_200_OK)

class AddTagsCourse(APIView):

    permission_classes = [AuthorizedUserPermissions, UpdateCoursePermissions]

    def put(self, request, slug):

        tags = request.data.get('tags', None)
        tagsAdded = []

        if not tags:
            return Response(data={
                'error': 'tags did\'t get'
            },status=status.HTTP_400_BAD_REQUEST)

        try:
            course = Course.objects.get(slug=slug)
        except ObjectDoesNotExist:
            return Response(data={
                'error': 'course didn\'t find'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        for tagName in tags:
            try:
                tag = Tag.objects.get(name=tagName)
            except ObjectDoesNotExist:
                continue
            
            tagsAdded.append(tag.name)
            course.tags.add(tag)
        
        return Response(data={
            'tags': tagsAdded
        }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([AuthorizedUserPermissions])
def GetCourseListApi(request):

    accessToken = AccessToken()

    try:
        access = accessToken.getPyaload(request.COOKIES.get('access', None))
    except ExpiredSignatureError:
        return Response(status=status.HTTP_403_FORBIDDEN)
    
    courses = Course.objects.filter(authors__id=int(access.get('idUser')),
                                    status__in=('a','d'))

    if courses.count() == 0:
        return Response(
            data={
                'error': 'User don\'t have course'
            },
            status=status.HTTP_400_BAD_REQUEST
            )

    serializer = CourseSerializer(courses, many=True)

    return Response(data=serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AuthorizedUserPermissions, UpdateCoursePermissions])
def DeleteCourseApi(request, slug):
    try:
        course = Course.objects.get(slug=slug)
    except ObjectDoesNotExist:
        return Response(data={
            'error': 'course didn\'t find'
        }, status=status.HTTP_404_NOT_FOUND)
    
    course.status = 'r'
    course.save()

    return Response(status=status.HTTP_201_CREATED)
