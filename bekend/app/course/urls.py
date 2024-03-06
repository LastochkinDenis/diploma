from .views import (CreateCourseApi, getInfoCourseApi, UpdateCorseApi,
                    AddAuthCourse, AddTagsCourse, GetCorseListApi)
from django.urls import path


urlpatterns = [
    path('courselist/', GetCorseListApi),
    path('cratecourse/', CreateCourseApi.as_view()),
    path('<slug:slug>/', getInfoCourseApi),
    path('<slug:slug>/update/', UpdateCorseApi.as_view()),
    path('<slug:slug>/addauth/', AddAuthCourse.as_view()),
    path('<slug:slug>/addtags/', AddTagsCourse.as_view()),
]