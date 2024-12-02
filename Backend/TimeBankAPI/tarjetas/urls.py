from django.urls import path
from .views import TarjetaViewSet, agregar_tarjeta

urlpatterns = [
    path('tarjetas/', TarjetaViewSet.as_view({'get': 'list'}), name='lista_tarjetas'),  # Lista de tarjetas
    path('agregar-tarjeta/', agregar_tarjeta, name='agregar_tarjeta'),  # Agregar tarjeta
]
