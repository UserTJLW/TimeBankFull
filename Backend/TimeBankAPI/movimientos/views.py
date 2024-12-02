from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import TransferenciaSerializer, PrestamoSerializer
from cuentas.models import Cuenta
from clientes.models import Cliente
from transferencias.models import Transferencia
from prestamos.models import Prestamo

class MovimientoViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """
        Devuelve los préstamos y transferencias del cliente logueado.
        """
        # Obtener al cliente logueado
        try:
            cliente = Cliente.objects.get(user=request.user)
        except Cliente.DoesNotExist:
            return Response({"error": "Cliente no encontrado."}, status=404)

        # Obtener la cuenta asociada al cliente
        try:
            cuenta = Cuenta.objects.get(cliente=cliente)
        except Cuenta.DoesNotExist:
            return Response({"error": "Cuenta no encontrada."}, status=404)

        # Obtener las transferencias enviadas y recibidas
        transferencias_recibidas = Transferencia.objects.filter(destino=cuenta)
        transferencias_enviadas = Transferencia.objects.filter(origen=cuenta)

        # Obtener los préstamos asociados a la cuenta
        prestamos = Prestamo.objects.filter(cuenta=cuenta)

        # Serializar los datos
        transferencias_recibidas_serializer = TransferenciaSerializer(transferencias_recibidas, many=True)
        transferencias_enviadas_serializer = TransferenciaSerializer(transferencias_enviadas, many=True)
        prestamos_serializer = PrestamoSerializer(prestamos, many=True)

        # Devolver los resultados
        return Response({
            "transferencias_recibidas": transferencias_recibidas_serializer.data,
            "transferencias_enviadas": transferencias_enviadas_serializer.data,
            "prestamos": prestamos_serializer.data
        })
