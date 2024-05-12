from user.models import User
from authentication.jwtToken import AccessToken

from django.core.exceptions import ObjectDoesNotExist
from rest_framework.response import Response
from rest_framework import status
from jwt.exceptions import ExpiredSignatureError, DecodeError

def getUser(request):
    accessToken = AccessToken()

    try:
        access = accessToken.getPyaload(request.COOKIES.get('access', None))
        user = User.objects.get(id=int(access.get('idUser')))
        return user
    except (ExpiredSignatureError, DecodeError, ObjectDoesNotExist):
        return None