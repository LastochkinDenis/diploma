from .models import Course
from user.models import User


from rest_framework.serializers import ModelSerializer
from rest_framework import serializers


class CourseSerializer(ModelSerializer):

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
        fields = ['name','description','status' , 'slug']
    
class UpdateSerializer(ModelSerializer):

    name = serializers.CharField(required=False)
    description = serializers.CharField(required=False)
    status = serializers.CharField(required=False)
    imageCourse = serializers.ImageField(required=False)

    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.description = validated_data.get("description", instance.description)
        instance.status = validated_data.get("status", instance.status)
        instance.imageCourse = validated_data.get("imageCourse", instance.imageCourse)
        instance.save()
        return instance

    class Meta:
        model = Course
        fields = ['name','description','status', 'imageCourse']

    