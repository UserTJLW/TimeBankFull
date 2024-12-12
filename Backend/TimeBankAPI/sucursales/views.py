from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Sucursal
from .serializers import SucursalSerializer

@api_view(['GET'])
def list_branches(request):
    branches = Sucursal.objects.all()
    serializer = SucursalSerializer(branches, many=True)
    return Response(serializer.data)
