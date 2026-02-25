# JavaScript Minifier - FastAPI

JavaScript 파일을 업로드하면 자동으로 압축(minify)하여 다운로드할 수 있는 웹 서비스입니다.

## 주요 기능

- 📤 **드래그 앤 드롭** 파일 업로드
- ⚡ **자동 압축** - rjsmin을 사용한 고속 압축
- 📊 **압축 통계** - 원본/압축 파일 크기 비교
- 💾 **즉시 다운로드** - 압축된 .min.js 파일 다운로드
- 🎨 **깔끔한 UI** - 모던한 반응형 디자인

## 설치 방법

### 1. 가상환경 생성 (권장)

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### 2. 패키지 설치

```bash
pip install -r requirements.txt
```

## 실행 방법

```bash
python main.py
```

또는

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

서버가 시작되면 브라우저에서 접속:
```
http://localhost:8000
```

## API 엔드포인트

### 1. 메인 페이지
- **GET** `/`
- HTML 페이지 반환

### 2. 파일 압축
- **POST** `/minify`
- Body: `multipart/form-data`
- Field: `file` (JavaScript 파일)
- Response:
```json
{
  "success": true,
  "file_id": "uuid",
  "original_filename": "script.js",
  "minified_filename": "script.min.js",
  "original_size": 10240,
  "minified_size": 5120,
  "compression_ratio": 50.0
}
```

### 3. 파일 다운로드
- **GET** `/download/{file_id}`
- Response: 압축된 JavaScript 파일

## 사용 예시

### cURL로 API 직접 호출

```bash
# 파일 업로드 및 압축
curl -X POST "http://localhost:8000/minify" \
  -F "file=@script.js"

# 응답에서 file_id를 받아 다운로드
curl -O "http://localhost:8000/download/{file_id}"
```

### Python requests 사용

```python
import requests

# 파일 업로드
with open('script.js', 'rb') as f:
    response = requests.post(
        'http://localhost:8000/minify',
        files={'file': f}
    )

data = response.json()
file_id = data['file_id']

# 파일 다운로드
download_response = requests.get(f'http://localhost:8000/download/{file_id}')
with open('script.min.js', 'wb') as f:
    f.write(download_response.content)
```

## 프로젝트 구조

```
.
├── main.py              # FastAPI 애플리케이션
├── requirements.txt     # Python 패키지 목록
├── templates/           # HTML 템플릿 폴더
│   └── index.html      # 메인 페이지
├── uploads/            # 업로드된 원본 파일 (임시)
└── minified/           # 압축된 파일 저장
```

## 기술 스택

- **FastAPI** - 고성능 웹 프레임워크
- **rjsmin** - JavaScript minification 라이브러리
- **Uvicorn** - ASGI 서버
- **HTML/CSS/JavaScript** - 프론트엔드

## 주의사항

- 현재 파일은 메모리에 저장됩니다 (실제 프로덕션에서는 DB 사용 권장)
- 서버 재시작 시 업로드된 파일이 초기화됩니다
- 대용량 파일 처리 시 타임아웃 설정이 필요할 수 있습니다

## 프로덕션 배포 시 개선사항

1. **파일 저장소**: S3, Cloud Storage 등 외부 저장소 사용
2. **데이터베이스**: 파일 메타데이터를 DB에 저장
3. **파일 만료**: 일정 시간 후 자동 삭제 로직
4. **파일 크기 제한**: 최대 업로드 크기 제한
5. **보안**: API 인증, Rate Limiting
6. **모니터링**: 로깅 및 에러 트래킹

## 라이선스

MIT License
