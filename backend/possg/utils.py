import os
import boto3
from botocore.exceptions import NoCredentialsError
from django.conf import settings
import urllib.parse
import unicodedata

'''
def get_user_folders_info(base_path, username):
    user_folder_path = os.path.join(base_path, username)
    
    folders_info = []

    if not os.path.exists(user_folder_path):
        return folders_info

    for group_name in os.listdir(user_folder_path):
        group_path = os.path.join(user_folder_path, group_name)
        if os.path.isdir(group_path):
            for folder_name in os.listdir(group_path):
                folder_path = os.path.join(group_path, folder_name)
                if os.path.isdir(folder_path):
                    thumbnail_path = os.path.join(folder_path, 'thumbnail.jpg')
                    if os.path.exists(thumbnail_path):
                        thumbnail_url = os.path.join(settings.MEDIA_URL, username, group_name, folder_name, 'thumbnail.jpg')
                    else:
                        thumbnail_url = ""

                    folders_info.append({
                        "sector": group_name,
                        "title": folder_name,
                        "src": thumbnail_url
                    })
    
    return folders_info
'''

def get_s3_client():
    s3 = boto3.client('s3',
                      aws_access_key_id='AKIA6ODU6XD4OCV4IJAU',
                    aws_secret_access_key='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',
                    region_name='us-east-2'
                      )
    return s3



def get_user_folders_info(bucket_name, username):
    s3 = get_s3_client()
    user_folder_path = os.path.join(settings.CUSTOM_ROOT, username)
    
    folders_info = []

    if not os.path.exists(user_folder_path):
        return folders_info

    for group_name in os.listdir(user_folder_path):
        
        group_path = os.path.join(user_folder_path, group_name)
        if os.path.isdir(group_path):
            group_info = {"name": group_name, "folders": []}
            for folder_name in os.listdir(group_path):
                folder_path = os.path.join(group_path, folder_name)
                if os.path.isdir(folder_path):
                    thumbnail_key = f"user_uploads/{username}/{group_name}/{folder_name}/thumbnail.jpg"
                    print("key:", thumbnail_key)
                    try:
                        s3.head_object(Bucket=bucket_name, Key=thumbnail_key)
                        thumbnail_url = f"https://{bucket_name}.s3.{s3.meta.region_name}.amazonaws.com/{thumbnail_key}"
                        print(thumbnail_url)
                    except:
                        thumbnail_url = ""
                    
                    if thumbnail_url == "":
                        thumbnail_url = " http://35.192.203.252:8000/media/thumbnails/"+ unicodedata.normalize('NFD', group_name) +"/thumbnail_default.png"
                    group_info["folders"].append({
                        "title": folder_name,
                        "src": thumbnail_url
                    })
            folders_info.append(group_info)

    return folders_info