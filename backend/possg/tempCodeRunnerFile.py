import os
import base64
import anthropic

def encode_image_to_base64(file_path):
    with open(file_path, 'rb') as file:
        encoded_string = base64.b64encode(file.read()).decode('utf-8')
    return encoded_string

def generate_portfolio_from_folder(folder_path, api_key, prompt):
    try:
        files = os.listdir(folder_path)
        
        encoded_images = []
        for file_name in files:
            file_path = os.path.join(folder_path, file_name)
            if os.path.isfile(file_path) and file_name.lower().endswith(('.png', '.jpg', '.jpeg')):
                encoded_string = encode_image_to_base64(file_path)
                encoded_images.append({
                    "data": encoded_string,
                    "media_type": "image/jpeg" if file_name.lower().endswith('.jpg') or file_name.lower().endswith('.jpeg') else "image/png"
                })
        
        client = anthropic.Client(api_key=api_key)
        
        # 메시지 배열 생성
        conversation = [{"role": "user", "content": prompt}]
        for idx, encoded_image in enumerate(encoded_images):
            image_message = {
                "role": "user",
                "content": f"data:image/{'jpeg' if encoded_image['media_type'] == 'image/jpeg' else 'png'};base64,{encoded_image['data']}"
            }
            assistant_message = {
                "role": "assistant",
                "content": "이미지를 확인했습니다."
            }
            conversation.append(image_message)
            conversation.append(assistant_message)
        
        # Claude API에 메시지 배열 전달
        response = client.completions.create(
            model="claude-3",
            max_tokens_to_sample=1024,
            prompt=conversation   # 대화 형식 메시지 전달
        )
        
        return response['completion']
    except Exception as e:
        raise e

# 예제 사용법
folder_path = r"C:\Users\LG\OneDrive\문서\카카오톡 받은 파일\portfotest"
api_key = "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"  # 실제 API 키로 변경하세요
prompt = """이미지와 문서를 바탕으로 다음과 같은 프로젝트 개요를 작성해주세요:
1. 프로젝트 개요: [프로젝트 개요를 작성해주세요]
2. AS-IS → TO-BE (신규 프로젝트가 아닐 경우): [변경된 점을 설명해주세요]
3. 담당 역할 및 성과: [본인의 담당 역할과 성과를 간략히 설명해주세요]
4. 참가 인원: [프로젝트에 참가한 인원 수를 기입해주세요]
5. 기타 설명: [추가로 작성할 내용이 있다면 이곳에 작성해주세요]
알 수 없는 부분은 빈칸으로 비워주세요.
"""

portfolio_data = generate_portfolio_from_folder(folder_path, api_key, prompt)
print(portfolio_data)
