import anthropic
from fastapi import FastAPI, Form
from fastapi.responses import HTMLResponse
import uvicorn

from dotenv import load_dotenv
import os

# .env 파일 로드 
load_dotenv()

app = FastAPI()

# 모델 초기화
client = anthropic.Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY")
)

# 어린왕자 페르소나
LITTLE_PRINCE_PERSONA = """
당신은 생텍쥐페리의 '어린 왕자'입니다. 다음 특성을 따라주세요:
1. 순수한 관점으로 세상을 바라봅니다.
2. "어째서?"라는 질문을 자주 하며 호기심이 많습니다.
3. 철학적 통찰을 단순하게 표현합니다.
4. "어른들은 참 이상해요"라는 표현을 씁니다.
5. B-612 소행성에서 왔으며 장미와의 관계를 언급합니다.
6. 여우의 "길들임"과 "책임"에 대한 교훈을 중요시합니다.
7. "중요한 것은 눈에 보이지 않아"라는 문장을 사용합니다.
8. 공손하고 친절한 말투를 사용합니다. 
9. 비유와 은유로 복잡한 개념을 설명합니다.

항상 간결하게 답변하세요. 길어야 2-3문장으로 응답하고, 어린 왕자의 순수함과 지혜를 담아내세요. 
복잡한 주제도 본질적으로 단순화하여 설명하세요.
"""

# 대화 기록 저장
conversation_history = []


def chatbot_response():
    """Claude API를 사용하여 응답 생성"""
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system=LITTLE_PRINCE_PERSONA,
        messages=conversation_history
    )
    return response.content[0].text


@app.get("/", response_class=HTMLResponse)
async def read_root():
    chat_history = ""
    for msg in conversation_history:
        if msg["role"] == "user":
            chat_history += f"<p><b>당신:</b> {msg['content']}</p>"
        else:
            chat_history += f"<p><b>어린 왕자:</b> {msg['content']}</p>"

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>어린 왕자 챗봇</title>
        <meta charset="utf-8">
        <style>
            body {{
                font-family: 'Malgun Gothic', Arial, sans-serif;
                max-width: 800px;
                margin: 50px auto;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
            }}
            h1 {{
                color: white;
                text-align: center;
            }}
            .chat-container {{
                border: 1px solid #ddd;
                padding: 20px;
                margin: 20px 0;
                max-height: 400px;
                overflow-y: auto;
                background-color: white;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }}
            input[type="text"] {{
                width: 70%;
                padding: 10px;
                font-size: 16px;
                border: 2px solid #ddd;
                border-radius: 5px;
            }}
            button {{
                padding: 10px 20px;
                font-size: 16px;
                background-color: #4CAF50;
                color: white;
                border: none;
                cursor: pointer;
                border-radius: 5px;
                margin-left: 10px;
            }}
            button:hover {{
                background-color: #45a049;
            }}
            form {{
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }}
        </style>
    </head>
    <body>
        <h1>🌟 어린 왕자 챗봇 👑</h1>
        <div class="chat-container">
            {chat_history if chat_history else "<p><i>안녕하세요! B-612 소행성에서 온 어린 왕자입니다. 무엇이든 물어보세요!</i></p>"}
        </div>
        <form action="/chat" method="post">
            <input type="text" name="message" placeholder="메시지를 입력하세요..." required autofocus>
            <button type="submit">전송</button>
        </form>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)


@app.post("/chat", response_class=HTMLResponse)
async def chat(message: str = Form(...)):
    global conversation_history

    # 사용자 메시지 추가
    conversation_history.append({"role": "user", "content": message})

    # Claude 응답 받기
    assistant_response = chatbot_response()

    # 응답을 대화 기록에 추가
    conversation_history.append({"role": "assistant", "content": assistant_response})

    # 대화 기록이 너무 길어지면 최근 20개만 유지
    if len(conversation_history) > 20:
        conversation_history = conversation_history[-20:]

    return await read_root()


if __name__ == "__main__":
    uvicorn.run(
        app,  # ✅ 객체 직접 전달
        host="127.0.0.1", 
        port=8000
        # reload=True 제거
    )