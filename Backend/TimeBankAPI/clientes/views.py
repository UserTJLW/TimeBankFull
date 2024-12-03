from django.forms import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status, viewsets, generics
from .models import Cliente
from rest_framework.generics import RetrieveAPIView
from rest_framework.exceptions import NotFound, PermissionDenied
from .serializers import ClienteSerializer, ClienteDetailSerializer
from cuentas.serializers import CuentaSerializer
from tarjetas.serializers import TarjetaSerializer
from datetime import datetime, timedelta
from django.db import transaction
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
import uuid
from tarjetas.models import Tarjeta
# Vista para login del cliente
class ClienteLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"error": "Por favor, proporciona username y password."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)  # Crea o obtiene el token
            return Response({
                "message": f"Bienvenido {user.username}, inicio de sesión exitoso.",
                "token": token.key  # Envía el token en la respuesta
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Credenciales inválidas, por favor revisa tu usuario y contraseña."}, status=status.HTTP_401_UNAUTHORIZED)

# Vista para obtener detalles del cliente autenticado
class ClienteLoggedInView(APIView):
    authentication_classes = [TokenAuthentication]  # Asegúrate de que la autenticación de token esté habilitada
    permission_classes = []  # No es necesario tener restricciones adicionales para esta vista en particular

    def get(self, request, *args, **kwargs):
        user = request.user
        if user.is_authenticated:
            print(f'Usuario autenticado: {user.username}')
            cliente = user.cliente
            return Response({
                "nombre": cliente.nombre,
                "apellido": cliente.apellido,
                "email": cliente.email,
                "telefono": cliente.telefono,
                "dni": cliente.dni,
                "tipo_cliente": cliente.tipo_cliente,
                "cuenta": cliente.cuenta.tipo,
                "saldo": cliente.cuenta.saldo,
                "cvu": cliente.cuenta.cvu
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "No estás autenticado."}, status=status.HTTP_401_UNAUTHORIZED)

# Vista para obtener detalles de un cliente en particular
class ClienteDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, cliente_id):
        try:
            cliente = Cliente.objects.get(id=cliente_id)
        except Cliente.DoesNotExist:
            raise NotFound(detail="Cliente no encontrado", code=404)

        if request.user.is_staff == 0:
            # Verificar que el cliente corresponde al usuario logueado
            if cliente.user != request.user:
                raise PermissionDenied("No tienes permiso para acceder a este cliente.")

        # Serializar y devolver los datos del cliente
        serializer = ClienteDetailSerializer(cliente)
        return Response(serializer.data)


class ClienteLogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        logout(request)  # Cierra la sesión del usuario
        return Response({
            "message": "Logout exitoso"
        }, status=status.HTTP_200_OK)
class ClienteRegisterView(APIView):
    permission_classes = [AllowAny]  # Permitir acceso sin autenticación

    def post(self, request):
        # Iniciar una transacción atómica
        try:
            with transaction.atomic():
                # Paso 1: Serializar el cliente
                cliente_serializer = ClienteSerializer(data=request.data)
                if cliente_serializer.is_valid():
                    # Crear el cliente y la cuenta
                    cliente = cliente_serializer.save()  # Guardamos el cliente
                    
                    # Si llegamos a este punto, se crea la cuenta automáticamente con el cliente
                    return Response({
                        'cliente': cliente_serializer.data,
                        'message': "Cliente creado exitosamente sin tarjeta asignada.",
                    }, status=status.HTTP_201_CREATED)
                else:
                    # Si el cliente no es válido, retornar errores de validación
                    return Response(cliente_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except ValidationError as e:
            # Capturamos y mostramos los errores de validación específicos de la cuenta
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Capturamos cualquier otro tipo de error
            return Response({"error": "Hubo un problema al crear la cuenta. Detalles: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Vista para gestionar la lista de clientes (Administrador solo puede ver todos)
class ClienteViewSet(viewsets.ModelViewSet):
    serializer_class = ClienteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Devuelve la lista de clientes según el tipo de usuario.
        Los administradores pueden ver todos los clientes, los demás solo su propio cliente.
        """
        user = self.request.user
        try:
            if user.cliente.tipo_cliente == "Admin":  # Solo los administradores pueden ver todos los clientes
                return Cliente.objects.all()
            else:
                return Cliente.objects.filter(user=user)  # Los demás usuarios solo pueden ver su propio cliente
        except Cliente.DoesNotExist:
            return Cliente.objects.none()  # Si no tiene un cliente asociado, no devuelve nada
