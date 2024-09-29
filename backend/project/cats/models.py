from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    is_breeder = models.BooleanField(default=True, verbose_name='Is breeder')


class Cat(models.Model):
    name = models.CharField(max_length=255, verbose_name='Cat name')
    age = models.PositiveIntegerField(verbose_name='Cat age')
    breed = models.CharField(max_length=255, verbose_name='Cat breed')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Date of creation')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Date of update')
    breeder = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='cats', verbose_name='Breeder')
    
    def __str__(self) -> str:
        return self.name
    
    class Meta:
        verbose_name = 'Cat'
        verbose_name_plural = 'Cats'


