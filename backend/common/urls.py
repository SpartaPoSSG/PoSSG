from django.urls import path, include
from .views import RegisterAPIView, AuthAPIView 
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from .views import *
from rest_framework import routers


app_name = 'common'

router = routers.DefaultRouter()
router.register('list', UserViewSet) # 유저리스트 (테스트용)

urlpatterns = [
    path("signup", RegisterAPIView.as_view()), # post - 회원가입
    path("login", AuthAPIView.as_view()),
    path('member', UserDetailView.as_view(), name='token_obtain_pair'),
    path("login/refresh", TokenRefreshView.as_view()), # jwt 토큰 재발급
    path('check-email', EmailCheckView.as_view(), name='check-email'),
    path('list', UserListView.as_view(), name='user-list'),
    path('logout', LogoutView.as_view(), name='logout'),
    path("", include(router.urls)),
    
]


