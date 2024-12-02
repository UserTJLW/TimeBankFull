from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Prestamo
from .serializers import PrestamoSerializer

class PrestamoViewSet(viewsets.ModelViewSet):
    queryset = Prestamo.objects.all()
    serializer_class = PrestamoSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        """
        Sobrescribir el método create para manejar validaciones adicionales.
        """
        user = request.user

        try:
            cuenta = user.cliente.cuenta
        except AttributeError:
            return Response({"detail": "El usuario no tiene una cuenta asociada."}, status=status.HTTP_400_BAD_REQUEST)

        monto_solicitado = request.data.get('monto')
        
        try:
            monto_solicitado = float(monto_solicitado)  # Convertir el monto a float
        except ValueError:
            return Response({"detail": "El monto solicitado no es válido."}, status=status.HTTP_400_BAD_REQUEST)

        limites = {
            'BLACK': 500000,
            'GOLD': 300000,
            'CLASSIC': 100000,
        }
        limite = limites.get(cuenta.tipo, 0)
        
        if monto_solicitado > limite:
            return Response(
                {"detail": f"El monto solicitado excede el límite permitido para cuentas {cuenta.tipo} (${limite})."},
                status=status.HTTP_400_BAD_REQUEST
            )


        request.data['cuenta'] = cuenta.id

        return super().create(request, *args, **kwargs)
