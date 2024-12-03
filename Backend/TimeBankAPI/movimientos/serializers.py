# movimientos/serializers.py
from rest_framework import serializers
from transferencias.models import Transferencia
from prestamos.models import Prestamo


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

        return obj.destino.cliente.nombre  
    def get_origen_nombre(self, obj):
        """
        Obtener el nombre del cliente asociado a la cuenta de origen.
        """
       
        return obj.origen.cliente.nombre 


class PrestamoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prestamo
        fields = ['id', 'cuenta', 'monto', 'tipo_prestamo', 'fecha_inicio', 'estado']
