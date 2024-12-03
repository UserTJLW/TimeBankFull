from rest_framework import serializers
from .models import Prestamo
from cuentas.models import Cuenta

class PrestamoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prestamo
        fields = ['id', 'tipo_prestamo', 'monto', 'fecha_inicio', 'estado','cuenta']

    def validate(self, data):
        """
        Validar si el monto solicitado es permitido según el tipo de cuenta.
        """
        user = self.context['request'].user

        # Verificar la cuenta asociada
        try:
            cuenta = user.cliente.cuenta
        except AttributeError:
            raise serializers.ValidationError("El usuario no tiene una cuenta asociada.")

        # Limitar el monto según el tipo de cuenta
        limites = {
            'BLACK': 500000,
            'GOLD': 300000,
            'CLASSIC': 100000,
        }
        limite = limites.get(cuenta.tipo, 0)
        if data['monto'] > limite:
            raise serializers.ValidationError(f"El monto solicitado excede el límite permitido para cuentas {cuenta.tipo} (${limite}).")

        # Asignar la cuenta automáticamente
        data['cuenta'] = cuenta
        return data

    def create(self, validated_data):
        """
        Crear el préstamo, actualizar saldo y registrar el estado.
        """
        cuenta = validated_data['cuenta']
        monto = validated_data['monto']

        # Aprobar automáticamente si hay saldo suficiente
        if cuenta.saldo >= monto:
            validated_data['estado'] = 'aprobado'
            cuenta.saldo += monto  # Actualizar saldo
            cuenta.save()
        else:
            validated_data['estado'] = 'rechazado'

        # Registrar el préstamo
        return super().create(validated_data)
