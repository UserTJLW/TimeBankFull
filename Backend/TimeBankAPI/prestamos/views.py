from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
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
        response = super().create(request, *args, **kwargs)
        
        # Agregar el ID del préstamo a la respuesta
        prestamo_id = response.data.get('id')
        return Response({
            "message": "Préstamo aprobado exitosamente.",
            "prestamo_id": prestamo_id,
            "prestamo": response.data
        }, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_loan(request, loan_id):
    user = request.user

    # Verificar que el usuario sea un empleado
    if not user.cliente.tipo_cliente == 'Empleado':
        return Response({'error': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        loan = Prestamo.objects.get(id=loan_id)
    except Prestamo.DoesNotExist:
        return Response({'error': 'Préstamo no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    if loan.estado == 'aprobado':
        loan.estado = 'rechazado'
        loan.save()

        # Aquí puedes agregar lógica para revertir el monto correspondiente

        return Response({'message': 'Préstamo cancelado'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Préstamo ya cancelado o no aprobado'}, status=status.HTTP_400_BAD_REQUEST)
