from rest_framework import serializers
from tarjetas.models import Tarjeta

class TarjetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tarjeta
        fields = ['numero', 'tipo', 'fecha_vencimiento', 'cvv']
