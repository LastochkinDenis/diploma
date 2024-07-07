from .views import getCertificateUserInfo

from django.urls import path

urlpatterns = [
    path('certificate/', getCertificateUserInfo,),
]