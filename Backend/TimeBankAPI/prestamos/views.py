from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
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

class PrestamoCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PrestamoSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            prestamo = serializer.save()
            return Response({
                "message": "Préstamo aprobado exitosamente.",
                "prestamo": serializer.data
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_loan(request, loan_id):
    if not request.user.cliente.tipo_cliente == 'Empleado':
        return Response({'error': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        loan = Prestamo.objects.get(id=loan_id)
    except Prestamo.DoesNotExist:
        return Response({'error': 'Prestamo no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    if loan.estado == 'aprobado':
        loan.estado = 'rechazado'
        loan.save()
       
        return Response({'message': 'Prestamo cancelado'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Prestamo ya cancelado o no aprovado'}, status=status.HTTP_400_BAD_REQUEST)