from .models import Course, Tag
from .serializer import CourseSerializer, UpdateSerializer, AuthorsSerializer, CourseRecomendSerializer
from authentication.permissions import AuthorizedUserPermissions
from authentication.jwtToken import AccessToken
from .permissions import UpdateCoursePermissions
from user.models import User 

from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, UpdateAPIView, ListAPIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from jwt.exceptions import ExpiredSignatureError, DecodeError
from django.db.models import F, Q


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
    contentCourse = []

    for topic in course.topic_set.all().order_by('serialNumber'):
        data = {}
        data['title'] = topic.name
        data['isOpen'] = False
        subitems = []

        for lesson in topic.topicnavigate_set.all():
            subitems.append(lesson.contentObject.name)

        data['subitems'] = subitems
        contentCourse.append(data)

    context['content'] = contentCourse

    accessToken = AccessToken()

    try:
        access = accessToken.getPyaload(request.COOKIES.get('access', None))
        enrollment = bool(course.students.filter(id=int(access.get('idUser'))))

        context['enrollment'] = enrollment
    except (ExpiredSignatureError, DecodeError):
        context['enrollment'] = False

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

class Authors(ListAPIView):

    permission_classes = [AuthorizedUserPermissions, UpdateCoursePermissions]
    serializer_class = AuthorsSerializer

    def get_queryset(self):
        
        course = Course.objects.get(slug=self.kwargs.get('slug', ''))
        
        return course.authors.all()

    def post(self, request, slug):
        email = request.data.get('email')
        
        try:
            course = Course.objects.get(slug=slug)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        try:
            user = User.objects.get(email=email)
            course.authors.add(user)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        serializer = AuthorsSerializer(data=course.authors.all(), many=True)
        serializer.is_valid()

        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, slug):
        email = request.data.get('email')

        try:
            course = Course.objects.get(slug=slug)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
            
        try:
            user = User.objects.get(email=email)
            course.authors.remove(user)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        serializer = AuthorsSerializer(data=course.authors.all(), many=True)
        serializer.is_valid()

        return Response(data=serializer.data, status=status.HTTP_200_OK)
    
@api_view(['GET'])
def GetCourseRecomend(request):
    q = Q(status__exact='d') | Q(status__exact='a')
    courses = Course.objects.filter(q).order_by('?')[:12]


    serializer = CourseRecomendSerializer(data=courses, many=True)
    serializer.is_valid()

    return Response(data=serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AuthorizedUserPermissions])
def CourseEnrollment(request, slug):
    
    try:
        course = Course.objects.get(slug=slug)
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    accessToken = AccessToken()

    try:
        access = accessToken.getPyaload(request.COOKIES.get('access', None))
    except ExpiredSignatureError:
        return Response(status=status.HTTP_403_FORBIDDEN)

    user = User.objects.get(id=int(access.get('idUser')))
    
    course.students.add(user)

    return Response(status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AuthorizedUserPermissions])
def GetTrainingUser(request):

    accessToken = AccessToken()

    try:
        access = accessToken.getPyaload(request.COOKIES.get('access', None))
    except ExpiredSignatureError:
        return Response(status=status.HTTP_403_FORBIDDEN)

    user = User.objects.get(id=int(access.get('idUser')))

    courses = user.stundets_course.all()
    serializer = CourseSerializer(data=courses, many=True)
    serializer.is_valid()
    return Response(data=serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AuthorizedUserPermissions, UpdateCoursePermissions])
def PublishCourse(request, slug):
    try:
        course = Course.objects.get(slug=slug)

        
        course.status = 'a'

        course.save()

        return Response(status=status.HTTP_200_OK)
    except Course.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

"""
    {
        "delete": [email],
        "add": [email]
    }
"""