from django.urls import path

from .views import CreateUserFolder, UserFoldersInfoView, ImageUploadView , FileUploadView, SearchFilesView, DeleteUserFileView, PortfolioByFolderView, PortfolioTotalView, UserPortfolioView

#from .views import make_folder_portfolio

from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    path('create', CreateUserFolder.as_view(), name='create-folder'),
    path('thumbnail-upload', ImageUploadView.as_view(), name='image-upload'),
    path('folder', UserFoldersInfoView.as_view(), name='folders-info'),

    path('upload', FileUploadView.as_view(), name='file-upload'),
    path('files', SearchFilesView.as_view(), name='search-files'),
    path('file-remove', DeleteUserFileView.as_view(), name='delete-user-file'),
    path('folder-portfolio', PortfolioByFolderView.as_view(), name='portfolio-by-folder'),
    path('make-portfolio', PortfolioTotalView.as_view(), name='portfolio-total'),
    path('total-portfolio', UserPortfolioView.as_view(), name='user-portfolio')

]



