from typing import Dict, Any, Literal
from langgraph.graph import StateGraph, START, END
from pydantic import BaseModel, Field
from langchain_anthropic import ChatAnthropic  # 이것을 사용해야 합니다
from langchain_core.messages import SystemMessage, HumanMessage
import random
from dotenv import load_dotenv  
import os
# .env 파일 로드
load_dotenv()
#그래프 상태 정의 
class EmotionBotState(BaseModel):
    user_message:str = Field(default ="", description="사용자가 입력한 메시지입니다.")
    emotion: str = Field(default="", description="사용자의 감정을 나타내는 문자열입니다. 예: '행복', '슬픔', '분노' 등")
    response: str = Field(default="", description="봇이 사용자에게 응답하는 메시지입니다.")


# Langchain LLM 초기화 - 감정 분석에 사용할 AI 모델 설정
llm = ChatAnthropic(
    model="claude-sonnet-4-20250514",
    temperature=0.7,
    max_retries=2,
    api_key=os.getenv("ANTHROPIC_API_KEY")
)

# LLM 기반 감정 분석 노드 - 첫 번째 처리 단계
def analyze_emotion(state: EmotionBotState) -> Dict[str, Any]:
    """사용자의 메시지를 분석하여 감정을 추출하는 함수입니다."""

    message = state.user_message
    print(f"LLM 감정 분석 중 : '{message}' ")

    messages = [
        SystemMessage(content="당신은 감정 분석을 전문으로 하는 AI입니다. " \
        "'positive','negative','neutral' 중 하나로 감정을 분류해주세요." \
        "답변은 반드시 하나의 단어만 출력하세요."),
        HumanMessage(content=f"다음 메시지의 감정을 분석해주세요.: '{message}'")
    ]

    response = llm.invoke(messages)
    emotion = response.content.strip().lower()

    # 유효성 검사
    if emotion not in ['positive', 'negative', 'neutral']:
        emotion = 'neutral'
    
    print(f"LLM 감정 분석 결과 : '{emotion}' \n")
    return {"emotion": emotion}

#  긍정적 응답 생성
def generate_positive_response(state: EmotionBotState) -> Dict[str, Any]:
    """긍정적인 감정에 대한 응답을 생성하는 함수입니다."""

    responses = [
        "좋은 소식이네요! 계속해서 좋은 하루 보내세요!",
        "행복한 기분이 느껴져요! 더 좋은 일이 있길 바랍니다.",
        "멋져요! 긍정적인 에너지가 가득하네요!"
    ]
    return {"response": random.choice(responses)}

#  부정적 응답 생성
def generate_negative_response(state: EmotionBotState) -> Dict[str, Any]:
    """부정적인 감정에 대한 응답을 생성하는 함수입니다."""
    responses = [
        "힘든 상황이시군요. 괜찮으신가요?",
        "어려운 일이 있으신 것 같아요. 도움이 필요하시면 말씀해주세요.",
        "안타까운 소식이네요. 힘내세요!"
    ]   
    return {"response": random.choice(responses)}

#  중립적 응답 생성
def generate_neutral_response(state: EmotionBotState) -> Dict[str, Any]:
    """중립적인 감정에 대한 응답을 생성하는 함수입니다."""
    responses = [
        "그렇군요. 더 이야기해보고 싶으신가요?",
        "알겠습니다. 다른 이야기도 나눠볼까요?",
        "네, 이해했습니다. 다른 주제로 이야기해볼까요?"
    ]
    return {"response": random.choice(responses)}








    return state


# 긍정적 응답 생성



# 부정적 응답 생성



# 중립적 응답 생성



# 조건부 라우팅 함수 - 감정 분석 결과에 따라 다음 노드 결정

