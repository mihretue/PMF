from django.contrib import admin
from .models import Escrow

@admin.register(Escrow)
class EscrowAdmin(admin.ModelAdmin):
    list_display = ('id', 'content_object', 'amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('id', 'object_id')
    readonly_fields = ('created_at',)

    actions = ['mark_as_released', 'mark_as_refunded', 'mark_as_disputed']

    def mark_as_released(self, request, queryset):
        updated = queryset.update(status='released')
        self.message_user(request, f"{updated} escrows marked as released.")
    mark_as_released.short_description = "Mark selected escrows as Released"

    def mark_as_refunded(self, request, queryset):
        updated = queryset.update(status='refunded')
        self.message_user(request, f"{updated} escrows marked as refunded.")
    mark_as_refunded.short_description = "Mark selected escrows as Refunded"

    def mark_as_disputed(self, request, queryset):
        updated = queryset.update(status='disputed')
        self.message_user(request, f"{updated} escrows marked as disputed.")
    mark_as_disputed.short_description = "Mark selected escrows as Disputed"
