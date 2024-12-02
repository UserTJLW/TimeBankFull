# admin.py
from django.contrib import admin
from .models import Tarjeta

# Registrar el modelo Tarjeta en el admin
class TarjetaAdmin(admin.ModelAdmin):
    list_display = ('numero', 'tipo', 'fecha_vencimiento', 'cliente')  # Mostrar campos importantes en el admin
    search_fields = ('numero', 'cliente__username')  # Permitir búsqueda por número de tarjeta y nombre de cliente

admin.site.register(Tarjeta, TarjetaAdmin)
