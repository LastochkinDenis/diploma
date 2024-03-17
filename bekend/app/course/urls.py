from .views import (CreateCourseApi, GetInfoCourseApi, UpdateCorseApi,
                    AddAuthCourse, AddTagsCourse, GetCourseListApi,
                    DeleteCourseApi)
from django.urls import path


urlpatterns = [
    path('courselist/', GetCourseListApi),
    path('cratecourse/', CreateCourseApi.as_view()),
    path('<slug:slug>/', GetInfoCourseApi),
    path('<slug:slug>/update/', UpdateCorseApi.as_view()),
    path('<slug:slug>/addauth/', AddAuthCourse.as_view()),
    path('<slug:slug>/addtags/', AddTagsCourse.as_view()),
    path('<slug:slug>/delete/', DeleteCourseApi)
]