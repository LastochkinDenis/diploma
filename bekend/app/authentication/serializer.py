from .jwtToken import AccessToken, RefreshToken
from .models import RefreshUser
from user.models import User

from rest_framework import serializers


class RegisterUser(serializers.ModelSerializer):

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'firstName', 'lastName']