from .models import Topic
from course.models import Course


from rest_framework.serializers import ModelSerializer
from rest_framework import serializers 


class TopicSerializer(ModelSerializer):

    def create(self, validated_data):

        print(self.context.get('course'))

        topic = Topic.objects.create(
            name=validated_data.get('name'),
            idCourse=self.context.get('course')
        )

        return topic
    
    idCourse = serializers.PrimaryKeyRelatedField(required=False, queryset=Course.objects.all())
    serialNumber = serializers.IntegerField(required=False)

    read_only_fields = ['serialNumber', 'slug']

    class Meta:
        model = Topic
        fields = ['name', 'idCourse', 'serialNumber', 'slug']

class UpdateTopicSerializer(ModelSerializer):

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.serialNumber = validated_data.get('serialNumber', instance.serialNumber)
        instance.save()
        return instance
    
    read_only_fields = ['idCourse', 'slug']

    class Meta:
        model = Topic
        fields = ['name', 'idCourse', 'serialNumber', 'slug']