from django.urls import path
from .views import list_branches

urlpatterns = [
    path('', list_branches, name='list_branches'),
]