from django.db import models
from cuentas.models import Cuenta

class Transferencia(models.Model):
    origen = models.ForeignKey(Cuenta, related_name='transferencias_origen', on_delete=models.CASCADE)
    destino = models.ForeignKey(Cuenta, related_name='transferencias_destino', on_delete=models.CASCADE)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=20, choices=[('pendiente', 'Pendiente'), ('completada', 'Completada')], default='pendiente')

    def __str__(self):
        return f"Transferencia de {self.monto} desde {self.origen} a {self.destino}"