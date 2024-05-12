from course.models import UserCertificate


from rest_framework.serializers import ModelSerializer
from rest_framework import serializers

class UserCertificateSerializer(ModelSerializer):

    def get_nameCourse(self, obj):
        return obj.idCourse.name

    nameCourse = serializers.SerializerMethodField()

    class Meta:
        model = UserCertificate
        fields = ['id', 'idCourse', 'idUser','date', 'nameCourse']