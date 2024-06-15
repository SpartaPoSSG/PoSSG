from django.urls import path
from .views import CreateUserFolder, UserFoldersInfoView, ImageUploadView
from .views import make_folder_portfolio
from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    path('create', CreateUserFolder.as_view(), name='create-folder'),
    path('thumbnail-upload', ImageUploadView.as_view(), name='image-upload'),
    path('folder', UserFoldersInfoView.as_view(), name='folders-info'),
    #포트폴리오
    path('api/portfolio/make-folder-portfolio', make_folder_portfolio),
]



