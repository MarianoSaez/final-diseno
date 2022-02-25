from django.db import models

# Create your models here.
class Producto(models.Model):
    producto = models.CharField(max_length=200)
    cantidad = models.IntegerField()
    tipo_tienda = models.CharField(max_length=200)
