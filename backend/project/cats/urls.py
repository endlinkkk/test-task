from .views import MyCatViewSet, OtherCatViewSet, BreederViewSet
from rest_framework.routers import DefaultRouter
from django.urls import path


router = DefaultRouter()
router.register('cats', MyCatViewSet, basename='cat')
router.register('breeders', BreederViewSet, basename='breeder')


urlpatterns = [
    
    path('breeders/<int:breeder_id>/cats/', OtherCatViewSet.as_view({'get': 'list'})),
    path('cats/<int:breeder_id>/<int:id>/', OtherCatViewSet.as_view({'get': 'retrieve'})),
]

urlpatterns += router.urls
