from django.urls import path
from .views import CreateUserFolder

urlpatterns = [
    path('create', CreateUserFolder.as_view(), name='create-folder'),
]
