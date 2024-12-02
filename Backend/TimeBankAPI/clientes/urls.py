from django.urls import path, include
from rest_framework.routers import DefaultRouter
from clientes.views import ClienteViewSet, ClienteRegisterView, ClienteLoginView, ClienteLogoutView, ClienteDetailView,ClienteLoggedInView

# Configuración del router para el ViewSet
router = DefaultRouter()
router.register('clientes', ClienteViewSet, basename='cliente')

# Definición de rutas adicionales (fuera del ViewSet)
urlpatterns = [
    path("clientes/register/", ClienteRegisterView.as_view(), name="cliente-register"),
    path("clientes/login/", ClienteLoginView.as_view(), name="cliente-login"),
    path("clientes/logout/", ClienteLogoutView.as_view(), name="cliente-logout"),  # (opcional) Logout
    path("clientes/<int:cliente_id>/detalles/", ClienteDetailView.as_view(), name="cliente-detalles"),  # Ruta para detalles del cliente
    path('clientes/logged-in/', ClienteLoggedInView.as_view(), name='cliente_logged_in'),

    path("", include(router.urls)),  # Incluir las rutas del router
]
