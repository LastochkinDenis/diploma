import os
from datetime import datetime, timedelta
from random import choices
from string import ascii_letters

from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
import pytz

file_dire = os.path.join(settings.BASE_DIR, 'config.py')

from config import TOKEN_SECRET
from .models import RefreshUser


import jwt


LETTERS = ascii_letters + '123456789!@#$%^&*()_-=+;:{}<>/.,'

class Token:

    def chekToken(self, token):

        if not token:
            False

        payload = self.getPyaload(token)
        varifiableToken = jwt.encode(payload, TOKEN_SECRET, algorithm='HS256')

        if varifiableToken == token:
            return True
        return False
    
    def createToken(self, payload:dict , exp: datetime):
        payload['exp'] = exp

        return jwt.encode(payload, TOKEN_SECRET, algorithm='HS256')
    
    @classmethod
    def getPyaload(cls, token):
        return jwt.decode(token, TOKEN_SECRET, algorithms=['HS256'])

class AccessToken(Token):
    
    
    def createToken(self, payload):

        exp = datetime.now() + timedelta(minutes=10)

        return super().createToken(payload=payload, exp=exp)

    def updateToken(self, updatableToken, payload):
        if not self.chekToken(updatableToken):
            return None
        return self.creteAcescToken(payload)

class RefreshToken(Token):
    
    @property
    def getRefresh(self):
        while True:
            refresh = "".join(choices(LETTERS, k=100))
            if RefreshUser.objects.filter(refresh=refresh).count() == 0:
                return refresh
            
    def createToken(self):
        now = datetime.now()

        exp = now + timedelta(days=30)
        return super().createToken({'refresh': self.getRefresh}, exp)
    
    def updateToken(self, updatableToken):
        if not self.chekToken(updatableToken):
            return None
        return self.createToken()