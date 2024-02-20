from .jwtToken import RefreshToken, AccessToken


from rest_framework.permissions import BasePermission

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
        refresh = request.COOKIES.get('refresh', {})

        if refresh:
            return True
        
        return False
    
class UserPermissions(BasePermission):

    def has_permission(self, request, view):
        
        refreshToken = RefreshToken()
        
        refresh = request.COOKIES.get('refresh', {})

        if not refresh:
            return False

        if not refreshToken.chekToken(refresh):
            return False

        return True
    
class AuthorizedUserPermissions(BasePermission):
    
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