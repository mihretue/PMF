from django.urls import path
from . import views

urlpatterns = [
    path('', views.NotificationListView.as_view(), name='notification-list'),
    path('<int:pk>/read/', views.NotificationMarkReadView.as_view(), name='notification-mark-read'),
    path('<int:pk>/delete/', views.NotificationDeleteView.as_view(), name='notification-delete'),
]