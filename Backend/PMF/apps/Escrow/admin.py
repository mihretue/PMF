from django.contrib import admin
from .models import Escrow
from apps.Notifications.models import Notification

@admin.register(Escrow)
class EscrowAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_content_object', 'amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('id', 'object_id')
    readonly_fields = ('created_at',)

    actions = ['mark_as_released', 'mark_as_refunded', 'mark_as_disputed']

    def mark_as_released(self, request, queryset):
        updated = queryset.update(status='released')
        for escrow in queryset:
            # Try receiver, fallback to user
            user = getattr(escrow.content_object, "receiver", None) or getattr(escrow.content_object, "user", None)
            if user:
                try:
                    Notification.objects.create(
                        user=user,
                        message=f"Funds from escrow (ID: {escrow.id}) have been released to you (admin action)."
                    )
                except Exception as e:
                    pass  # Don't crash admin for notification errors
        self.message_user(request, f"{updated} escrows marked as released.")
    mark_as_released.short_description = "Mark selected escrows as Released"

    def mark_as_refunded(self, request, queryset):
        updated = queryset.update(status='refunded')
        for escrow in queryset:
            user = getattr(escrow.content_object, "sender", None) or getattr(escrow.content_object, "user", None)
            if user:
                try:
                    Notification.objects.create(
                        user=user,
                        message=f"Funds in escrow (ID: {escrow.id}) have been refunded to you (admin action)."
                    )
                except Exception as e:
                    pass
        self.message_user(request, f"{updated} escrows marked as refunded.")
    mark_as_refunded.short_description = "Mark selected escrows as Refunded"

    def mark_as_disputed(self, request, queryset):
        updated = queryset.update(status='disputed')
        for escrow in queryset:
            user = getattr(escrow.content_object, "sender", None) or getattr(escrow.content_object, "user", None)
            if user:
                try:
                    Notification.objects.create(
                        user=user,
                        message=f"Escrow (ID: {escrow.id}) has been marked as disputed (admin action)."
                    )
                except Exception as e:
                    pass
        self.message_user(request, f"{updated} escrows marked as disputed.")
    mark_as_disputed.short_description = "Mark selected escrows as Disputed"

    def get_content_object(self, obj):
        return str(obj.content_object)
    get_content_object.short_description = 'Related Object'