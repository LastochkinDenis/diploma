from .views import CreateCourse
from django.urls import path


urlpatterns = [
    path('cratecouruse/', CreateCourse.as_view())
]