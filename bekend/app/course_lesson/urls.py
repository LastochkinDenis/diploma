from .views import (RederectLessonCourse, GetTopicsCourse, Lesson,
                    OpenQuestionCheck, QuestionTaskCheck)

from django.urls import path

urlpatterns = [
    path('course/<slug:slug>/rederect/', RederectLessonCourse),
    path('course/<slug:slug>/topics/', GetTopicsCourse),
    path('course/<slug:slug>/topic/<slug:slugTopic>/lesson/<slug:slugLesson>/', Lesson.as_view()),
    path('course/<slug:slug>/topic/<slug:slugTopic>/lesson/<slug:slugLesson>/openquestion/check', OpenQuestionCheck.as_view()),
    path('course/<slug:slug>/topic/<slug:slugTopic>/lesson/<slug:slugLesson>/questiontask/check', QuestionTaskCheck.as_view()),
]