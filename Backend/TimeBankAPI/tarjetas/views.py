from rest_framework import status
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import Tarjeta
from .serializers import TarjetaSerializer
from clientes.models import Cliente

# Vista ViewSet para Tarjetas
class TarjetaViewSet(viewsets.ModelViewSet):
    serializer_class = TarjetaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user  # Obtener el usuario autenticado
        
        # Verifica si el usuario tiene un cliente asociado
        if not hasattr(user, 'cliente'):
            return Tarjeta.objects.none()  # Si no tiene cliente, devuelve un queryset vacío
        
        cliente = user.cliente  # Obtener el cliente relacionado con el usuario
        return Tarjeta.objects.filter(cliente=cliente)  # Filtra las tarjetas del cliente

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def agregar_tarjeta(request):
    # Obtener el cliente logeado
    cliente = Cliente.objects.get(user=request.user)

    # Verificar que la solicitud contenga los datos requeridos para crear una tarjeta
    serializer = TarjetaSerializer(data=request.data)
    if serializer.is_valid():
        # Asignamos el cliente logeado a la tarjeta
        tarjeta = serializer.save(cliente=cliente)
        return Response(TarjetaSerializer(tarjeta).data, status=status.HTTP_201_CREATED)

    # Si la validación del serializer falla, devolvemos los errores
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)