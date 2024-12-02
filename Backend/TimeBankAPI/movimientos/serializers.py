# movimientos/serializers.py
from rest_framework import serializers
from prestamos.models import Prestamo
from transferencias.models import Transferencia

class TransferenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transferencia
        fields = ['id', 'origen', 'destino', 'monto', 'fecha', 'estado']

class PrestamoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prestamo
        fields = ['id', 'cliente', 'monto', 'tipo', 'fecha_inicio', 'fecha_vencimiento', 'aprobado']
