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
from .models import Image  # Image 모델 임포트
from .serializers import *
from django.utils.text import slugify
import boto3
import urllib.parse
from pdf2image import convert_from_path
import sys
import os
import config
import PyPDF2


sys.path.append('/home/honglee0317/possg/backend/possg')
import tp



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
        
        print(user.nickname, request.data)
        
        # JSON 본문에서 데이터 추출
        sector = request.data.get('sector')
        title = request.data.get('title')
        new_title = request.data.get('new_title')  # 새로운 폴더 이름
        is_exist = request.data.get('is_Exist')
        user_name = user.nickname
        
        
        # 이 부분을 media 폴더 내부로 수정하면 됨
        base_path = settings.CUSTOM_ROOT
        current_path = os.path.join(base_path, user_name, sector, title)
        new_path = os.path.join(base_path, user_name, sector, new_title)

        if is_exist == 0:
            # 폴더 생성
            if not os.path.exists(current_path):
                os.makedirs(current_path)
                return JsonResponse({"message": "Folder created"})
            else:
                print("folder exist")
                return JsonResponse({"message": "Folder already exists"}, status=400)
        elif is_exist == 1:
            # 폴더 이름 변경
            if os.path.exists(current_path):
                if os.path.exists(new_path):
                    return JsonResponse({'message': 'same'})
                else:
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




def upload_to_aws(file_obj, bucket, s3_file_name):
    session = boto3.Session(
        aws_access_key_id='AKIA6ODU6XD4OCV4IJAU',
        aws_secret_access_key='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',
        region_name='us-east-2'
    )
    s3 = session.client('s3')

    try:
        s3.upload_fileobj(file_obj, bucket, s3_file_name)
        url = f"https://{bucket}.s3.{s3.meta.region_name}.amazonaws.com/{s3_file_name}"
        return url
    except NoCredentialsError:
        print("Credentials not available")
        return None

