from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CuentaViewSet

router = DefaultRouter()
router.register(r'cuentas', CuentaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
