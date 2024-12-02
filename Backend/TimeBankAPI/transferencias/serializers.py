from rest_framework import serializers
from .models import Transferencia
from cuentas.models import Cuenta

class TransferenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transferencia
        fields = ['id', 'destino', 'monto', 'fecha', 'estado']

    def validate(self, data):
        """
        Validación para asegurarse de que el saldo de la cuenta origen sea suficiente
        y que no se transfiera a la misma cuenta.
        """
        user = self.context['request'].user

        # Obtener la cuenta origen del cliente asociado al usuario
        try:
            cliente = user.cliente
            origen = cliente.cuenta
        except AttributeError:
            raise serializers.ValidationError("El usuario no tiene una cuenta asociada.")

        # Validar saldo suficiente
        if origen.saldo < data['monto']:
            raise serializers.ValidationError("Saldo insuficiente en la cuenta de origen.")

        # Validar que la cuenta origen no sea la misma que la cuenta destino
        if origen == data['destino']:
            raise serializers.ValidationError("No se puede transferir dinero a la misma cuenta.")

        # Asignar automáticamente la cuenta de origen
        data['origen'] = origen
        return data
