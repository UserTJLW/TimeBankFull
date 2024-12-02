from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from .models import Transferencia
from .serializers import TransferenciaSerializer
from cuentas.models import Cuenta

class TransferenciaViewSet(viewsets.ModelViewSet):
    queryset = Transferencia.objects.all()
    serializer_class = TransferenciaSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        """
        Asigna automáticamente la cuenta origen asociada al usuario logueado.
        """
        user = self.request.user

        # Verificar que el usuario tiene un cliente asociado y buscar su cuenta
        try:
            cliente = user.cliente  # Relación User -> Cliente
            origen = cliente.cuenta  # Relación Cliente -> Cuenta
        except AttributeError:
            raise ValidationError("El usuario no tiene una cuenta asociada.")

        # Asignar automáticamente la cuenta origen y guardar la transferencia
        serializer.save(origen=origen)
        
        # Restar el monto de la cuenta origen
        origen.saldo -= serializer.validated_data['monto']
        origen.save()

        # Sumar el monto a la cuenta destino
        destino = serializer.validated_data['destino']
        destino.saldo += serializer.validated_data['monto']
        destino.save()
