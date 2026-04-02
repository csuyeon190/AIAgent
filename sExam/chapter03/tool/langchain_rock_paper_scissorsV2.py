#도구 생성
#도구 연결
#도구 호출
import random
from langchain.tools import tool
from langchain_anthropic import ChatAnthropic
from dotenv import load_dotenv



@tool
def rock_paper_scissors() -> str:
    """가위, 바위, 보 중 하나를 무작위로 선택하여 반환하는 도구입니다."""
    return random.choice(["가위", "바위", "보"])


#Tool 바인딩된 LLM 
llm = ChatAnthropic(
    model="claude-sonnet-4-20250514",
    api_key=os.getenv("ANTHROPIC_API_KEY")
).bind_tools([rock_paper_scissors])




