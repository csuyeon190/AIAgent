import anthropic
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, StreamingResponse
import uvicorn
import json

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


async def chatbot_stream_response():
    """Claude API를 사용하여 스트리밍 응답 생성"""
    full_response = ""
    
    # 스트리밍으로 응답 받기
    with client.messages.stream(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system=LITTLE_PRINCE_PERSONA,
        messages=conversation_history
    ) as stream:
        for text in stream.text_stream:
            full_response += text
            # SSE 형식으로 데이터 전송
            yield f"data: {json.dumps({'text': text})}\n\n"
    
    # 완료 신호 전송
    yield f"data: {json.dumps({'done': True, 'full_text': full_response})}\n\n"
    
    # 대화 기록에 추가
    conversation_history.append({"role": "assistant", "content": full_response})


@app.get("/", response_class=HTMLResponse)
async def read_root():
    chat_history = ""
    for msg in conversation_history:
        if msg["role"] == "user":
            chat_history += f'<div class="message user-message"><b>당신:</b> {msg["content"]}</div>'
        else:
            chat_history += f'<div class="message assistant-message"><b>어린 왕자:</b> {msg["content"]}</div>'

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
            .message {{
                margin: 10px 0;
                padding: 10px;
                border-radius: 5px;
            }}
            .user-message {{
                background-color: #e3f2fd;
                text-align: right;
            }}
            .assistant-message {{
                background-color: #f5f5f5;
            }}
            #streaming-message {{
                background-color: #fff9c4;
                padding: 10px;
                border-radius: 5px;
                margin: 10px 0;
                display: none;
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
            button:disabled {{
                background-color: #cccccc;
                cursor: not-allowed;
            }}
            form {{
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }}
            .loading {{
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 3px solid #f3f3f3;
                border-top: 3px solid #4CAF50;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }}
            @keyframes spin {{
                0% {{ transform: rotate(0deg); }}
                100% {{ transform: rotate(360deg); }}
            }}
        </style>
    </head>
    <body>
        <h1>🌟 어린 왕자 챗봇 👑</h1>
        <div class="chat-container" id="chatContainer">
            {chat_history if chat_history else '<div class="message assistant-message"><i>안녕하세요! B-612 소행성에서 온 어린 왕자입니다. 무엇이든 물어보세요!</i></div>'}
            <div id="streaming-message"></div>
        </div>
        <form id="chatForm">
            <input type="text" id="messageInput" name="message" placeholder="메시지를 입력하세요..." required autofocus>
            <button type="submit" id="submitBtn">전송</button>
        </form>

        <script>
            const chatForm = document.getElementById('chatForm');
            const messageInput = document.getElementById('messageInput');
            const submitBtn = document.getElementById('submitBtn');
            const chatContainer = document.getElementById('chatContainer');
            const streamingMessage = document.getElementById('streaming-message');

            chatForm.addEventListener('submit', async (e) => {{
                e.preventDefault();
                
                const message = messageInput.value.trim();
                if (!message) return;

                // 사용자 메시지 표시
                const userDiv = document.createElement('div');
                userDiv.className = 'message user-message';
                userDiv.innerHTML = `<b>당신:</b> ${{message}}`;
                chatContainer.insertBefore(userDiv, streamingMessage);

                // 입력 필드 초기화 및 버튼 비활성화
                messageInput.value = '';
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="loading"></span> 답변 중...';

                // 스트리밍 메시지 영역 표시
                streamingMessage.style.display = 'block';
                streamingMessage.innerHTML = '<b>어린 왕자:</b> ';

                try {{
                    // SSE로 스트리밍 응답 받기
                    const response = await fetch('/stream', {{
                        method: 'POST',
                        headers: {{
                            'Content-Type': 'application/json',
                        }},
                        body: JSON.stringify({{ message: message }})
                    }});

                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();
                    let fullText = '';

                    while (true) {{
                        const {{ value, done }} = await reader.read();
                        if (done) break;

                        const chunk = decoder.decode(value);
                        const lines = chunk.split('\\n');

                        for (const line of lines) {{
                            if (line.startsWith('data: ')) {{
                                const data = JSON.parse(line.slice(6));
                                
                                if (data.text) {{
                                    fullText += data.text;
                                    streamingMessage.innerHTML = '<b>어린 왕자:</b> ' + fullText;
                                    chatContainer.scrollTop = chatContainer.scrollHeight;
                                }}
                                
                                if (data.done) {{
                                    // 스트리밍 완료 - 페이지 새로고침
                                    setTimeout(() => {{
                                        window.location.reload();
                                    }}, 500);
                                }}
                            }}
                        }}
                    }}
                }} catch (error) {{
                    console.error('Error:', error);
                    streamingMessage.innerHTML = '<b>오류:</b> 응답을 받는 중 문제가 발생했습니다.';
                }} finally {{
                    submitBtn.disabled = false;
                    submitBtn.textContent = '전송';
                }}
            }});

            // 자동 스크롤
            chatContainer.scrollTop = chatContainer.scrollHeight;
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)


@app.post("/stream")
async def stream_chat(request: Request):
    """스트리밍 채팅 엔드포인트"""
    global conversation_history
    
    body = await request.json()
    message = body.get("message", "")
    
    # 사용자 메시지 추가
    conversation_history.append({"role": "user", "content": message})
    
    # 대화 기록이 너무 길어지면 최근 20개만 유지
    if len(conversation_history) > 20:
        conversation_history = conversation_history[-20:]
    
    # 스트리밍 응답 반환
    return StreamingResponse(
        chatbot_stream_response(),
        media_type="text/event-stream"
    )


if __name__ == "__main__":
    uvicorn.run(
        app,
        host="127.0.0.1", 
        port=8000
    )