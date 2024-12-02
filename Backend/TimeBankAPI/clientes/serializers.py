from rest_framework import serializers
from clientes.models import Cliente
from django.contrib.auth.models import User
from cuentas.models import Cuenta
from cuentas.serializers import CuentaSerializer
from tarjetas.serializers import TarjetaSerializer

from rest_framework import serializers
from clientes.models import Cliente
from django.contrib.auth.models import User
from cuentas.models import Cuenta
from tarjetas.models import Tarjeta
from cuentas.serializers import CuentaSerializer
from tarjetas.serializers import TarjetaSerializer
import uuid

class ClienteSerializer(serializers.ModelSerializer):
    # El campo 'username' debe obtenerse desde la relación 'user'
    username = serializers.CharField(source='user.username', required=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Cliente
        fields = ['nombre', 'apellido', 'dni', 'email', 'telefono', 'fecha_nacimiento', 'tipo_cliente', 'username', 'password']

    def create(self, validated_data):
        # Se obtiene el campo 'user' que es un objeto de User
        user_data = validated_data.pop('user', {})

        # Crear el usuario
        user = User.objects.create_user(
            username=user_data.get('username'),
            password=validated_data['password'],
            email=validated_data.get('email', '')  # Si no se proporciona un email, lo dejamos vacío
        )

        # Crear el cliente
        cliente = Cliente.objects.create(
            user=user,
            nombre=validated_data['nombre'],
            apellido=validated_data['apellido'],
            dni=validated_data['dni'],
            telefono=validated_data.get('telefono', ''),
            fecha_nacimiento=validated_data.get('fecha_nacimiento', None),
            tipo_cliente=validated_data['tipo_cliente'],
            email=validated_data.get('email', '')  # Guardar el email en el modelo Cliente
        )

        # Crear la cuenta asociada al cliente
        cuenta = Cuenta.objects.create(cliente=cliente)  # Crear cuenta con saldo y tipo por defecto

        return cliente

class ClienteDetailSerializer(serializers.ModelSerializer):
    tarjetas = TarjetaSerializer(many=True, read_only=True)
    cuenta = CuentaSerializer(many=False, read_only=True)

    class Meta:
        model = Cliente
        fields = ['id', 'nombre', 'email', 'tarjetas', 'cuenta']
