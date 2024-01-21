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
        acses = request.COOKIES.get('acses', {})
        refresh = request.COOKIES.get('refresh', {})

        if acses and refresh:
            return True
        
        return False