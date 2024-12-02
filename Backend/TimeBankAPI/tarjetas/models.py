from django.db import models
from django.contrib.auth.models import User
from clientes.models import Cliente
import uuid

class Tarjeta(models.Model):
    TIPO_CHOICES = [
        ('DEBITO', 'Débito'),
        ('CREDITO', 'Crédito'),
    ]
    
    numero = models.CharField(max_length=16, unique=True)
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES, default='DEBITO')
    fecha_vencimiento = models.DateField()
    cliente = models.ForeignKey(Cliente, related_name='tarjetas', on_delete=models.CASCADE)
    cvv = models.CharField(max_length=3)

    def save(self, *args, **kwargs):
        if not self.numero:
            self.numero = self.generar_numero_tarjeta_unico()  # Generación única del número de tarjeta
        if not self.cvv:
            self.cvv = self.generar_cvv_unico()  # Generación única del CVV
        super().save(*args, **kwargs)

    def generar_numero_tarjeta_unico(self):
        """
        Genera un número de tarjeta único asegurándose de que no exista en la base de datos.
        """
        while True:
            numero_tarjeta = str(uuid.uuid4().int)[:16]  # Genera un número único de 16 dígitos
            if not Tarjeta.objects.filter(numero=numero_tarjeta).exists():
                break  # Si el número no existe, salimos del bucle
        return numero_tarjeta

    def generar_cvv_unico(self):

        while True:
            cvv = str(uuid.uuid4().int)[:3]  # Generar un CVV único de 3 dígitos
            if not Tarjeta.objects.filter(cvv=cvv).exists():
                break  # Si no existe, salimos del bucle
        return cvv


    def __str__(self):
        return f"Tarjeta {self.numero} ({self.tipo})"
