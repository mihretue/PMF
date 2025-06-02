from rest_framework import permissions

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