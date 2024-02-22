from .views import (CreateCourseApi, getInfoCourseApi, UpdateCorseApi,
                    AddAuthCourse, AddTagsCourse)
from django.urls import path


urlpatterns = [
    path('cratecourse/', CreateCourseApi.as_view()),
    path('course/<slug:slug>/', getInfoCourseApi),
    path('course/<slug:slug>/update/', UpdateCorseApi.as_view()),
    path('course/<slug:slug>/addauth', AddAuthCourse.as_view()),
    path('course/<slug:slug>/addtags', AddTagsCourse.as_view())
]