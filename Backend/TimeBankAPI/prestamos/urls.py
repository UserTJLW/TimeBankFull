from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import PrestamoViewSet, cancel_loan

router = DefaultRouter()
router.register(r'prestamos', PrestamoViewSet, basename='prestamo')

urlpatterns = router.urls + [
    path('cancel-loan/<int:loan_id>/', cancel_loan, name='cancel_loan'),
]

urlpatterns = router.urls
