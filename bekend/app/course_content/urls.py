from .views import (CreateTopicApi, GetTopicApi,
                     UpdateTopicSerialNumberApi, UpdateTopicNameApi,
                     CreateTopicInfoApi)


from django.urls import path

urlpatterns = [
    path('<slug:slug>/createtopic/', CreateTopicApi.as_view()),
    path('<slug:slug>/topic/<slug:slugtopic>/', GetTopicApi.as_view()),
    path('<slug:slug>/topicserialnumber/', UpdateTopicSerialNumberApi.as_view()),
    path('<slug:slug>/topicname/<slug:slugtopic>/', UpdateTopicNameApi),
    path('<slug:slug>/topic/<slug:slugtopic>/createtopicinfo', CreateTopicInfoApi.as_view()),
]