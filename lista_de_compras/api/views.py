from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist

# 3rd Party imports
from rest_framework import generics
from rest_framework.response import Response

# Local imports
from .serializers import *
from .models import Producto


# Create your views here.
class ListaDeComprasView(generics.GenericAPIView):

    # Create - Agregar un producto a la lista
    def post(self, request, id):
        prod_serial = ProductoSerializer(data=request.data)
        
        if prod_serial.is_valid():
            prod_serial.save()
            msg = "Creacion exitosa"
            code = 200
            data = prod_serial.data
        else:
            msg = "Creacion fallida"
            code = 500
            data = prod_serial.errors

        return Response({"msg": msg, "data": data}, code)

    # Read - Obtener elementos de la lista
    def get(self, request, id):
        prods = Producto.objects.all()
        data = [ProductoSerializer(prod).data for prod in prods]
        return Response(data, 200)

    # Update - Modificar un elemento de la lista
    def patch(self, request, id):
        prod = Producto.objects.get(id=id)
        prod_serial = ProductoSerializer(prod, data=request.data, partial=True)

        if prod_serial.is_valid():
            prod_serial.save()
            msg = "Modificacion exitosa"
            code = 200
            data = prod_serial.data
        else:
            msg = "Modificacion fallida"
            code = 500
            data = prod_serial.errors

        return Response({"msg": msg, "data": data}, code)

    # Delete - Eliminar un elemento de la lista
    def delete(self, request, id):
        try:
            prod = Producto.objects.get(id=id)
            prod.delete()
            msg = "Eliminacion exitosa"
            code = 200
        
        except ObjectDoesNotExist as e:
            msg = "El producto no existe en la base de datos"
            code = 500
        
        finally:
            return Response({"msg": msg}, status=code)
