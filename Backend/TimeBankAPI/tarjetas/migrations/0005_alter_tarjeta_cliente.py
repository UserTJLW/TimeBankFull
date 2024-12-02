# Generated by Django 5.1.3 on 2024-11-29 07:42

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clientes', '0004_alter_cliente_tipo_cliente'),
        ('tarjetas', '0004_alter_tarjeta_cliente'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tarjeta',
            name='cliente',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tarjetas', to='clientes.cliente'),
        ),
    ]
