from .views import (CreateTopicApi, GetTopicApi,
                     UpdateTopicSerialNumberApi, UpdateTopicNameApi,
                     CreateTopicInfoApi,
                     CourseContent, getLessonsSlug, TopicInfoEditApi,
                     GetLessonEdit, OpenQuestionEdit)


from django.urls import path

urlpatterns = [
    path('<slug:slug>/createtopic/', CreateTopicApi.as_view()),
    path('<slug:slug>/topic/<slug:slugtopic>/', GetTopicApi.as_view()),
    path('<slug:slug>/topicserialnumber/', UpdateTopicSerialNumberApi.as_view()),#
    path('<slug:slug>/topicname/<slug:slugtopic>/', UpdateTopicNameApi),#
    path('<slug:slug>/topic/<slug:slugtopic>/createtopicinfo', CreateTopicInfoApi.as_view()),
    path('<slug:slug>/content/', CourseContent.as_view()),
    path('<slug:slug>/lessons/<slug:slugTopic>/', getLessonsSlug),
    path('<slug:slug>/topic/<slug:slugTopic>/lesson/<slug:slugLesson>/', GetLessonEdit.as_view()),
    path('<slug:slug>/topicinfo/<slug:slugTopic>/edit/<slug:slugLesson>', TopicInfoEditApi.as_view()),
    path('<slug:slug>/openquestion/<slug:slugTopic>/edit/<slug:slugLesson>', OpenQuestionEdit.as_view())
]