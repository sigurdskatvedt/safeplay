from django.contrib import admin
from .models import ConsentRequest

class ConsentRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'match', 'is_approved', 'created_at', 'updated_at')
    list_filter = ('is_approved', 'created_at')
    search_fields = ('user__username', 'match__id')
    ordering = ('-created_at',)

admin.site.register(ConsentRequest, ConsentRequestAdmin)

