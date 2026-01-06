from langchain_core.runnables import RunnablePassthrough, RunnableParallel
from langchain_core.prompts import ChatPromptTemplate

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
    "주어진 '{word}'와 유사한 단어 3가지를 나열해주세요. 단어만 나열합니다."
)



parser = StrOutputParser()


#병렬 처리 체인 구성
chain = RunnableParallel(
    {
        "original": RunnablePassthrough(),
        "processed": prompt | model | parser,
    }
)


result = chain.invoke({"word": "행복"})

print(result)