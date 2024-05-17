from django.urls import path
from .views import CreateUserFolder, UserFoldersInfoView, ImageUploadView 
from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    path('create', CreateUserFolder.as_view(), name='create-folder'),
    path('thumbnail-upload', ImageUploadView.as_view(), name='image-upload'),
    path('folder', UserFoldersInfoView.as_view(), name='folders-info'),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)