from django.db import models
from .storage import CustomFileSystemStorage

class Image(models.Model):
    image = models.ImageField(upload_to='', storage=CustomFileSystemStorage())
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.image.name
