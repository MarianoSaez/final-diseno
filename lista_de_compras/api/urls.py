from django.urls import path
from .views import *

urlpatterns = [
    path('<int:id>', ListaDeComprasView.as_view()),
]