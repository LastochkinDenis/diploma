from .views import (CreateTopicApi, GetTopicApi,
                     UpdateTopicSerialNumberApi, UpdateTopicNameApi)


from django.urls import path

urlpatterns = [
    path('<slug:slug>/createtopic/', CreateTopicApi.as_view()),
    path('<slug:slug>/topic/<slug:slugtopic>/', GetTopicApi.as_view()),
    path('<slug:slug>/topicserialnumber/', UpdateTopicSerialNumberApi.as_view()),
    path('<slug:slug>/topicname/<slug:slugtopic>/', UpdateTopicNameApi)
]