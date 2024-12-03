# movimientos/serializers.py
from rest_framework import serializers
from transferencias.models import Transferencia
from prestamos.models import Prestamo
from cuentas.models import Cuenta

class TransferenciaSerializer(serializers.ModelSerializer):
    destino_nombre = serializers.SerializerMethodField()
    origen_nombre = serializers.SerializerMethodField()

    class Meta:
        model = Transferencia
        fields = ['id', 'origen', 'destino','origen_nombre', 'destino_nombre', 'monto', 'fecha', 'estado']

    def get_destino_nombre(self, obj):
        """
        Obtener el nombre del cliente asociado a la cuenta de destino.
        """
        # Se asume que 'destino' es una instancia de Cuenta, y 'cliente' es una relación
        return obj.destino.cliente.nombre  # Asegúrate de que 'cliente' tenga un campo 'nombre'
    def get_origen_nombre(self, obj):
        """
        Obtener el nombre del cliente asociado a la cuenta de origen.
        """
        # Se asume que 'destino' es una instancia de Cuenta, y 'cliente' es una relación
        return obj.origen.cliente.nombre  # Asegúrate de que 'cliente' tenga un campo 'nombre'


class PrestamoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prestamo
        fields = ['id', 'cuenta', 'monto', 'tipo_prestamo', 'fecha_inicio', 'estado']
