# 이미지 배경 슬라이드 캐러셀 사용 설명서

## 📁 파일 구조

```
프로젝트 폴더/
├── index.html           # 메인 HTML 파일
├── carousel.css         # 스타일시트
├── carousel.js          # JavaScript 기능
├── slide-image-1.png    # 슬라이드 배경 이미지 1
├── slide-image-2.png    # 슬라이드 배경 이미지 2
└── README.md           # 이 파일
```

## 🚀 빠른 시작

1. **모든 파일을 같은 폴더에 저장**하세요
2. `index.html` 파일을 더블클릭하여 브라우저에서 열기
3. 완성! 🎉

## 🖼️ 나만의 이미지로 슬라이드 만들기

### 방법 1: 이미지 파일 교체

1. 원하는 배경 이미지를 프로젝트 폴더에 복사
2. `index.html` 파일을 텍스트 에디터로 열기
3. 이미지 경로 찾기:
   ```html
   <img src="slide-image-1.png" alt="설명">
   ```
4. 파일명을 내 이미지로 변경:
   ```html
   <img src="내이미지.jpg" alt="설명">
   ```

### 방법 2: 슬라이드 추가하기

HTML 파일에서 이 코드를 복사해서 붙여넣기:

```html
<div class="carousel-slide">
    <img src="내이미지.jpg" alt="이미지 설명">
    <div class="slide-overlay"></div>
    <div class="slide-content">
        <div class="slide-label">카테고리</div>
        <h2 class="slide-title">메인 제목을<br>입력하세요</h2>
        <p class="slide-description">
            상세 설명을 여기에 작성하세요.
        </p>
        <button class="slide-cta">버튼 텍스트</button>
    </div>
</div>
```

### 방법 3: 슬라이드 삭제하기

필요없는 슬라이드는 `<div class="carousel-slide">...</div>` 전체를 삭제하면 됩니다.

## 🎨 텍스트 내용 수정하기

각 슬라이드는 4개의 텍스트 요소로 구성:

| 요소 | 설명 | HTML 태그 |
|------|------|-----------|
| 카테고리 라벨 | 상단의 작은 텍스트 | `<div class="slide-label">` |
| 메인 제목 | 큰 제목 | `<h2 class="slide-title">` |
| 설명 문구 | 본문 설명 | `<p class="slide-description">` |
| 버튼 텍스트 | 하단 버튼 | `<button class="slide-cta">` |

## ⚙️ 기능 설정 변경

`carousel.js` 파일에서 설정 변경 가능:

```javascript
this.autoPlayDuration = 5000;  // 자동 재생 시간 (밀리초)
                                // 5000 = 5초
```

## 🎯 추천 이미지 크기

- **권장 해상도**: 1920x1080 픽셀 (Full HD)
- **최소 해상도**: 1600x900 픽셀
- **파일 형식**: JPG, PNG, WebP
- **파일 크기**: 500KB 이하 (로딩 속도 최적화)

## 💡 유용한 팁

### 텍스트가 잘 안보일 때

`carousel.css` 파일에서 오버레이 투명도 조정:

```css
.slide-overlay {
    background: linear-gradient(
        to right,
        rgba(10, 15, 26, 0.9) 0%,    /* 여기 숫자를 조정 (0.0~1.0) */
        rgba(10, 15, 26, 0.6) 40%,
        rgba(10, 15, 26, 0.3) 70%,
        transparent 100%
    );
}
```

### 슬라이드 높이 변경

```css
.carousel {
    height: 700px;  /* 원하는 높이로 변경 */
}
```

### 자동 재생 끄기

`carousel.js` 파일에서:

```javascript
this.isPlaying = false;  // true → false로 변경
```

## 🔧 문제 해결

### Q: 이미지가 안보여요
**A**: 
1. 이미지 파일이 HTML과 같은 폴더에 있는지 확인
2. 파일명의 대소문자가 정확한지 확인
3. 파일 확장자가 올바른지 확인 (.jpg, .png 등)

### Q: 슬라이드가 넘어가지 않아요
**A**: 
1. 브라우저 콘솔(F12)에서 에러 확인
2. `carousel.js` 파일이 같은 폴더에 있는지 확인
3. 페이지를 새로고침(F5)해보세요

### Q: 모바일에서 작동이 이상해요
**A**: 
- 스와이프 기능이 기본으로 활성화되어 있습니다
- 터치로 좌우 슬라이드가 가능합니다

## 📱 반응형 지원

- ✅ 데스크톱 (1920px 이상)
- ✅ 노트북 (1366px~1920px)
- ✅ 태블릿 (768px~1365px)
- ✅ 모바일 (768px 이하)

## 🎮 키보드 단축키

- `←` 왼쪽 화살표: 이전 슬라이드
- `→` 오른쪽 화살표: 다음 슬라이드

## 📞 추가 도움이 필요하신가요?

HTML, CSS, JavaScript를 수정하여 자유롭게 커스터마이징하실 수 있습니다!
