import anthropic
from dotenv import load_dotenv  
import os

# .env 파일 로드
load_dotenv()

# 모델 초기화 (API 키는 여기서만 전달)
client = anthropic.Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY")
)

# 대화 기록을 저장할 리스트
conversation = []

# 사용자 입력 추가 
conversation.append({"role": "user", "content": "안녕 나는 연우야"})

# Claude 호출 (api_key 파라미터 제거)
response = client.messages.create(
    model="claude-opus-4-20250514",
    max_tokens=1000,
    messages=conversation
)

# 응답 출력 및 대화 기록에 추가
assistant_message = response.content[0].text
print(assistant_message)
conversation.append({"role": "assistant", "content": assistant_message})  # 수정: 실제로 추가

# 다음 사용자 입력
conversation.append({"role": "user", "content": "내 이름이 뭐라구?"})

# 다시 클로드 호출 
response = client.messages.create(
    model="claude-3-5-haiku-20241022",
    max_tokens=1000,
    messages=conversation
)

# 두번째 응답 출력
print(response.content[0].text)