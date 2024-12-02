# Generated by Django 5.1.3 on 2024-11-29 02:59

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('clientes', '0002_alter_cliente_options'),
    ]

    operations = [
        migrations.CreateModel(
            name='Cuenta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('saldo', models.DecimalField(decimal_places=2, default=10000.0, max_digits=12)),
                ('cvu', models.CharField(default=None, max_length=22, unique=True)),
                ('tipo', models.CharField(choices=[('BLACK', 'Black'), ('GOLD', 'Gold'), ('SILVER', 'Silver'), ('CLASSIC', 'Classic')], default='GOLD', max_length=10)),
                ('cliente', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='clientes.cliente')),
            ],
        ),
    ]