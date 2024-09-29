from django.http import Http404
from .models import Cat, User
from .serializers import CatSerializer, BreederSerializer
from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated

class MyCatViewSet(viewsets.ModelViewSet):
    serializer_class = CatSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cat.objects.filter(breeder=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(breeder=self.request.user)
    


class OtherCatViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = CatSerializer
    
    def get_queryset(self):
        breeder_id = self.kwargs.get('breeder_id')
        cat_id = self.kwargs.get('cat_id')
        queryset = Cat.objects.select_related('breeder') 
        
        if breeder_id and cat_id:
            return queryset.filter(breeder_id=breeder_id, id=cat_id)
        elif breeder_id:
            return queryset.filter(breeder_id=breeder_id)
        else:
            raise Http404("Breeder ID is required")
    
    lookup_field = 'id'


class BreederViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = BreederSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.exclude(pk=self.request.user.pk)