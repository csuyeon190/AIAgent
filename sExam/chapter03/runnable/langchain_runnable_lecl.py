from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from langchain_anthropic import ChatAnthropic  # 이것을 사용해야 합니다
from dotenv import load_dotenv  
import os
# .env 파일 로드
load_dotenv()
# 모델 초기화 (API 키는 여기서만 전달)
# LangChain의 ChatAnthropic 사용
model = ChatAnthropic(
    model="claude-sonnet-4-20250514",
    api_key=os.getenv("ANTHROPIC_API_KEY")
)


prompt = ChatPromptTemplate.from_template(
    "주어지니 문구에 대하여 500자 이내의 짧은 시를 작성해주세요. : {word}"
)

parser = StrOutputParser()



chain = prompt | model | parser

#실행
result = chain.invoke({"word":"봄날의 햇살"})
print(result)