
from rest_framework import serializers
from .models import Cuenta

class CuentaSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True) 
    cliente_apellido = serializers.CharField(source='cliente.apellido', read_only=True)
    class Meta:
        model = Cuenta
        fields = ['id', 'cliente', 'saldo', 'cvu', 'tipo','cliente_nombre','cliente_apellido']



class CuentaDestinoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cuenta
        fields = ['numero', 'titular']  # Ajusta los campos que deseas mostrar
