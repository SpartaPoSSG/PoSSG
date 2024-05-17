from django.shortcuts import render
import os
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate
import jwt
from django.conf import settings
from django.shortcuts import render, get_object_or_404
from common.models import User
import shutil

class CreateUserFolder(APIView):


    def post(self, request):
        
        # 토큰으로 로그인하는 과정
        # 헤더에서 JWT 토큰 추출
        token = request.headers.get('Authorization', None)
        if token is None:
            raise AuthenticationFailed('Authorization token not provided')

        # "Bearer " 부분을 제거하여 실제 토큰 값만 추출
        if not token.startswith('Bearer '):
            raise AuthenticationFailed('Invalid token format')
        token = token.split('Bearer ')[1]

        # 토큰 디코딩
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])

        # 페이로드에서 유저 ID 추출 및 유저 객체 조회
        user_id = payload.get('user_id')
        if not user_id:
            raise AuthenticationFailed('Token payload invalid')

        user = get_object_or_404(User, pk=user_id)
        
        
        
        # JSON 본문에서 데이터 추출
        sector = request.data.get('sector')
        title = request.data.get('title')
        new_title = request.data.get('new_title')  # 새로운 폴더 이름
        is_exist = request.data.get('is_Exist')

        # 유저 이름 가져오기
        user_name = user.nickname

        # 경로 생성
        base_path = '/home/honglee0317/possg/backend/folders'  # 이 부분은 실제 사용 경로에 맞게 변경하세요.
        current_path = os.path.join(base_path, user_name, sector, title)
        new_path = os.path.join(base_path, user_name, sector, new_title)  # 변경될 새로운 경로

        print(new_path)

        if is_exist == 0:
            # 폴더 생성
            if not os.path.exists(current_path):
                os.makedirs(current_path)
                return JsonResponse({"message": "Folder created"})
            else:
                return JsonResponse({"message": "Folder already exists"}, status=400)
            
        elif is_exist == 1:
            # 폴더 이름 변경
            if os.path.exists(current_path):
                os.rename(current_path, new_path)
                return JsonResponse({'success': f'Folder renamed from {title} to {new_title}'})
            else:
                return JsonResponse({'error': 'Original folder does not exist'}, status=404)
            
        elif is_exist == 2:
            # 폴더 삭제
            if os.path.exists(current_path):
                shutil.rmtree(current_path)
                return JsonResponse({"message": "Folder deleted"})
            else:
                return JsonResponse({"message": "Folder does not exist"}, status=404)
        else:
            return JsonResponse({"message": "Invalid is_Exist value"}, status=400)


        
class ImageUploadView(APIView):
    def post(self, request, *args, **kwargs):
        token = request.headers.get('Authorization').split()[1]
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        username = decoded['username']
        
        file = request.FILES['image']
        original_filename = file.name
        
        group_folder, image_filename = original_filename.split('/', 1)
        new_filename = f"thumbnail{os.path.splitext(file.name)[1]}"
        custom_path = os.path.join('/home/honglee0317/possg/backend/folders', username, group_folder, image_filename, new_filename)
        
        custom_storage = CustomFileSystemStorage()
        custom_storage.save(custom_path, file)
        
        image_instance = Image(image=custom_path)
        image_instance.save()

        return Response({"message": "Image uploaded successfully", "path": custom_path}, status=status.HTTP_201_CREATED)
    





from .utils import get_user_folders_info

class UserFoldersInfoView(APIView):
    def get(self, request, *args, **kwargs):
        token = request.headers.get('Authorization').split()[1]
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        username = decoded['username']
        
        base_path = settings.CUSTOM_MEDIA_ROOT
        folders_info = get_user_folders_info(base_path, username)
        
        return Response({"folders": folders_info}, status=status.HTTP_200_OK)
