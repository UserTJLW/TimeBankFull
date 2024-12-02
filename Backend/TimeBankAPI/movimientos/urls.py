from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MovimientoViewSet

router = DefaultRouter()
router.register(r'movimientos', MovimientoViewSet, basename='movimiento')

urlpatterns = [
    path('', include(router.urls)),
]
