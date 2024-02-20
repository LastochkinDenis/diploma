from .models import Course
from user.models import User


from rest_framework.serializers import ModelSerializer
from rest_framework import serializers


class CreateCourseSerializer(ModelSerializer):

    def create(self, validated_data):

        course = Course.objects.create(name=validated_data.get('name'), 
                                       description=validated_data.get('description'),
                                       imageCourse=validated_data.get('imageCourse', None))
        
        user = User.objects.get(id=self.context.get('user'))
        course.authors.add(user)

        return course

    read_only_fields = ['status', 'slug']
    
    class Meta:
        model = Course
        fields = ['name','description','status' , 'status', 'slug']