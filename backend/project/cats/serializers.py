from rest_framework.serializers import ModelSerializer
from .models import Cat, User


class BreederSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username') 


class CatSerializer(ModelSerializer):
    class Meta:
        model = Cat
        fields = ('id', 'name', 'age', 'breed', 'created_at', 'updated_at',)
