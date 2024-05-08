from .views import (RederectLessonCourse, GetTopicsCourse, Lesson)

from django.urls import path

urlpatterns = [
    path('course/<slug:slug>/rederect/', RederectLessonCourse),
    path('course/<slug:slug>/topics/', GetTopicsCourse),
    path('course/<slug:slug>/topic/<slug:slugTopic>/lesson/<slug:slugLesson>/', Lesson.as_view()),
]