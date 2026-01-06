import anthropic
import rich
from dotenv import load_dotenv
import os
# .env 파일 로드 
load_dotenv()


# 모델 초기화 (API키는 여기서만 전달)
client = anthropic.Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY")
)

prompt = "anthropic 발음은 앤트로픽이 맞나요? 앤스로픽이 맞나요??"


## 컨텍스트 메니저를 사용한 스트리밍 세션 생성 
with client.messages.stream(
    max_tokens=1024,
    messages=[{"role":"user","content":prompt}],
    model="claude-3-5-haiku-20241022"
) as stream:
    for event in stream:
        if event.type == "text":
            print(event.text, end="")
    print("____________________")

    ##최종 응답 출력
    rich.print(stream.get_final_message())
    print("****************")

