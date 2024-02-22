from authentication.jwtToken import RefreshToken, AccessToken
from .models import Course



from rest_framework.permissions import BasePermission
from django.core.exceptions import ObjectDoesNotExist
from jwt.exceptions import ExpiredSignatureError

class UpdateCoursePermissions(BasePermission):
    
    def has_permission(self, request, view):

        slug = view.kwargs.get('slug')

        accessToken = AccessToken()

        try:
            accessPayload = accessToken.getPyaload(request.COOKIES.get('access', ''))
        except ExpiredSignatureError:
            return False
        try:
            authors = Course.objects.get(slug=slug, authors__id=accessPayload.get('idUser'))
        except ObjectDoesNotExist:
            return False

        return True
