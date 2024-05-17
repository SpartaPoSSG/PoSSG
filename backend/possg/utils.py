import os

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
                        thumbnail_url = os.path.join(settings.MEDIA_URL, 'folders', username, group_name, folder_name, 'thumbnail.jpg')
                        folders_info.append({
                            'sector': group_name,
                            'title': folder_name,
                            'src': thumbnail_url
                        })
    
    return folders_info
