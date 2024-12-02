# admin.py
from django.contrib import admin
from .models import Cuenta


# Registrar el modelo Cuenta en el admin
class CuentaAdmin(admin.ModelAdmin):
    list_display = ('cvu', 'tipo', 'saldo', 'cliente')  # Mostrar campos importantes en el admin
    search_fields = ('cvu', 'cliente__username')  # Permitir búsqueda por CVU y nombre de cliente

admin.site.register(Cuenta, CuentaAdmin)
