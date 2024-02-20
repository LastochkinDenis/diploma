from .views import CreateCourseApi, getInfoCourseApi, UpdateCorseApi
from django.urls import path


urlpatterns = [
    path('cratecourse/', CreateCourseApi.as_view()),
    path('course/<slug:slug>/', getInfoCourseApi),
    path('course/<slug:slug>/update/', UpdateCorseApi.as_view()),
]