# api/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'products', views.ProductViewSet)
router.register(r'orders', views.OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', views.register_user, name='register'),
    path('auth/login/', views.login_user, name='login'),
    path('auth/logout/', views.logout_user, name='logout'),
    path('auth/user/', views.current_user, name='current-user'),
]

# api/urls.py - Add payment URLs

# urlpatterns += [
#     # MBank payment endpoints
#     path('payments/mbank/create/', views.create_mbank_payment, name='create-mbank-payment'),
#     path('payments/mbank/status/', views.check_payment_status, name='check-mbank-payment'),
#     path('payments/mbank-callback/', views.mbank_callback, name='mbank-callback'),
# ]