from .views import RegsiterUserApi, LoginUserApi, updateAcsesToken, LogoutUserApi, getUserInfoApi

from django.urls import path

urlpatterns = [
    path('register/', RegsiterUserApi.as_view()),
    path('login/', LoginUserApi.as_view()),
    path('updateacesc/', updateAcsesToken),
    path('logout/', LogoutUserApi.as_view()),
    path('userinfo/', getUserInfoApi)
]