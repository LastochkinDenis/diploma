from authentication.permissions import catchErrorToken
from authentication.jwtToken import AccessToken
from user.models import User
from course.models import Course

from rest_framework.permissions import BasePermission
from django.core.exceptions import ObjectDoesNotExist

class UserEnrollmentCourse(BasePermission):
    
    @catchErrorToken
    def has_permission(self, request, view):
        accessToken = AccessToken()

        acsecPyaload = accessToken.getPyaload(request.COOKIES.get('access'))

        try:
            course = Course.objects.get(slug=view.kwargs.get('slug'))
        except ObjectDoesNotExist:
            return False


        return course.students.filter(id=int(acsecPyaload.get('idUser', None))).exists()