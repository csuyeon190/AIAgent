# 삼성SDS 사례연구 페이지

삼성SDS 스타일의 사례연구 페이지를 구현한 프로젝트입니다. 바닐라 JavaScript, HTML, CSS를 사용하여 제작되었습니다.

## 🎯 주요 기능

### 1. 데이터 관리
- **비동기 데이터 페칭**: `async/await`를 사용한 JSON 데이터 로드
- **재시도 로직**: 네트워크 오류 시 자동 재시도 (exponential backoff)
- **타임아웃 처리**: 10초 타임아웃으로 무한 대기 방지

### 2. 카테고리 필터링
- **클라우드 탭**: `category`에 "공공" 또는 "클라우드" 포함 시 표시
- **행정 탭**: `category`에 "자동화/협업" 또는 "공공" 포함 시 표시

### 3. 이미지 최적화
- **Intersection Observer**: 화면에 보이는 이미지만 로드
- **이미지 프리로딩**: `Image` 객체를 사용한 사전 로딩
- **이미지 캐싱**: 중복 로드 방지를 위한 캐시 시스템
- **Skeleton UI**: 로딩 중 shimmer 효과 표시
- **에러 처리**: 이미지 로드 실패 시 플레이스홀더 표시

### 4. UI/UX
- **페이지네이션**: 초기 6개 표시, 더보기 버튼으로 6개씩 추가
- **탭 전환**: 클라우드/행정 탭 간 부드러운 전환
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 대응
- **접근성**: ARIA 속성을 통한 스크린 리더 지원
- **애니메이션**: 카드 순차 페이드인, 호버 효과

## 📁 파일 구조

```
project/
├── index.html      # 메인 HTML 파일
├── style.css       # 스타일시트
├── script.js       # JavaScript 로직
└── README.md       # 프로젝트 문서
```

## 🚀 사용 방법

### 1. 로컬 서버 실행

CORS 정책으로 인해 `file://` 프로토콜로는 JSON 데이터를 로드할 수 없습니다.
로컬 서버를 실행해야 합니다.

**Python 사용:**
```bash
# Python 3
python -m http.server 8000

# 브라우저에서 http://localhost:8000 접속
```

**Node.js 사용:**
```bash
# http-server 설치 (최초 1회)
npm install -g http-server

# 서버 실행
http-server -p 8000

# 브라우저에서 http://localhost:8000 접속
```

**VS Code 사용:**
- Live Server 확장 프로그램 설치
- `index.html` 파일에서 우클릭 → "Open with Live Server"

### 2. 데이터 API

현재 데이터 소스: `https://www.samsungsds.com/kr/case-study/data.txt`

데이터 형식 예시:
```json
[
  {
    "title": "NH농협은행 현장 주요 업무 자동화",
    "description": "NH농협은행에서 세무리포팅 신고서 인스트루먼트...",
    "category": ["금융", "자동화/협업"],
    "company": "NH농협은행",
    "logo_img": "https://example.com/logo.png",
    "success_yn": "T",
    "success_img": "https://example.com/case-study.jpg",
    "link": "https://example.com/details"
  }
]
```

## 💡 코드 설명

### 데이터 필터링 로직

```javascript
// 카테고리별 데이터 필터링
function filterDataByCategory() {
    AppState.cloudData = [];
    AppState.adminData = [];

    AppState.allData.forEach(item => {
        const categories = item.category || [];
        
        // 클라우드: "공공" 또는 "클라우드" 포함
        if (categories.includes('공공') || categories.includes('클라우드')) {
            AppState.cloudData.push(item);
        }
        
        // 행정: "자동화/협업" 또는 "공공" 포함
        if (categories.includes('자동화/협업') || categories.includes('공공')) {
            AppState.adminData.push(item);
        }
    });
}
```

### 이미지 Lazy Loading

```javascript
// Intersection Observer로 화면에 보이는 이미지만 로드
function setupLazyLoading() {
    const imageObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    loadImage(img);
                    observer.unobserve(img);
                }
            });
        },
        {
            rootMargin: '50px',  // 뷰포트 50px 전에 로드 시작
            threshold: 0.01
        }
    );

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}
```

### 이미지 프리로딩

```javascript
// Image 객체를 사용한 프리로딩으로 깜빡임 방지
function loadImage(imgElement) {
    const src = imgElement.dataset.src;
    const tempImage = new Image();
    
    tempImage.onload = () => {
        imgElement.src = src;
        imgElement.removeAttribute('data-src');
        imgElement.parentElement.classList.add('loaded');
        AppState.imageCache.add(src);
    };
    
    tempImage.src = src;
}
```

## 🎨 디자인 특징

- **컬러 시스템**: 삼성 브랜드 블루 (#1428A0) 기반
- **타이포그래피**: Noto Sans KR (한글) + Montserrat (영문)
- **그리드 레이아웃**: CSS Grid로 반응형 구현
- **애니메이션**: CSS 애니메이션 + JavaScript 제어
- **그림자**: 레이어별 깊이감 표현

## 📱 반응형 브레이크포인트

- **데스크톱**: 1200px 이상 (3열 그리드)
- **태블릿**: 768px ~ 1199px (2열 그리드)
- **모바일**: 480px ~ 767px (1~2열 그리드)
- **소형 모바일**: 480px 미만 (1열 그리드)

## ⚡ 성능 최적화

1. **이미지 로딩**
   - Intersection Observer를 통한 lazy loading
   - 이미지 프리로딩으로 깜빡임 방지
   - 이미지 캐싱으로 중복 로드 방지

2. **네트워크**
   - async/await 비동기 처리
   - 재시도 로직 (exponential backoff)
   - 타임아웃 설정

3. **렌더링**
   - DOM 요소 캐싱
   - requestAnimationFrame 활용
   - CSS 애니메이션 우선 사용

4. **메모리**
   - 이미지 캐시 관리
   - 이벤트 리스너 정리
   - Intersection Observer unobserve

## 🔧 커스터마이징

### 페이지당 항목 수 변경

`script.js`의 `AppState` 객체에서 수정:

```javascript
const AppState = {
    itemsPerPage: 6,  // 6 → 원하는 개수로 변경
    // ...
};
```

### 색상 변경

`style.css`의 CSS 변수 수정:

```css
:root {
    --primary-blue: #1428A0;  /* 메인 컬러 */
    --light-blue: #4A6CF7;    /* 보조 컬러 */
    /* ... */
}
```

### API URL 변경

`script.js`의 `API_CONFIG` 객체에서 수정:

```javascript
const API_CONFIG = {
    dataUrl: 'https://your-api-endpoint.com/data.json',
    // ...
};
```

## 🐛 문제 해결

### CORS 오류
- 로컬 서버를 사용하세요 (Python, Node.js, Live Server 등)
- 또는 브라우저 CORS 확장 프로그램 사용 (개발 시에만)

### 이미지가 로드되지 않음
- 네트워크 탭에서 이미지 URL 확인
- CORS 정책 확인
- 이미지 URL이 HTTPS인지 확인

### 데이터가 표시되지 않음
- 개발자 도구 콘솔에서 에러 확인
- JSON 데이터 형식 확인
- API URL이 올바른지 확인

## 📄 라이선스

MIT License

## 🤝 기여

이슈 및 풀 리퀘스트를 환영합니다!

---

Made with ❤️ using Vanilla JavaScript
