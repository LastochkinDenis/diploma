from datetime import datetime, timedelta


from .serailizer import RegisterUser
from .jwtToken import AcescToken, RefreshToken
from .models import RefreshUser
from .permissions import AuthenticationPermissions, LogoutPermissions, UserPermissions
from user.models import User

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.exceptions import ValidationError
from django.contrib.auth import authenticate
from django.core.exceptions import ObjectDoesNotExist
from django.conf import settings
import pytz 

from django.utils import timezone


def createJWT(user, response, timeZone):

    now = datetime.now()

    targetTimeZone = pytz.timezone(timeZone)

    acescToken = AcescToken()
    refreshToken = RefreshToken()

    print(targetTimeZone, targetTimeZone.localize(now))

    response.set_cookie('acses', acescToken.createToken({
        'idUser': user.pk,
    }, timeZone
    ), path='/')

    refresh = refreshToken.createToken()
    
    refreshUser = RefreshUser.objects.filter(user=user)
    """
    A user can't have more 5 sessions. if user have more 5 sessions
    then delete all old sessions and create one new sessions.
    """
    if refreshUser.count() > 5:
        for r in refreshUser:
            r.delete()

    RefreshUser.objects.create(user=user, refresh=refresh, exp=datetime.now() + timedelta(days=30))

    response.set_cookie('refresh', refresh, 
                        expires=datetime.now() + timedelta(days=30),
                        path='/',
                        httponly=True,
                        )

    return response

def updateRefreshToken(response: Response, refreshUser: RefreshUser):
    refreshToken = RefreshToken()

    newRefresh = refreshToken.createToken()

    refreshUser.refresh = newRefresh
    refreshUser.exp = datetime.now() + timedelta(days=30)

    refreshUser.save()

    response.set_cookie('refresh', newRefresh, 
                    expires=datetime.now() + timedelta(days=30),
                    path='/',
                        httponly=True)
    
    return response


class RegsiterUserApi(APIView):
    
    permission_classes = [AuthenticationPermissions]

    def post(self, requset):
        data = requset.data.get('user', {})
        
        try:
            serializer = RegisterUser(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError as e:
            error = e.detail
            if 'user with this email already exists.' == error.get('email')[0]:
                return Response({
                    'error': 'user with this email already exists.'
                }, status=status.HTTP_400_BAD_REQUEST)
            return Response(status=status.HTTP_400_BAD_REQUEST)


        response = Response()
        response.data = {'isCrate': True}
        response.status_code = status.HTTP_201_CREATED
        return response


class LoginUserApi(APIView):
    
    permission_classes = [AuthenticationPermissions]

    def post(self, request):
        data = request.data.get('user', {})

        userEmail = data.get('email')
        userPassword = data.get('password')
        timeZone = data.get('timezone')

        user = authenticate(request, email=userEmail, password=userPassword)

        if user:
            response = createJWT(user, Response(), timeZone)
            
            response.data = {'user': {
                'email': user.email,
                'firstName': user.firstName,
                'lastName': user.lastName
            }}
            response.status_code = status.HTTP_200_OK
            return response

        return Response({'error': 'User do not found.'}, status=status.HTTP_400_BAD_REQUEST)
        

@api_view(['GET'])
@permission_classes([UserPermissions])
def getUserInfoApi(request):
    
    acesc = request.COOKIES.get('acesc', {})
    refresh = request.COOKIES.get('refresh', {})

    if acesc:
        acescPyaload = AcescToken.getPyaload()

        try:
            user = User.objects.get(id=int(acescPyaload.get('user')))
        except ObjectDoesNotExist:
            pass

        Response({'user': {
            'email': user.email,
            'firstName': user.firstName,
            'lastName': user.lastName
        }}, status=status.HTTP_200_OK)
    
    try:
        refreshUser = RefreshUser.objects.get(refresh=refresh)
    except:
        return Response(status=status.HTTP_403_UNAUTHORIZED)

    return Response({'user': {
            'email': refreshUser.user.email,
            'firstName': refreshUser.user.firstName,
            'lastName': refreshUser.user.lastName
        }}, status=status.HTTP_200_OK)

        

class LogoutUserApi(APIView):
    
    permission_classes = [LogoutPermissions]

    def post(self, request):
        acescToken = AcescToken()
        refreshToken = RefreshToken()
        
        acesc = request.COOKIES.get('acses')
        refresh = request.COOKIES.get('refresh')

        try:
            refreshUser = RefreshUser.objects.get(refresh=refresh)
            refreshUser.delete()
        except ObjectDoesNotExist:
            return Response('', status=status.HTTP_403_FORBIDDEN)
        
        response = Response()

        response.delete_cookie('acses', path='/')
        response.delete_cookie('refresh', path='/')

        response.data = 'User log out'
        response.status_code = status.HTTP_200_OK

        return response

@api_view(['GET'])
def updateAcsesToken(requset):
    refreshToken = RefreshToken()
    acescToken = AcescToken()

    try:
        refreshUser = RefreshUser.objects.get(refresh=requset.COOKIES.get('refresh', ''))
    except ObjectDoesNotExist:
        return Response('', status=status.HTTP_403_FORBIDDEN)

    response = Response()

    refresh = refreshToken.getPyaload(requset.data.get('refresh'))
    exp = datetime.fromtimestamp(refresh.get('exp'))

    if exp < datetime.now():
        response = updateRefreshToken(response, refreshUser)

    payload = {
        'idUser': refreshUser.user.id
    }    

    newAcesc = acescToken.createToken(payload=payload)

    response.set_cookie('acses', newAcesc, path='/')
    response.status_code = status.HTTP_200_OK
    return response