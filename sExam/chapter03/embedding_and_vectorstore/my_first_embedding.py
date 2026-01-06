## 인간의 언어를 컴퓨터가 이해할 수 있는 숫자의 배열로 바꾸는 것 : 임베딩
## 텍스트(단어, 문장, 문서)를 고차원의 숫자 벡터로 변환하는 것
## 벡터 스토어 : 임베딩을 효율적으로 저장하고 검색하는 데이터베이스
## 임베딩과 벡터 스토어를 활용하여 의미 기반 검색을 할 수 있게 된다. 

from langchain_openai import OpenAIEmbeddings
import numpy as np
from dotenv import load_dotenv
import os

# .env 파일 로드
load_dotenv()


## 모델 초기화(API 키는 여기서만 전달)

##임베딩 모델 초기화
embeddings = OpenAIEmbeddings(
    model = "text-embedding-3-large",
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

## 단어들을 임베딩으로 변환
words = ["강아지","고양이","자동차","비행기"]
word_embeddings = embeddings.embed_documents(words)


## 쿼리 임베딩 생성
query = "동물"
query_embedding = embeddings.embed_query(query)

## 코사인 유사도 계산 함수 
def cosine_similarity(vec1, vec2):
    """두 벡터 간의 코사인 유사도를 계산합니다. """
    dot_product = np.dot(vec1,  vec2)
    norm_vec1 = np.linalg.norm(vec1)
    norm_vec2 = np.linalg.norm(vec2)

    return dot_product /(norm_vec1 * norm_vec2 + 1e-9)



print(f" '{query}'에 대한 유사도 : ")
for word, embedding in zip(words, word_embeddings):
    similarity = cosine_similarity(query_embedding, embedding)
    print(f" {word}: {similarity :3f}")