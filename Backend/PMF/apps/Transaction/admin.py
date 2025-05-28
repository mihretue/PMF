from django.contrib import admin
from .models import MoneyTransfer, ForeignCurrencyRequest, Wallet, TransactionLog

@admin.register(MoneyTransfer)
class MoneyTransferAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'recipient_name', 'amount', 'currency_type', 'status', 'created_at')
    list_filter = ('status', 'currency_type')
    search_fields = ('recipient_name', 'recipient_phone_number', 'recipient_bank_account')

@admin.register(ForeignCurrencyRequest)
class ForeignCurrencyRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'requester', 'amount_requested', 'currency_type', 'urgency_level', 'status', 'created_at')
    list_filter = ('status', 'currency_type', 'urgency_level')
    search_fields = ('requester__email', 'purpose')

@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ('id', 'owner', 'account_number', 'balance', 'currency')
    search_fields = ('account_number', 'owner__email')
    list_filter = ('currency',)

@admin.register(TransactionLog)
class TransactionLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'source_account', 'destination_account', 'amount', 'description', 'timestamp')
    search_fields = ('source_account', 'destination_account')
    list_filter = ('timestamp',)
