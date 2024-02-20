from .views import CreateCourse, getInfoCourse
from django.urls import path


urlpatterns = [
    path('cratecourse/', CreateCourse.as_view()),
    path('course/<slug:slug>', getInfoCourse),
]