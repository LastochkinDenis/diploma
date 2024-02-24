from .models import Topic
from course.models import Course


from rest_framework.serializers import ModelSerializer
from rest_framework import serializers 


class CreateTopicSerializer(ModelSerializer):

    def create(self, validated_data):

        print(self.context.get('course'))

        topic = Topic.objects.create(
            name=validated_data.get('name'),
            idCourse=self.context.get('course')
        )

        return topic
    
    idCourse = serializers.PrimaryKeyRelatedField(required=False, queryset=Course.objects.all())
    serialNumber = serializers.ImageField(required=False)

    read_only_fields = ['serialNumber', 'slug']

    class Meta:
        model = Topic
        fields = ['name', 'idCourse', 'serialNumber', 'slug']