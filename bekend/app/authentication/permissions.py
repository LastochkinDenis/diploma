from .jwtToken import RefreshToken, AccessToken


from rest_framework.permissions import BasePermission
from jwt.exceptions import ExpiredSignatureError, DecodeError

def catchErrorToken(func):

    def wraper(*args, **kwargs):
        try:
            permission = func(*args, **kwargs)
        except ExpiredSignatureError:
            return False
        except DecodeError:
            return False
        return permission
    
    return wraper

class AuthenticationPermissions(BasePermission):

    def has_permission(self, request, view):
        """
        if user isn't authorized they receives permission
        for register and log in. 
        """
        acses = request.COOKIES.get('acses', {})
        refresh = request.COOKIES.get('refresh', {})

        if not acses and not refresh:
            return True
        
        return False

class LogoutPermissions(BasePermission):

    def has_permission(self, request, view):
        refresh = request.COOKIES.get('refresh', None)

        if refresh:
            return True
        
        return False
    
class UserPermissions(BasePermission):

    @catchErrorToken
    def has_permission(self, request, view):
        
        refreshToken = RefreshToken()
        
        refresh = request.COOKIES.get('refresh', {})

        if not refresh:
            return False

        if not refreshToken.chekToken(refresh):
            return False

        return True
    
class AuthorizedUserPermissions(BasePermission):
    
    @catchErrorToken
    def has_permission(self, request, view):

        refreshToken = RefreshToken()
        accessToken = AccessToken()

        refresh = request.COOKIES.get('refresh', None)
        access = request.COOKIES.get('access', None)

        if not refresh and not refreshToken.chekToken(refresh):
            return False
    
        if not access and not accessToken.chekToken(accessToken):
            return False
        
        return True