class ImageUploadView(APIView):
    def post(self, request, *args, **kwargs):
        token = request.headers.get('Authorization').split()[1]
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = payload.get('user_id')
        if not user_id:
            raise AuthenticationFailed('Token payload invalid')

        user = get_object_or_404(User, pk=user_id)
        user_name = user.nickname
        
        sector = request.data.get('sector')
        folder_name = request.data.get('folderName')
        file = request.FILES['file']

        if not sector or not folder_name or not file:
            return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)
        
        #new_filename = f"thumbnail_{user_name}_{sector}_{folder_name}{os.path.splitext(file.name)[1]}"
        new_filename = "thumbnail.jpg"
        s3_file_path = os.path.join("user_uploads", user_name, sector, folder_name, new_filename)

        # Upload to S3
        s3_url = upload_to_aws(file, 'possg', s3_file_path)
        print("url:", s3_url)

        if not s3_url:
            return Response({"error": "File upload failed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Create an instance of the Image model and save it
        image_instance = Image(image=s3_url)
        image_instance.save()
        

        return Response({"message": "Upload success", "url": s3_url}, status=status.HTTP_201_CREATED)


'''
class ImageUploadView(APIView):
    def post(self, request, *args, **kwargs):
        token = request.headers.get('Authorization').split()[1]
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = payload.get('user_id')
        if not user_id:
            raise AuthenticationFailed('Token payload invalid')

        user = get_object_or_404(User, pk=user_id)
        user_name = user.nickname
        
        sector = request.data.get('sector')
        folder_name = request.data.get('folderName')
        file = request.FILES['file']

        if not sector or not folder_name or not file:
            return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)
        
        new_filename = f"thumbnail_{user_name}_{sector}_{folder_name}_{os.path.splitext(file.name)[1]}"
        custom_path = os.path.join(settings.MEDIA_ROOT, new_filename)
        
        # Save the file
        custom_storage = default_storage
        custom_storage.save(custom_path, file)

        # Create an instance of the Image model and save it
        image_instance = Image(image=custom_path)
        image_instance.save()

        return Response({"message": "Upload success", "path": custom_path}, status=status.HTTP_201_CREATED)
'''


class UserFoldersInfoView(APIView):
    def get(self, request, *args, **kwargs):
        token = request.headers.get('Authorization').split()[1]
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = payload.get('user_id')
        if not user_id:
            raise AuthenticationFailed('Token payload invalid')

        user = get_object_or_404(User, pk=user_id)
        user_name = user.nickname
        
        bucket_name = 'possg'
        folders_info = get_user_folders_info(bucket_name, user_name)
        
        print("folders:", folders_info)
        
        return Response({"folders": folders_info}, status=status.HTTP_200_OK)

'''
class UserFoldersInfoView(APIView):
    def get(self, request, *args, **kwargs):
        token = request.headers.get('Authorization').split()[1]
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = payload.get('user_id')
        if not user_id:
            raise AuthenticationFailed('Token payload invalid')

        user = get_object_or_404(User, pk=user_id)
        user_name = user.nickname
        
        base_path = settings.CUSTOM_ROOT
        folders_info = get_user_folders_info(base_path, user_name)
        
        return Response({"folders": folders_info}, status=status.HTTP_200_OK)
'''


'''
class FileUploadView(APIView):
    def post(self, request, *args, **kwargs):
        # Authorization 헤더 유효성 검사
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            raise AuthenticationFailed('Authorization header missing or invalid')

        token = auth_header.split()[1]

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token')

        user_id = payload.get('user_id')
        if not user_id:
            raise AuthenticationFailed('Token payload invalid')

        user = get_object_or_404(User, pk=user_id)
        user_name = slugify(user.nickname)

        # 요청 데이터 확인
        serializer = MultiFileUploadSerializer(data=request.data)
        if serializer.is_valid():
            sector = serializer.validated_data['sector']
            title = serializer.validated_data['title']
            files = serializer.validated_data['files']
            response_files = []

            for file in files:
                upload_serializer = FileUploadSerializer(data={
                    'sector': sector,
                    'title': title,
                    'file': file
                })
                if upload_serializer.is_valid():
                    instance = upload_serializer.save()
                    # 파일 경로 설정
                    new_path = os.path.join(settings.MEDIA_ROOT, user_name, sector, title, os.path.basename(instance.file.name))
                    os.makedirs(os.path.dirname(new_path), exist_ok=True)
                    os.rename(instance.file.path, new_path)
                    instance.file.name = os.path.join(user_name, sector, title, os.path.basename(instance.file.name))
                    instance.save()

                    response_files.append({
                        "file": instance.file.url,
                        "src": instance.file.url
                    })
                else:
                    return Response(upload_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            return Response({
                "sector": sector,
                "title": title,
                "files": response_files
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
'''
class FileUploadView(APIView):
    def post(self, request, *args, **kwargs):
        # Authorization 헤더 유효성 검사
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            raise AuthenticationFailed('Authorization header missing or invalid')

        token = auth_header.split()[1]

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token')

        user_id = payload.get('user_id')
        if not user_id:
            raise AuthenticationFailed('Token payload invalid')

        user = get_object_or_404(User, pk=user_id)
        user_name = slugify(user.nickname)

        # 요청 데이터 확인
        serializer = MultiFileUploadSerializer(data=request.data)
        if serializer.is_valid():
            sector = serializer.validated_data['sector']
            title = serializer.validated_data['title']
            files = serializer.validated_data['files']
            response_files = []

            for file in files:
                upload_serializer = FileUploadSerializer(data={
                    'sector': sector,
                    'title': title,
                    'file': file
                })
                if upload_serializer.is_valid():
                    instance = upload_serializer.save()
                    # 파일 경로 설정
                    new_path = os.path.join(settings.MEDIA_ROOT, user_name, sector, title, os.path.basename(instance.file.name))
                    os.makedirs(os.path.dirname(new_path), exist_ok=True)
                    os.rename(instance.file.path, new_path)
                    instance.file.name = os.path.join(user_name, sector, title, os.path.basename(instance.file.name))
                    instance.save()

                    response_files.append({
                        "file": instance.file.url,
                        "src": instance.file.url
                    })
                else:
                    return Response(upload_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # 포트폴리오 생성 및 업데이트
            portfolio_folder = os.path.join(settings.MEDIA_ROOT, user_name, sector, title)
            portfolio_path = os.path.join(settings.MEDIA_ROOT, 'folders', 'portfolio')
            os.makedirs(portfolio_path, exist_ok=True)
            portfolio_filename = f"{user_name}_{sector}_{title}.pdf"
            portfolio_filepath = os.path.join(portfolio_path, portfolio_filename)

            merge_pdfs_from_folder(portfolio_folder, portfolio_filepath)

            # 포트폴리오 모델 업데이트
            portfolio_data = {
                "user": user.id,
                "sector": sector,
                "title": title,
                "summary": f"Portfolio for {sector} - {title}",
                "pdf_file": os.path.join('portfolios', portfolio_filename)
            }
            portfolio_instance, created = Portfolio.objects.update_or_create(
                user=user, sector=sector, title=title,
                defaults=portfolio_data
            )

            return Response({
                "sector": sector,
                "title": title,
                "files": response_files
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class SearchFilesView(APIView):

    def post(self, request, *args, **kwargs):
        # 토큰 검증
        token = request.headers.get('Authorization').split()[1]
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = payload.get('user_id')
        if not user_id:
            raise AuthenticationFailed('Token payload invalid')

        user = get_object_or_404(User, pk=user_id)
        user_name = user.nickname

        # 요청 데이터 추출
        sector = request.data.get('sector')
        title = request.data.get('title')

        base_path = os.path.join(settings.MEDIA_ROOT, user_name, sector, title)
        portfolio_path = os.path.join(settings.MEDIA_ROOT, 'portfolio')
        response_files = []

        if os.path.exists(base_path):
            for root, dirs, files in os.walk(base_path):
                for file in files:
                    file_path = os.path.join(root, file).split('folders/')[1]
                    base_url = "http://35.192.203.252:8000/media/"
                    file_url = base_url + file_path
                    src_url = file_url

                    # PDF 파일 처리
                    if file.lower().endswith('.pdf'):
                        try:
                            temp_path = os.path.join(root, file)
                            temp_path.replace('.PDF', '.pdf')
                            new_path = temp_path
                            os.rename(temp_path, new_path)
                            # 첫 페이지를 이미지로 변환
                            images = convert_from_path(new_path, first_page=1, last_page=1)
                            if images:
                                # 이미지 저장 경로 설정
                                pdf_image_path = "/home/honglee0317/possg/backend/media/folders/pdf_thumbnails"
                                image_path = os.path.join(pdf_image_path, file).replace('.pdf', '.png')
                                images[0].save(image_path, 'PNG')
                                # 이미지 URL 설정
                                src_url = base_url + image_path.split('folders/')[1]
                                print("src_url:", src_url)
                        except Exception as e:
                            print(f"Error converting PDF to image: {e}")

                    response_files.append({
                        "file": file_url,
                        "src": src_url
                    })

            # 포트폴리오 파일 찾기
            portfolio_filename = f"{user_name}_{sector}_{title}.pdf"
            portfolio_filepath = os.path.join(portfolio_path, portfolio_filename)
            print("filepath:", portfolio_filepath)
            if os.path.exists(portfolio_filepath):
                portfolio_summary = "포트폴리오 내용 요약"
                return Response({
                    "sector": sector,
                    "title": title,
                    "files": response_files,
                    "folder_portfolio": portfolio_summary
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "sector": sector,
                    "title": title,
                    "files": response_files,
                    "folder_portfolio": ''
                }, status=status.HTTP_200_OK)
        else:
            return Response({
                "sector": sector,
                "title": title,
                "files": [],
                "folder_portfolio": ''
            }, status=status.HTTP_200_OK)
            
'''
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
'''


class DeleteUserFileView(APIView):
    def post(self, request):
        print("delete request:", request.data)
        
        
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
        
        print(user.nickname, request.data)
        
        # JSON 본문에서 데이터 추출
        sector = request.data.get('sector')
        title = request.data.get('title')
        file_name = request.data.get('file_name')
        user_name = user.nickname
        
        # 파일 경로 설정
        base_path = settings.MEDIA_ROOT
        file_path = os.path.join(base_path, user_name, sector, title, file_name)

        # 파일 삭제
        if os.path.exists(file_path):
            os.remove(file_path)
            return JsonResponse({"message": "File deleted"})
        else:
            return JsonResponse({"message": "File does not exist"}, status=404)
        
        
class PortfolioByFolderView(APIView):

    def post(self, request, *args, **kwargs):
        
        print("portfolios")
        # 토큰으로 로그인하는 과정
        token = request.headers.get('Authorization', None)
        if token is None:
            raise AuthenticationFailed('Authorization token not provided')

        if not token.startswith('Bearer '):
            raise AuthenticationFailed('Invalid token format')
        token = token.split('Bearer ')[1]

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token')

        user_id = payload.get('user_id')
        if not user_id:
            raise AuthenticationFailed('Token payload invalid')

        user = get_object_or_404(User, pk=user_id)
        user_name = user.nickname

        # JSON 본문에서 데이터 추출
        sector = request.data.get('sector')
        title = request.data.get('title')


        folder_paths = os.path.join("/home/honglee0317/possg/backend/media/folders", user_name, sector, title)
        summary = tp.summary(folder_paths)
        
        # 파일 경로 설정
        portfolio_folder = os.path.join(settings.MEDIA_ROOT, 'folders', 'portfolio')
        portfolio_filename = f"{user_name}_{sector}_{title}.pdf"
        portfolio_filepath = os.path.join(portfolio_folder, portfolio_filename)

        if os.path.exists(portfolio_filepath):
            return Response({
                             "summary": summary
                             }, status=status.HTTP_200_OK)
        else:
            return Response({
                "error": "Portfolio file not found"
            }, status=status.HTTP_404_NOT_FOUND)
        

            
            
class PortfolioTotalView(APIView):
    def get(self, request, *args, **kwargs):
        # 토큰으로 로그인하는 과정
        token = request.headers.get('Authorization', None)
        if token is None:
            raise AuthenticationFailed('Authorization token not provided')

        if not token.startswith('Bearer '):
            raise AuthenticationFailed('Invalid token format')
        token = token.split('Bearer ')[1]

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token')

        user_id = payload.get('user_id')
        if not user_id:
            raise AuthenticationFailed('Token payload invalid')

        user = get_object_or_404(User, pk=user_id)
        user_name = user.nickname

        # 포트폴리오 파일 경로 설정
        portfolio_folder = os.path.join(settings.MEDIA_ROOT, 'folders', 'portfolio', user_name)
        os.makedirs(portfolio_folder, exist_ok=True)  # 폴더가 없는 경우 생성
        portfolio_filename = f"{user_name}_total.pdf"
        portfolio_filepath = os.path.join(portfolio_folder, portfolio_filename)

        # 포트폴리오 파일이 존재하지 않는 경우 병합하여 생성
        if not os.path.exists(portfolio_filepath):
            merge_pdfs_from_folder(portfolio_folder, portfolio_filepath)

        # 병합된 포트폴리오 파일 반환
        if os.path.exists(portfolio_filepath):
            return FileResponse(open(portfolio_filepath, 'rb'), content_type='application/pdf')
        else:
            return Response({
                "error": "Portfolio file not found"
            }, status=status.HTTP_404_NOT_FOUND)

def merge_pdfs_from_folder(folder_path, output_path):
    # PdfMerger 객체 생성
    merger = PyPDF2.PdfMerger()
    
    # 폴더 내의 모든 파일을 확인
    for item in os.listdir(folder_path):
        item_path = os.path.join(folder_path, item)
        if os.path.isfile(item_path) and item.lower().endswith('.pdf'):
            merger.append(item_path)
    
    # 병합된 PDF를 출력 경로에 저장
    merger.write(output_path)
    merger.close()
