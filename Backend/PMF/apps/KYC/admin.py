from django.contrib import admin
from .models import KYC

class KYCAdmin(admin.ModelAdmin):
    list_display = ('user', 'document_type', 'verification_status', 'created_at', 'updated_at')
    search_fields = ('user__email', 'document_type', 'verification_status')  # Enable search by email or document type
    list_filter = ('document_type', 'verification_status')  # Filter by document type and status
    readonly_fields = ('user', 'created_at', 'updated_at')  # Make 'user' and timestamps readonly
    fieldsets = (
        (None, {
            'fields': ('user', 'first_name', 'last_name', 'date_of_birth', 'document_type', 'document_front', 'document_back')
        }),
        ('Status', {
            'fields': ('verification_status',),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
        }),
    )

admin.site.register(KYC, KYCAdmin)
