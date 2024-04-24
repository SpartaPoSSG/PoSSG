from django.urls import path, include
from .views import RegisterAPIView, AuthAPIView 
from rest_framework_simplejwt.views import TokenRefreshView
from .views import *
from rest_framework import routers

app_name = 'common'

router = routers.DefaultRouter()
router.register('list', UserViewSet) # 유저리스트 (테스트용)

urlpatterns = [
    path("signup/", RegisterAPIView.as_view()), # post - 회원가입
    path("login/", AuthAPIView.as_view()),
    path("login/refresh/", TokenRefreshView.as_view()), # jwt 토큰 재발급
    path("", include(router.urls)),
]


