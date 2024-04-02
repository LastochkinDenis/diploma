from .views import (CreateCourseApi, GetInfoDesctiptionCourseApi, UpdateDescriptionCorseApi,
                    AddAuthCourse, AddTagsCourse, GetCourseListApi,
                    DeleteCourseApi)
from django.urls import path


urlpatterns = [
    path('courselist/', GetCourseListApi),
    path('cratecourse/', CreateCourseApi.as_view()),
    path('<slug:slug>/description/', GetInfoDesctiptionCourseApi),
    path('<slug:slug>/update/desription/', UpdateDescriptionCorseApi.as_view()),
    path('<slug:slug>/addauth/', AddAuthCourse.as_view()),
    path('<slug:slug>/addtags/', AddTagsCourse.as_view()),
    path('<slug:slug>/delete/', DeleteCourseApi)
]