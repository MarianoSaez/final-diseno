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
    serializer_class = ProductoSerializer

    # Create - Agregar un producto a la lista
    def post(self, request, id):
        prod_serial = ProductoSerializer(data=request.data)
        
        valid = prod_serial.is_valid()
        
        if valid:
            prod_serial.save()

        response = response_log("Creacion", valid, prod_serial.data, prod_serial.errors)

        return Response(*response)

    # Read - Obtener elementos de la lista
    def get(self, request, id):
        if id == 0:
            prods = Producto.objects.all()
            data = [ProductoSerializer(prod).data for prod in prods]
        else:
            prod = Producto.objects.get(id=id)
            data = ProductoSerializer(prod).data
        return Response(data, 200)

    # Update - Modificar un elemento de la lista
    def patch(self, request, id):
        prod = Producto.objects.get(id=id)
        prod_serial = ProductoSerializer(prod, data=request.data, partial=True)

        valid = prod_serial.is_valid()
        
        if valid:
            prod_serial.save()

        response = response_log("Modificacion", valid, prod_serial.data, prod_serial.errors)

        return Response(*response)

    # Delete - Eliminar un elemento de la lista
    def delete(self, request, id):
        try:
            prod = Producto.objects.get(id=id)
            prod.delete()
            deletion = True
        
        except ObjectDoesNotExist as e:
            deletion = False
        
        finally:
            response = response_log("Eliminacion", deletion, err=e.__dict__)
            return Response(*response)


def response_log(action: str, success: bool = True,
                 data: dict | list = None, err: dict = None) -> tuple:
    """
    Funcion auxiliar. Encargada de generar los parametros de informacion enviados
    en el Response HTTP.
    """
    if success:
        code = 200
        msg = "realizado con exito."
    else:
        code = 500
        msg = "ha fracasado."
    response = {
        "msg": f"{action} {msg}",
        "code": code,
        "data": data,
    }
    return response, code