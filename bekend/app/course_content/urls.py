from .views import CreateTopicApi, getTopicApi


from django.urls import path

urlpatterns = [
    path('<slug:slug>/createtopic/', CreateTopicApi.as_view()),
    path('<slug:slug>/topic/<slug:slugtopic>/', getTopicApi.as_view())
]