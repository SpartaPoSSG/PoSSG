from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
import os
import shutil
import jwt
import json
from datetime import datetime
from django.conf import settings
from common.models import User
from .utils import get_user_folders_info

class CreateUserFolder(APIView):
    def post(self, request):
        # 토큰으로 로그인하는 과정
        token = request.headers.get('Authorization', None)
        if token is None:
            raise AuthenticationFailed('Authorization token not provided')

        if not token.startswith('Bearer '):
            raise AuthenticationFailed('Invalid token format')
        token = token.split('Bearer ')[1]

        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = payload.get('user_id')
        if not user_id:
            raise AuthenticationFailed('Token payload invalid')

        user = get_object_or_404(User, pk=user_id)
        
        # JSON 본문에서 데이터 추출
        sector = request.data.get('sector')
        title = request.data.get('title')
        new_title = request.data.get('new_title')  # 새로운 폴더 이름
        is_exist = request.data.get('is_Exist')
        user_name = user.nickname
        
        base_path = settings.CUSTOM_MEDIA_ROOT
        current_path = os.path.join(base_path, user_name, sector, title)
        new_path = os.path.join(base_path, user_name, sector, new_title)

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
        custom_path = os.path.join(settings.CUSTOM_MEDIA_ROOT, username, group_folder, image_filename, new_filename)
        
        custom_storage = default_storage
        custom_storage.save(custom_path, file)
        
        # Assuming you have an Image model
        image_instance = Image(image=custom_path)
        image_instance.save()

        return Response({"message": "Image uploaded successfully", "path": custom_path}, status=status.HTTP_201_CREATED)

class UserFoldersInfoView(APIView):
    def get(self, request, *args, **kwargs):
        token = request.headers.get('Authorization').split()[1]
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        username = decoded['username']
        
        base_path = settings.CUSTOM_MEDIA_ROOT
        folders_info = get_user_folders_info(base_path, username)
        
        return Response({"folders": folders_info}, status=status.HTTP_200_OK)

class FolderView(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        
        # JSON 데이터 구조화
        structured_data = {}
        for item in data:
            sector = item.get('sector')
            if sector not in structured_data:
                structured_data[sector] = []
            structured_data[sector].append({
                'title': item.get('title'),
                'src': item.get('src')
            })

        # JSON 데이터를 문자열로 변환
        json_data = json.dumps(structured_data, ensure_ascii=False)
        
        # S3에 업로드
        file_name = f'folder_{datetime.now().strftime("%Y%m%d%H%M%S")}.json'
        file_content = ContentFile(json_data)
        
        file_path = default_storage.save(file_name, file_content)
        file_url = default_storage.url(file_path)
        
        return Response({'url': file_url}, status=status.HTTP_201_CREATED)
