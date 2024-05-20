import os

def get_user_folders_info(base_path, username):
    user_folder_path = os.path.join(base_path, username)
    
    print(user_folder_path)
    
    folders_info = []

    if not os.path.exists(user_folder_path):
        return folders_info


    for group_name in os.listdir(user_folder_path):
        folder_dict = {'sector':"", 'title':"", 'src':""}
        group_path = os.path.join(user_folder_path, group_name)
        folder_dict['sector'] = group_name
        if os.path.isdir(group_path):
            for folder_name in os.listdir(group_path):
                folder_dict['title'] = folder_name
                folder_path = os.path.join(group_path, folder_name)
                if os.path.isdir(folder_path):
                    thumbnail_path = os.path.join(folder_path, 'thumbnail.jpg')
                    if os.path.exists(thumbnail_path):
                        thumbnail_url = os.path.join(settings.MEDIA_URL, 'folders', username, group_name, folder_name, 'thumbnail.jpg')
                        folder_dict['src'] = thumbnail_url
                        
                folders_info.append({
                    folder_dict
                })
    
    
    return folders_info
