from django.db import models
from clientes.models import Cliente
import uuid  # Para generar CVU único

class Cuenta(models.Model):
    TIPO_CUENTA_CHOICES = [
        ('BLACK', 'Black'),
        ('GOLD', 'Gold'),
        ('SILVER', 'Silver'),
        ('CLASSIC', 'Classic'),
    ]
    cliente = models.OneToOneField(Cliente, on_delete=models.CASCADE)  # Relación uno a uno con Cliente
    saldo = models.DecimalField(max_digits=12, decimal_places=2, default=10000.00)  # Saldo inicial predeterminado
    cvu = models.CharField(max_length=22, unique=True, default=None)  # CVU único, generado automáticamente
    tipo = models.CharField(max_length=10, choices=TIPO_CUENTA_CHOICES, default='GOLD')  # Tipo de cuenta predeterminado

    def save(self, *args, **kwargs):
        if not self.cvu:
            self.cvu = str(uuid.uuid4().int)[:22]
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Cuenta {self.cvu} - {self.tipo}"