from langchain_core.runnables import RunnableBranch, RunnableParallel
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


parser = StrOutputParser()

 
prompt = ChatPromptTemplate.from_template(
    "주어진 '{word}'와 유사한 단어 3가지를 나열해주세요. 단어만 나열합니다."
)


##모든 문자가 ASCII범위 (128미만)에 있으면 영어로 간주
def is_english(x: dict) ->bool:
    """입력 딕셔너리의 'word'키에 해당하는 값이 영어인지 확인합니다. """

    return all(ord(char) < 128 for char in x["word"])
##영어 단어에 대한 프롬프트 템플릿입니다. 
english_prompt = ChatPromptTemplate.from_template(
    "Give me 3 synonyms for {word}. Only list the words"
)



##한국어 단어에 대한 프롬프트 템플릿입니다. 
korean_prompt = ChatPromptTemplate.from_template(
    "주어진 '{word}'와 유사한 단어 3가지를 나열해주세요. 단어만 나열합니다."
)

##조건부 분기를 정의합니다.
# is_english 함수가 True를 반환하면 english_prompt를, 그렇지 않으면 korean_prompt를 사용합니다.
language_aware_chain = RunnableBranch(
    (is_english, english_prompt | model | parser),
    korean_prompt | model | parser
)

##영어 단어 예시
english_word = {"word": "happy"}
english_result = language_aware_chain.invoke(english_word)
print(f"Synonyms for '{english_word['word']}' : \n{english_result} \n")


##한국어 단어 예시
korean_word = {"word":"행복"}
korean_result = language_aware_chain.invoke(korean_word)
print(f" '{korean_word['word']}' 의 동의어 : \n {korean_result} \n")