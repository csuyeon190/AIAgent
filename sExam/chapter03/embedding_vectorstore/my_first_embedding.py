from langchain_openai import OpenAIEmbeddings
import numpy as np
from langchain_huggingface import HuggingFaceEmbeddings

from dotenv import load_dotenv  
import os

from openai import api_key  # ✅ 추가
# .env 파일 로드
load_dotenv()
# 모델 초기화 (API 키는 여기서만 전달)

# 임베딩 모델 초기화
embedding = HuggingFaceEmbeddings(
    #model_name="jhgan/ko-sroberta-multitask",  # 한국어 특화
    model_name="sentence-transformers/xlm-r-100langs-bert-base-nli-stsb-mean-tokens",
    model_kwargs={'device': 'cpu'},
    encode_kwargs={'normalize_embeddings': True}
)

# 언어 모델 불러오기 - anthropic으로 연결
from langchain_anthropic import ChatAnthropic  # 이것을 사용해야 합니다
model = ChatAnthropic(
    model="claude-sonnet-4-20250514",
    temperature=0.7,
    max_retries=2,
    api_key=os.getenv("ANTHROPIC_API_KEY") 
)

# 단어들을 임베딩으로 변환
words = ["강아지", "고양이", "자동차", "분노", "사랑"]
word_embeddings = embedding.embed_documents(words)

#쿼리 임베딩 생성
query = "동물"
query_embedding = embedding.embed_query(query)

##코사인 유사도 계산 함수
def cosine_similarity(vec1, vec2):
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2) +1e-9)


#각 단어와 쿼리의 유사도 계산
print(f"쿼리: '{query}'")
for word, word_emb in zip(words, word_embeddings):
    similarity = cosine_similarity(query_embedding, word_emb)
    print(f"'{word}'와의 유사도: {similarity:.4f}")




