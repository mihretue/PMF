from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied

class IsAdmin(permissions.BasePermission):
    """Allows access only to Admin users."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_admin()

class IsSender(permissions.BasePermission):
    """Allows access only to Senders (Diaspora users who send money)."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_sender()

class IsReceiver(permissions.BasePermission):
    """Allows access only to Receivers (Ethiopian users who receive money)."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_receiver()

class IsAdminOrSender(permissions.BasePermission):
    """Allows access to Admins and Senders."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.is_admin() or request.user.is_sender())

class IsAdminOrReceiver(permissions.BasePermission):
    """Allows access to Admins and Receivers."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.is_admin() or request.user.is_receiver())
    
class IsSenderOrReceiver(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.is_sender() or request.user.is_receiver())
    
    
class IsVerifiedUser(permissions.BasePermission):
    """
    Allows access only to verified users.
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False  # DRF will handle unauthenticated separately

        if not request.user.is_kyc_verified:
            raise PermissionDenied(detail="Your KYC is not verified. Please verify your account to proceed.")
        
        return True
    
    
class IsActiveOrDeleting(permissions.BasePermission):
    def has_permission(self, request, view):
        # Allow if deleting account
        if isinstance(view, DeleteAccountView):
            return True
        # Or allow if user is authenticated and active
        return request.user.is_authenticated and request.user.is_active