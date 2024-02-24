from .views import CreateTopicApi


from django.urls import path

urlpatterns = [
    path('createtopic/<slug:slug>/', CreateTopicApi.as_view()),
]