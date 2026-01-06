from langchain_anthropic import ChatAnthropic
from langchain.chat_models import init_chat_model

from langchain_core.messages import SystemMessage, HumanMessage, AIMessage


from dotenv import load_dotenv
import os

load_dotenv()
#llm
chat_model = ChatAnthropic(
    model = "claude-sonnet-4-20250514",
    temperature=0.7,
    max_tokens = 4096,
    api_key = os.getenv("ANTHROPIC_API_KEY")
)

messages = [
    SystemMessage(content = "당신은 사용자의 질문에 간결하고 명확하게 답변하는 AI도우미 입니다."),
    HumanMessage(content="LangChain에 대해 설명해주세요."),
    AIMessage(content="LangChain은 대규모 언어 모델(LLM)을 활용하여 애플리케이션을 구축하기 위한 프레임워크입니다."),
    HumanMessage(content = "주요 기능 세 가지만 알려주세요.")
]


result = chat_model.invoke(messages)
print("AI의 응답 :" , result.content)



