from .models import Course
from .serializer import CreateCourseSerializer
from authentication.permissions import AuthorizedUserPermissions
from authentication.jwtToken import AccessToken

from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response


class CreateCourse(CreateAPIView):
    serializer_class = CreateCourseSerializer
    queryset = Course.objects.all()
    permission_classes = [AuthorizedUserPermissions]

    def get_serializer_context(self):
        context = super().get_serializer_context()

        accessToken = AccessToken()

        acsecPyaload = accessToken.getPyaload(self.request.COOKIES.get('access'))

        context['user'] = int(acsecPyaload.get('idUser', None))
        
        return context