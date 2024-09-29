from django.contrib import admin
from .models import Cat, User

@admin.register(Cat)
class CatAdmin(admin.ModelAdmin):
    search_fields = ('name', 'age', 'breed')
    list_display = ('name', 'age', 'breed', 'created_at')


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    ...

# @admin.register(Breeder)
# class BreederAdmin(admin.ModelAdmin):
#     list_display = ('user',)
#     search_fields = ('user__username',)
