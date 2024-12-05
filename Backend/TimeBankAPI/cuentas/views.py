
from rest_framework import viewsets
from .models import Cuenta
from .serializers import CuentaSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

class CuentaViewSet(viewsets.ModelViewSet):
    queryset = Cuenta.objects.all()
    serializer_class = CuentaSerializer

class CuentaDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, cliente_id):
        try:
            cuenta = Cuenta.objects.get(cliente__id=cliente_id)
        except Cuenta.DoesNotExist:
            return Response({"error": "Cuenta no encontrada."}, status=status.HTTP_404_NOT_FOUND)

        if cuenta.cliente.user != request.user:
            return Response({"error": "No tienes permiso para acceder a esta cuenta."}, status=status.HTTP_403_FORBIDDEN)

        serializer = CuentaSerializer(cuenta)
        return Response(serializer.data)