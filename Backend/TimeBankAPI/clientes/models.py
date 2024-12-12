from django.db import models
from django.contrib.auth.models import User

class Cliente(models.Model):
    # Definimos las opciones para el campo tipo_cliente
    CLIENTE = 'Cliente'
    ADMIN = 'Admin'
    EMPLEADO = 'Empleado'

    TIPO_CLIENTE_CHOICES = [
        (CLIENTE, 'Cliente'),
        (ADMIN, 'Admin'),
        (EMPLEADO, 'Empleado'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)  # Relación uno a uno con el modelo User
    nombre = models.CharField(max_length=100, blank=True)  
    apellido = models.CharField(max_length=100, blank=True)
    dni = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)  # Usamos el email del usuario
    telefono = models.CharField(max_length=15, blank=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    direccion = models.CharField(max_length=255, blank=True)
    
    # Usamos las opciones definidas para el campo tipo_cliente
    tipo_cliente = models.CharField(
        max_length=10,
        choices=TIPO_CLIENTE_CHOICES,
        default=CLIENTE,  # Valor por defecto
    )

    def __str__(self):
        # Verifica si 'self.user' existe antes de acceder al atributo 'username'
        if self.user:
            return f"{self.nombre} {self.apellido} ({self.user.username})"
        return f"{self.nombre} {self.apellido} (Sin usuario)"
    
    class Meta: 
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'

