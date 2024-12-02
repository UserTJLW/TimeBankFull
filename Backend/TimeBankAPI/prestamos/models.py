from django.db import models
from cuentas.models import Cuenta

class Prestamo(models.Model):
    TIPO_PRESTAMO_CHOICES = [
        ('PERSONAL', 'Personal'),
        ('HIPOTECARIO', 'Hipotecario'),
        ('AUTOMOTOR', 'Automotor'),
    ]
    cuenta = models.ForeignKey(Cuenta, on_delete=models.CASCADE, related_name='prestamos')
    tipo_prestamo = models.CharField(max_length=20, choices=TIPO_PRESTAMO_CHOICES, default='Personal')
    monto = models.DecimalField(max_digits=12, decimal_places=2)
    fecha_inicio = models.DateField()
    estado = models.CharField(max_length=20, choices=[('aprobado', 'Aprobado'), ('rechazado', 'Rechazado')], default='pendiente')

    def __str__(self):
        return f"Préstamo {self.tipo_prestamo} - {self.monto} ({self.estado})"
