더 보기
오후 11:04

탭 전환 함수의 단계별 동작 원리를 상세히 설명하기로 결정했습니다
탭 전환 함수의 단계별 동작 원리를 상세히 설명하기로 결정했습니다
handleTabClick 함수를 자세히 설명해드릴게요! 이 함수는 클라우드/행정 탭을 클릭했을 때 화면을 전환하는 핵심 로직입니다.

📚 함수 전체 흐름
javascript
function handleTabClick(event) {
    // 1️⃣ 클릭된 탭 정보 가져오기
    // 2️⃣ 중복 클릭 방지
    // 3️⃣ 현재 탭 상태 업데이트
    // 4️⃣ 탭 버튼 UI 업데이트
    // 5️⃣ 패널(콘텐츠) 표시/숨김
}
🔍 코드 상세 분석
1️⃣ 클릭된 탭 정보 가져오기
javascript
const tab = event.currentTarget.dataset.tab;
설명:

event: 클릭 이벤트 객체
event.currentTarget: 실제로 이벤트 리스너가 등록된 요소 (버튼)
dataset.tab: HTML의 data-tab 속성 값 가져오기
HTML에서:

html
<button data-tab="cloud">클라우드</button>
<button data-tab="admin">행정</button>
결과:

"클라우드" 버튼 클릭 → tab = "cloud"
"행정" 버튼 클릭 → tab = "admin"
2️⃣ 중복 클릭 방지
javascript
if (AppState.currentTab === tab) return;
설명:

이미 활성화된 탭을 다시 클릭하면 아무것도 하지 않음
불필요한 DOM 조작과 리렌더링 방지 → 성능 최적화
예시:

javascript
// 현재 클라우드 탭이 활성화된 상태
AppState.currentTab = "cloud"

// 클라우드 버튼을 다시 클릭
handleTabClick(event) // → "cloud" === "cloud" → return (종료)

// 행정 버튼을 클릭
handleTabClick(event) // → "cloud" !== "admin" → 계속 진행
3️⃣ 현재 탭 상태 업데이트
javascript
AppState.currentTab = tab;
설명:

전역 상태 객체에 현재 활성 탭 저장
다른 함수들이 이 값을 참조하여 어떤 탭이 활성화되어 있는지 알 수 있음
AppState 객체:

javascript
const AppState = {
    currentTab: 'cloud',  // ← 여기가 업데이트됨
    cloudData: [...],
    adminData: [...],
    // ...
};
4️⃣ 탭 버튼 UI 업데이트
javascript
DOM.tabButtons.forEach(btn => {
    const isActive = btn.dataset.tab === tab;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive);
});
설명: 모든 탭 버튼을 순회하면서 활성/비활성 상태를 설정합니다.

단계별 분석:

Step 1: 각 버튼이 클릭된 탭인지 확인
javascript
const isActive = btn.dataset.tab === tab;
예시: "행정" 버튼을 클릭했을 때

javascript
// 클라우드 버튼 순회
btn.dataset.tab = "cloud"
tab = "admin"
isActive = false  // "cloud" !== "admin"

// 행정 버튼 순회
btn.dataset.tab = "admin"
tab = "admin"
isActive = true  // "admin" === "admin"
Step 2: CSS 클래스 추가/제거
javascript
btn.classList.toggle('active', isActive);
toggle(className, force) 메서드:

force가 true → 클래스 추가
force가 false → 클래스 제거
결과:

html
<!-- 클라우드 버튼 -->
<button data-tab="cloud" class="">클라우드</button>

<!-- 행정 버튼 -->
<button data-tab="admin" class="active">행정</button>
CSS 효과:

css
.tab-button.active {
    color: white;
    background: linear-gradient(135deg, var(--primary-blue), var(--light-blue));
}
Step 3: 접근성(Accessibility) 속성 설정
javascript
btn.setAttribute('aria-selected', isActive);
ARIA 속성:

스크린 리더 사용자를 위한 접근성 속성
aria-selected="true" → 이 탭이 선택됨
aria-selected="false" → 이 탭이 선택 안 됨
결과:

html
<button data-tab="cloud" aria-selected="false">클라우드</button>
<button data-tab="admin" aria-selected="true">행정</button>
5️⃣ 패널(콘텐츠) 표시/숨김
javascript
const cloudPanel = document.getElementById('cloud-panel');
const adminPanel = document.getElementById('admin-panel');

if (tab === 'cloud') {
    cloudPanel.classList.add('active');
    adminPanel.classList.remove('active');
} else {
    adminPanel.classList.add('active');
    cloudPanel.classList.remove('active');
}
설명: 탭 버튼만 바뀌면 소용없으니, 실제 콘텐츠 영역도 전환해야 합니다!

HTML 구조:

html
<!-- 클라우드 콘텐츠 -->
<section id="cloud-panel" class="tab-panel active">
    <div class="card-grid">...</div>
</section>

<!-- 행정 콘텐츠 -->
<section id="admin-panel" class="tab-panel">
    <div class="card-grid">...</div>
</section>
CSS:

css
.tab-panel {
    display: none;  /* 기본적으로 숨김 */
}

.tab-panel.active {
    display: block;  /* active 클래스가 있으면 표시 */
}
동작 흐름:

클라우드 탭 클릭 시:
javascript
tab = "cloud"

// if 조건이 true
cloudPanel.classList.add('active')     // 클라우드 패널 표시
adminPanel.classList.remove('active')   // 행정 패널 숨김
결과:

html
<section id="cloud-panel" class="tab-panel active">  ← 보임 ✅
<section id="admin-panel" class="tab-panel">         ← 숨김 ❌
행정 탭 클릭 시:
javascript
tab = "admin"

// else 블록 실행
adminPanel.classList.add('active')      // 행정 패널 표시
cloudPanel.classList.remove('active')   // 클라우드 패널 숨김
결과:

html
<section id="cloud-panel" class="tab-panel">         ← 숨김 ❌
<section id="admin-panel" class="tab-panel active">  ← 보임 ✅
🎬 전체 동작 시나리오
시나리오: 사용자가 "행정" 탭을 클릭
javascript
// 1️⃣ 이벤트 발생
// <button data-tab="admin">행정</button> 클릭

// 2️⃣ handleTabClick 함수 실행
function handleTabClick(event) {
    
    // 3️⃣ 클릭된 탭 확인
    const tab = "admin"  // event.currentTarget.dataset.tab
    
    // 4️⃣ 중복 클릭 체크
    if ("cloud" === "admin") return;  // false → 계속 진행
    
    // 5️⃣ 상태 업데이트
    AppState.currentTab = "admin"  // "cloud" → "admin"
    
    // 6️⃣ 모든 버튼 업데이트
    // 클라우드 버튼:
    // - isActive = false
    // - class 제거
    // - aria-selected="false"
    
    // 행정 버튼:
    // - isActive = true
    // - class="active" 추가
    // - aria-selected="true"
    
    // 7️⃣ 패널 전환
    // cloudPanel.classList.remove('active')  → 숨김
    // adminPanel.classList.add('active')     → 표시
}

// 8️⃣ 화면 결과
// - 클라우드 버튼: 회색 (비활성)
// - 행정 버튼: 파란색 그라디언트 (활성)
// - 클라우드 카드 그리드: 숨김
// - 행정 카드 그리드: 표시
🔄 이벤트 리스너 등록 (참고)
이 함수는 다음과 같이 등록됩니다:

javascript
function setupEventListeners() {
    DOM.tabButtons.forEach(button => {
        button.addEventListener('click', handleTabClick);
    });
}
```

**흐름:**
```
사용자 클릭 
  ↓
브라우저가 click 이벤트 발생
  ↓
addEventListener가 감지
  ↓
handleTabClick 함수 실행
  ↓
UI 업데이트
💡 핵심 포인트
1. event.currentTarget vs event.target
javascript
// currentTarget: 이벤트 리스너가 등록된 요소 (항상 버튼)
// target: 실제 클릭된 요소 (버튼 안의 텍스트일 수도 있음)

event.currentTarget  // ✅ 안전함
event.target         // ⚠️ 버튼 안의 요소를 클릭하면 다를 수 있음
2. classList.toggle(className, force)
javascript
// 일반적인 toggle (클래스가 있으면 제거, 없으면 추가)
element.classList.toggle('active')

// force 사용 (true/false로 명시적 제어)
element.classList.toggle('active', true)   // 무조건 추가
element.classList.toggle('active', false)  // 무조건 제거
3. 접근성(Accessibility)
javascript
// ARIA 속성으로 스크린 리더 지원
btn.setAttribute('aria-selected', isActive)

// 스크린 리더가 읽음:
// "클라우드 탭, 선택 안 됨"
// "행정 탭, 선택됨"
🎯 요약
이 함수는 탭 UI의 모든 것을 담당합니다:

✅ 어떤 탭을 클릭했는지 파악
✅ 불필요한 재클릭 방지
✅ 전역 상태 업데이트
✅ 버튼 스타일 전환 (active 클래스)
✅ 콘텐츠 영역 표시/숨김
✅ 접근성 지원 (aria-selected)
간단해 보이지만, 실제로는 상태 관리, UI 업데이트, 접근성까지 모두 고려한 완성도 높은 코드입니다! 😊

AppState.currentTab === tab이게 무슨뜻이야?

오후 11:07

엄격한 비교 연산자와 상태 관리 개념을 구체적 예시로 설명하려 계획했다
엄격한 비교 연산자와 상태 관리 개념을 구체적 예시로 설명하려 계획했다
AppState.currentTab === tab을 아주 쉽게 설명해드릴게요!

🎯 간단 요약
**"현재 보고 있는 탭과 방금 클릭한 탭이 같은가?"**를 확인하는 코드입니다.

📖 자세한 설명
=== 연산자
의미: "완전히 같은가?" (엄격한 비교)
결과: true 또는 false
javascript
"cloud" === "cloud"  // true (같음)
"cloud" === "admin"  // false (다름)
구체적인 예시
상황 1: 클라우드 탭이 이미 활성화되어 있는데, 클라우드 탭을 다시 클릭
javascript
// 현재 상태
AppState.currentTab = "cloud"  // 현재 클라우드 탭을 보고 있음

// 사용자가 클라우드 버튼을 다시 클릭
tab = "cloud"  // 클릭한 탭

// 비교
AppState.currentTab === tab
"cloud" === "cloud"
true  // ✅ 같다! (이미 보고 있는 탭을 다시 클릭함)

// 결과
if (true) return;  // 함수 종료 (아무것도 안 함)
상황 2: 클라우드 탭을 보고 있는데, 행정 탭을 클릭
javascript
// 현재 상태
AppState.currentTab = "cloud"  // 현재 클라우드 탭을 보고 있음

// 사용자가 행정 버튼을 클릭
tab = "admin"  // 클릭한 탭

// 비교
AppState.currentTab === tab
"cloud" === "admin"
false  // ❌ 다르다! (다른 탭을 클릭함)

// 결과
if (false) return;  // 조건이 거짓이므로 return 안 함
// 계속 진행 → 탭 전환 실행!
🎬 실제 동작 시나리오
시나리오 A: 같은 탭 다시 클릭 (중복 클릭)
javascript
// 1. 초기 상태: 클라우드 탭 보는 중
AppState.currentTab = "cloud"

// 2. 클라우드 버튼을 다시 클릭
function handleTabClick(event) {
    const tab = "cloud"
    
    // 3. 비교
    if (AppState.currentTab === tab) {  // "cloud" === "cloud" → true
        return;  // 여기서 함수 종료! 아래 코드는 실행 안 됨
    }
    
    // ⬇️ 여기부터는 실행 안 됨
    AppState.currentTab = tab;
    // ...
}
결과: 아무 일도 일어나지 않음 (이미 보고 있는 탭이니까!)

시나리오 B: 다른 탭 클릭 (탭 전환)
javascript
// 1. 초기 상태: 클라우드 탭 보는 중
AppState.currentTab = "cloud"

// 2. 행정 버튼을 클릭
function handleTabClick(event) {
    const tab = "admin"
    
    // 3. 비교
    if (AppState.currentTab === tab) {  // "cloud" === "admin" → false
        return;  // 조건이 거짓이므로 return 안 함
    }
    
    // ⬇️ 여기부터 실행됨!
    AppState.currentTab = tab;  // "cloud" → "admin" 변경
    // 탭 버튼 UI 업데이트
    // 패널 전환
    // ...
}
결과: 행정 탭으로 전환됨!

🔍 왜 이렇게 하나요?
이유 1: 불필요한 작업 방지 (성능 최적화)
javascript
// 이 코드가 없다면...
function handleTabClick(event) {
    // 같은 탭을 클릭해도 매번 실행됨
    AppState.currentTab = tab;           // 불필요한 업데이트
    DOM.tabButtons.forEach(...)          // 불필요한 DOM 조작
    cloudPanel.classList.add('active')   // 이미 active인데 또 추가
    // ...
}

// 결과: 브라우저가 쓸데없는 일을 계속함 😵
이유 2: 버그 방지
javascript
// 같은 탭을 여러 번 클릭하면...
// - 불필요한 리렌더링
// - 애니메이션 재시작
// - 스크롤 위치 초기화
// 등의 문제가 생길 수 있음
📊 비교 연산자 정리
=== (엄격한 동등)
javascript
1 === 1        // true
"1" === "1"    // true
1 === "1"      // false (타입이 다름)
== (느슨한 동등) - 사용하지 않는 것이 좋음
javascript
1 == 1         // true
"1" == "1"     // true
1 == "1"       // true (타입 변환 후 비교) ⚠️
이 코드에서는 ===를 사용: 문자열 "cloud"와 "admin"을 정확히 비교

🎯 핵심 정리
javascript
if (AppState.currentTab === tab) return;
한 문장 요약:

"이미 보고 있는 탭을 또 클릭했으면, 아무것도 하지 말고 함수를 종료해라"

예시로 이해하기:

javascript
// 현재 클라우드 탭을 보고 있음
AppState.currentTab = "cloud"

// 클라우드 버튼 클릭 → return (종료)
// 행정 버튼 클릭 → 계속 진행 (탭 전환)
왜 필요한가:

✅ 불필요한 작업 방지
✅ 성능 향상
✅ 버그 방지
이제 이해되셨나요? 😊

/ ========================================
// Fetch with Retry (재시도 로직)
// ========================================
async function fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

            const response = await fetch(url, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                }
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.warn(`Fetch attempt ${i + 1} failed:`, error.message);
            
            // 마지막 재시도에서도 실패하면 에러 throw
            if (i === retries - 1) {
                throw error;
            }

            // 재시도 전 대기 (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
    }
}

이 함수 상세하게 분석해줘
더 보기
오후 11:14

비동기 페칭, 재시도 로직, 타임아웃을 상세히 분석하기로 결정했습니다
비동기 페칭, 재시도 로직, 타임아웃을 상세히 분석하기로 결정했습니다
fetchWithRetry 함수를 완전히 분해해서 설명해드릴게요! 이 함수는 네트워크 요청이 실패해도 자동으로 재시도하는 똑똑한 함수입니다.

🎯 함수의 목적
"데이터를 가져오는데 실패하면, 포기하지 말고 최대 3번까지 다시 시도해라!"

📖 전체 구조
javascript
async function fetchWithRetry(url, retries = 3) {
    // 1️⃣ 재시도 루프 (최대 3번)
    for (let i = 0; i < retries; i++) {
        try {
            // 2️⃣ 타임아웃 설정
            // 3️⃣ 데이터 요청
            // 4️⃣ 성공 시 데이터 반환
        } catch (error) {
            // 5️⃣ 실패 시 처리
            // 6️⃣ 재시도 또는 에러 발생
        }
    }
}
🔍 코드 라인별 분석
1️⃣ 함수 선언부
javascript
async function fetchWithRetry(url, retries = 3) {
분석:

async: 이 함수는 비동기 함수 (await을 사용할 수 있음)
url: 데이터를 가져올 주소
retries = 3: 재시도 횟수 (기본값 3번)
예시:

javascript
// 호출 예시
fetchWithRetry('http://127.0.0.1:3000/data.txt')      // retries = 3 (기본값)
fetchWithRetry('http://127.0.0.1:3000/data.txt', 5)   // retries = 5
2️⃣ 재시도 루프
javascript
for (let i = 0; i < retries; i++) {
```

**분석:**
- `i = 0`: 첫 번째 시도
- `i = 1`: 두 번째 시도
- `i = 2`: 세 번째 시도

**시각화:**
```
┌─────────────────┐
│ i = 0 (1번째)   │ → 실패 → 다시 시도
├─────────────────┤
│ i = 1 (2번째)   │ → 실패 → 다시 시도
├─────────────────┤
│ i = 2 (3번째)   │ → 실패 → 에러 발생
└─────────────────┘
3️⃣ 타임아웃 설정 (AbortController)
javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
AbortController란?

fetch 요청을 중간에 취소할 수 있게 해주는 도구
10초 동안 응답이 없으면 자동으로 취소
상세 분석:

javascript
// 1. 취소 컨트롤러 생성
const controller = new AbortController();

// 2. 10초 후에 자동 실행되는 타이머 설정
const timeoutId = setTimeout(() => {
    controller.abort()  // 요청 취소!
}, API_CONFIG.timeout);  // 10000 = 10초
```

**시간 흐름:**
```
0초 ───────► 10초
 │           │
 │           └─ controller.abort() 실행 (요청 취소)
 │
 └─ fetch 시작
4️⃣ 실제 데이터 요청
javascript
const response = await fetch(url, {
    signal: controller.signal,
    headers: {
        'Accept': 'application/json',
    }
});
분석:

await fetch(url, ...)
await: fetch가 완료될 때까지 기다림
fetch: 브라우저 내장 함수로 HTTP 요청
signal: controller.signal
AbortController와 연결
10초가 지나면 자동으로 요청 취소
headers: { 'Accept': 'application/json' }
서버에게 "JSON 데이터를 보내주세요"라고 요청
예시:

javascript
// 실제 HTTP 요청
GET http://127.0.0.1:3000/data.txt
Accept: application/json

// 서버 응답 대기...
// 10초 안에 응답이 오지 않으면 → abort!
5️⃣ 타임아웃 해제
javascript
clearTimeout(timeoutId);
분석:

응답을 성공적으로 받았으면, 타이머를 제거
이미 응답을 받았는데 10초 후에 abort()가 실행되면 안 되니까!
시나리오:

javascript
// 3초 만에 응답을 받음
0초: fetch 시작
3초: 응답 받음 ✅
     clearTimeout(timeoutId) 실행
     → 10초 타이머 취소!
10초: (아무 일도 안 일어남)

// 만약 clearTimeout을 안 했다면?
10초: controller.abort() 실행 (불필요한 동작!)
6️⃣ HTTP 상태 코드 확인
javascript
if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
}
분석:

response.ok란?
HTTP 상태 코드가 200~299이면 true
400(Bad Request), 404(Not Found), 500(Server Error) 등이면 false
예시:

javascript
// 성공 (200 OK)
response.status = 200
response.ok = true
if (!true) { ... }  // 실행 안 됨

// 실패 (404 Not Found)
response.status = 404
response.ok = false
if (!false) { throw error }  // ✅ 에러 발생!
// "HTTP error! status: 404"
7️⃣ JSON 파싱
javascript
const data = await response.json();
return data;
분석:

response.json(): 응답 본문을 JSON으로 변환
await: 변환이 완료될 때까지 기다림
return: 데이터를 반환하고 함수 종료 (성공!)
예시:

javascript
// 서버 응답 (텍스트)
'[{"title": "...", "category": [...]}]'

// response.json() 후 (JavaScript 객체)
[
  { title: "...", category: [...] },
  ...
]

// 이 데이터를 호출한 곳으로 반환
return data;
8️⃣ 에러 처리 (catch 블록)
javascript
catch (error) {
    console.warn(`Fetch attempt ${i + 1} failed:`, error.message);
    
    // 마지막 재시도에서도 실패하면 에러 throw
    if (i === retries - 1) {
        throw error;
    }

    // 재시도 전 대기 (exponential backoff)
    await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
}
상세 분석:

Step 1: 에러 로그 출력
javascript
console.warn(`Fetch attempt ${i + 1} failed:`, error.message);
```

**예시:**
```
i = 0 → "Fetch attempt 1 failed: Failed to fetch"
i = 1 → "Fetch attempt 2 failed: Failed to fetch"
i = 2 → "Fetch attempt 3 failed: Failed to fetch"
Step 2: 마지막 시도인지 확인
javascript
if (i === retries - 1) {
    throw error;
}
분석:

javascript
// retries = 3일 때
i = 0: i === 2? → false (아직 2번 더 시도 가능)
i = 1: i === 2? → false (아직 1번 더 시도 가능)
i = 2: i === 2? → true  (마지막 시도였음) → throw error! 🚨
```

**시각화:**
```
시도 1 (i=0) → 실패 → 다시 시도
시도 2 (i=1) → 실패 → 다시 시도
시도 3 (i=2) → 실패 → 에러 발생 (포기)
Step 3: Exponential Backoff (지수적 대기)
javascript
await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
이게 뭔가요? 재시도할 때마다 대기 시간을 점점 늘리는 기법입니다!

계산:

javascript
// Math.pow(2, i) = 2의 i승
// i = 0: Math.pow(2, 0) = 1 → 1초 대기
// i = 1: Math.pow(2, 1) = 2 → 2초 대기
// i = 2: Math.pow(2, 2) = 4 → 4초 대기
```

**왜 이렇게 하나요?**
- 서버가 과부하 상태일 수 있음
- 즉시 재시도하면 서버에 더 큰 부담
- 시간을 두고 재시도하면 성공 확률 증가!

**시각화:**
```
시도 1 실패
  ↓
1초 대기 😴
  ↓
시도 2 실패
  ↓
2초 대기 😴😴
  ↓
시도 3 실패
  ↓
에러 발생 🚨
Promise 분해:

javascript
// 1. Promise 생성
new Promise(resolve => {
    // 2. 1초 후에 resolve 호출
    setTimeout(resolve, 1000)
})

// 3. resolve가 호출될 때까지 await으로 기다림
await ...

// 4. 1초 후 다음 코드 실행
🎬 전체 시나리오
시나리오 1: 첫 시도에서 성공 ✅
javascript
// 1. 첫 번째 시도 (i = 0)
try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(url);  // ✅ 성공! (3초 소요)
    clearTimeout(timeoutId);  // 타이머 제거
    
    if (response.ok) {  // true
        const data = await response.json();
        return data;  // 🎉 데이터 반환하고 함수 종료!
    }
} catch (error) {
    // 실행 안 됨
}

// for 루프도 종료 (return으로 함수가 끝났으니까)
시나리오 2: 2번 실패 후 3번째에 성공 ✅
javascript
// ═══ 1번째 시도 (i = 0) ═══
try {
    const response = await fetch(url);  // ❌ 실패!
} catch (error) {
    console.warn("Fetch attempt 1 failed:", error.message);
    // i !== retries - 1 (0 !== 2) → 재시도
    await new Promise(...);  // 1초 대기 😴
}

// ═══ 2번째 시도 (i = 1) ═══
try {
    const response = await fetch(url);  // ❌ 실패!
} catch (error) {
    console.warn("Fetch attempt 2 failed:", error.message);
    // i !== retries - 1 (1 !== 2) → 재시도
    await new Promise(...);  // 2초 대기 😴😴
}

// ═══ 3번째 시도 (i = 2) ═══
try {
    const response = await fetch(url);  // ✅ 성공!
    clearTimeout(timeoutId);
    const data = await response.json();
    return data;  // 🎉 성공!
} catch (error) {
    // 실행 안 됨
}
시나리오 3: 모두 실패 ❌
javascript
// ═══ 1번째 시도 (i = 0) ═══
try {
    const response = await fetch(url);  // ❌ 실패!
} catch (error) {
    console.warn("Fetch attempt 1 failed:", error.message);
    await new Promise(...);  // 1초 대기
}

// ═══ 2번째 시도 (i = 1) ═══
try {
    const response = await fetch(url);  // ❌ 실패!
} catch (error) {
    console.warn("Fetch attempt 2 failed:", error.message);
    await new Promise(...);  // 2초 대기
}

// ═══ 3번째 시도 (i = 2) ═══
try {
    const response = await fetch(url);  // ❌ 실패!
} catch (error) {
    console.warn("Fetch attempt 3 failed:", error.message);
    
    // i === retries - 1 (2 === 2) → true
    throw error;  // 🚨 에러를 호출한 곳으로 던짐!
}

// loadData() 함수의 catch 블록에서 처리됨
```

---

## 📊 타임라인 시각화

### 성공 케이스
```
0초: 시도 1 시작
3초: 성공! ✅ → 데이터 반환

총 소요 시간: 3초
```

### 2번 실패 후 성공
```
0초: 시도 1 시작
3초: 실패 ❌
4초: 시도 2 시작 (1초 대기 후)
7초: 실패 ❌
9초: 시도 3 시작 (2초 대기 후)
12초: 성공! ✅ → 데이터 반환

총 소요 시간: 12초
```

### 모두 실패
```
0초: 시도 1 시작
3초: 실패 ❌
4초: 시도 2 시작 (1초 대기)
7초: 실패 ❌
9초: 시도 3 시작 (2초 대기)
12초: 실패 ❌ → 에러 발생 🚨

총 소요 시간: 12초 (에러)
💡 핵심 개념 정리
1. async/await
javascript
async function example() {
    const data = await fetch(url);  // 응답이 올 때까지 기다림
    console.log(data);  // 응답 받은 후 실행
}
2. AbortController (타임아웃)
javascript
const controller = new AbortController();
setTimeout(() => controller.abort(), 10000);  // 10초 후 취소
fetch(url, { signal: controller.signal });
3. try-catch
javascript
try {
    // 에러가 발생할 수 있는 코드
    const data = await fetch(url);
} catch (error) {
    // 에러가 발생하면 여기서 처리
    console.error(error);
}
4. Exponential Backoff
javascript
// 1초 → 2초 → 4초 → 8초 ...
Math.pow(2, 0) = 1
Math.pow(2, 1) = 2
Math.pow(2, 2) = 4
Math.pow(2, 3) = 8
🎯 왜 이렇게 복잡하게 만들었나요?
문제: 단순 fetch는 취약함
javascript
// 문제 1: 네트워크 일시적 오류 → 실패
// 문제 2: 서버 느림 → 무한 대기
// 문제 3: 404 에러 → 그냥 실패
const data = await fetch(url);
해결: fetchWithRetry
javascript
// ✅ 일시적 오류 → 재시도로 해결
// ✅ 서버 느림 → 10초 타임아웃
// ✅ 재시도 간격 늘리기 → 서버 부담 감소
// ✅ 3번 실패하면 포기 → 무한 루프 방지
🔑 요약
이 함수는:

✅ 최대 3번 재시도
✅ 10초 타임아웃 (느린 서버 방지)
✅ Exponential Backoff (1초 → 2초 → 4초 대기)
✅ HTTP 에러 감지 (404, 500 등)
✅ 자동 JSON 파싱
✅ 성공하면 즉시 반환
✅ 모두 실패하면 에러 발생
네트워크가 불안정한 환경에서도 데이터를 안정적으로 가져올 수 있는 견고한 함수입니다! 💪


// ======================================== // 카테고리별 데이터 필터링 // ======================================== function filterDataByCategory() { AppState.cloudData = []; AppState.adminData = []; // 배열인지 확인 if (!Array.isArray(AppState.allData)) { console.error('AppState.al

pasted

각각의 함수를 상세하게 설명해주세요.

오후 11:30

네 함수를 체계적으로 분석하고 상세히 설명하기로 결정했습니다
네 함수를 체계적으로 분석하고 상세히 설명하기로 결정했습니다
4개의 핵심 함수를 완전히 분해해서 설명해드릴게요! 이 함수들은 데이터를 필터링하고 화면에 표시하는 역할을 합니다.

1️⃣ filterDataByCategory() - 데이터 분류기
🎯 목적
"전체 데이터를 읽어서 클라우드와 행정 두 그룹으로 나누기"

📖 코드 분석
Step 1: 초기화
javascript
AppState.cloudData = [];
AppState.adminData = [];
의미:

빈 배열로 초기화
이전 데이터를 지우고 새로 시작
왜 필요한가?

javascript
// 만약 초기화 안 하면?
// 첫 번째 호출: cloudData = [item1, item2]
// 두 번째 호출: cloudData = [item1, item2, item1, item2] ← 중복!
// 해결: 매번 빈 배열로 시작
Step 2: 안전성 체크
javascript
if (!Array.isArray(AppState.allData)) {
    console.error('AppState.allData가 배열이 아닙니다:', AppState.allData);
    return;
}
분석:

javascript
// Array.isArray()는 배열인지 확인
Array.isArray([1, 2, 3])     // true ✅
Array.isArray({ a: 1 })      // false ❌
Array.isArray("hello")       // false ❌
Array.isArray(null)          // false ❌

// 배열이 아니면 함수 종료 (에러 방지)
Step 3: 데이터 순회 및 필터링
javascript
AppState.allData.forEach(item => {
    const categories = item.category || [];
    
    // 클라우드 필터
    if (categories.includes('공공') || categories.includes('클라우드')) {
        AppState.cloudData.push(item);
    }
    
    // 행정 필터
    if (categories.includes('자동화/협업') || categories.includes('공공')) {
        AppState.adminData.push(item);
    }
});
forEach란?

javascript
// 배열의 각 항목을 하나씩 처리
[1, 2, 3].forEach(item => {
    console.log(item);  // 1, 2, 3 순서대로 출력
});
상세 분석:

1. category 가져오기
javascript
const categories = item.category || [];
|| (OR) 연산자:

javascript
// item.category가 있으면 그 값 사용
// 없으면 빈 배열 [] 사용

item.category = ["클라우드", "금융"]
→ categories = ["클라우드", "금융"]

item.category = null
→ categories = []  // 기본값

item.category = undefined
→ categories = []  // 기본값
2. 클라우드 필터링
javascript
if (categories.includes('공공') || categories.includes('클라우드')) {
    AppState.cloudData.push(item);
}
includes()란?

javascript
// 배열에 특정 값이 있는지 확인
["공공", "금융"].includes('공공')     // true
["공공", "금융"].includes('클라우드')  // false
["공공", "금융"].includes('금융')     // true
|| (OR) 연산자:

javascript
// 둘 중 하나라도 true면 true
true || false   // true
false || true   // true
false || false  // false
실제 예시:

javascript
// Case 1
item = {
    title: "NH농협은행",
    category: ["금융", "자동화/협업"]
}
categories = ["금융", "자동화/협업"]

// 클라우드 체크
categories.includes('공공')     // false
categories.includes('클라우드')  // false
false || false = false
→ cloudData에 추가 안 됨 ❌

// 행정 체크
categories.includes('자동화/협업') // true
categories.includes('공공')       // false
true || false = true
→ adminData에 추가됨 ✅
javascript
// Case 2
item = {
    title: "전라북도청",
    category: ["공공", "클라우드"]
}
categories = ["공공", "클라우드"]

// 클라우드 체크
categories.includes('공공')     // true
categories.includes('클라우드')  // true
true || true = true
→ cloudData에 추가됨 ✅

// 행정 체크
categories.includes('자동화/협업') // false
categories.includes('공공')       // true
false || true = true
→ adminData에 추가됨 ✅

// 결과: 양쪽 모두에 추가! (공공 데이터는 두 탭에 다 표시)
Step 4: 결과 로그
javascript
console.log('클라우드 데이터:', AppState.cloudData.length, '개');
console.log('행정 데이터:', AppState.adminData.length, '개');
📊 전체 시나리오
javascript
// 입력 데이터
AppState.allData = [
    { title: "A", category: ["클라우드"] },
    { title: "B", category: ["자동화/협업"] },
    { title: "C", category: ["공공"] },
    { title: "D", category: ["금융"] }
]

// 실행: filterDataByCategory()

// 결과
AppState.cloudData = [
    { title: "A", category: ["클라우드"] },  // 클라우드 포함
    { title: "C", category: ["공공"] }       // 공공 포함
]

AppState.adminData = [
    { title: "B", category: ["자동화/협업"] }, // 자동화/협업 포함
    { title: "C", category: ["공공"] }        // 공공 포함
]

// 콘솔 출력
"클라우드 데이터: 2 개"
"행정 데이터: 2 개"
2️⃣ renderAllData() - 초기 렌더링
🎯 목적
"처음 페이지를 로드할 때 두 탭 모두 초기 상태로 표시하기"

📖 코드 분석
javascript
function renderAllData() {
    // 초기 표시 개수 리셋
    AppState.cloudDisplayCount = AppState.itemsPerPage;
    AppState.adminDisplayCount = AppState.itemsPerPage;

    // 각 탭 렌더링
    renderTabData('cloud');
    renderTabData('admin');
}
Step 1: 표시 개수 초기화
javascript
AppState.cloudDisplayCount = AppState.itemsPerPage;  // = 6
AppState.adminDisplayCount = AppState.itemsPerPage;  // = 6
의미:

처음에는 각 탭에서 6개씩만 표시
더보기 버튼을 누르면 이 값이 증가함
AppState 객체:

javascript
const AppState = {
    itemsPerPage: 6,        // 페이지당 6개
    cloudDisplayCount: 6,   // ← 여기에 6 할당
    adminDisplayCount: 6,   // ← 여기에 6 할당
    // ...
}
Step 2: 두 탭 모두 렌더링
javascript
renderTabData('cloud');
renderTabData('admin');
왜 두 개 다 렌더링?

javascript
// HTML에는 두 패널이 모두 존재
<section id="cloud-panel" class="active">...</section>
<section id="admin-panel">...</section>

// 첫 로드 시:
// - cloud-panel: 보임 (active)
// - admin-panel: 숨김 (active 없음)

// 하지만 두 패널 모두 데이터는 미리 준비!
// 사용자가 탭을 클릭하면 즉시 표시 가능
```

**시각화:**
```
페이지 로드
    ↓
filterDataByCategory() 실행
    ↓
renderAllData() 실행
    ↓
    ├─ renderTabData('cloud')  → 클라우드 6개 생성
    └─ renderTabData('admin')  → 행정 6개 생성

결과:
- 화면에는 클라우드 6개만 보임
- 행정 6개는 숨겨져 있지만 준비됨
3️⃣ renderTabData(tab) - 탭별 렌더링
🎯 목적
"특정 탭의 데이터를 화면에 표시하기 (클라우드 또는 행정)"

📖 코드 분석
Step 1: 변수 설정 (삼항 연산자)
javascript
const data = tab === 'cloud' ? AppState.cloudData : AppState.adminData;
const grid = tab === 'cloud' ? DOM.cloudGrid : DOM.adminGrid;
const loadMoreBtn = tab === 'cloud' ? DOM.cloudLoadMore : DOM.adminLoadMore;
const displayCount = tab === 'cloud' ? AppState.cloudDisplayCount : AppState.adminDisplayCount;
삼항 연산자란?

javascript
// 형식: 조건 ? 참일때값 : 거짓일때값
const result = (5 > 3) ? "크다" : "작다"  // "크다"
const result = (5 < 3) ? "크다" : "작다"  // "작다"
실제 동작:

javascript
// tab = 'cloud'인 경우
const data = 'cloud' === 'cloud' ? AppState.cloudData : AppState.adminData
const data = true ? AppState.cloudData : AppState.adminData
const data = AppState.cloudData  // ✅

// tab = 'admin'인 경우
const data = 'admin' === 'cloud' ? AppState.cloudData : AppState.adminData
const data = false ? AppState.cloudData : AppState.adminData
const data = AppState.adminData  // ✅
정리:

javascript
// tab이 'cloud'면
data = AppState.cloudData          // 클라우드 데이터
grid = DOM.cloudGrid               // 클라우드 그리드
loadMoreBtn = DOM.cloudLoadMore    // 클라우드 더보기 버튼
displayCount = AppState.cloudDisplayCount  // 6 (또는 12, 18...)

// tab이 'admin'이면
data = AppState.adminData          // 행정 데이터
grid = DOM.adminGrid               // 행정 그리드
loadMoreBtn = DOM.adminLoadMore    // 행정 더보기 버튼
displayCount = AppState.adminDisplayCount  // 6 (또는 12, 18...)
Step 2: 그리드 초기화
javascript
grid.innerHTML = '';
의미:

그리드 안의 모든 HTML을 삭제
깨끗한 상태에서 다시 그리기
예시:

html
<!-- 실행 전 -->
<div class="card-grid" id="cloudGrid">
    <article class="case-card">...</article>
    <article class="case-card">...</article>
    <article class="case-card">...</article>
</div>

<!-- grid.innerHTML = '' 실행 후 -->
<div class="card-grid" id="cloudGrid">
    <!-- 비어있음! -->
</div>
왜 지우고 다시 그리나?

javascript
// 더보기 버튼을 클릭하면
// displayCount: 6 → 12

// 기존 6개를 유지하고 6개를 추가? ❌ 복잡함
// 전부 지우고 12개를 새로 그리기? ✅ 간단함
Step 3: 표시할 데이터 추출
javascript
const displayData = data.slice(0, displayCount);
slice()란?

javascript
// 배열의 일부를 잘라내기
const arr = [1, 2, 3, 4, 5, 6, 7, 8]

arr.slice(0, 3)  // [1, 2, 3]      (0번째부터 2번째까지)
arr.slice(0, 6)  // [1, 2, 3, 4, 5, 6]
arr.slice(0, 10) // [1, 2, 3, 4, 5, 6, 7, 8] (10개가 없어도 됨)

// 원본 배열은 변하지 않음!
실제 예시:

javascript
// AppState.cloudData에 20개 항목이 있음
data = [item1, item2, item3, ..., item20]

// 첫 로드 (displayCount = 6)
displayData = data.slice(0, 6)  // [item1 ~ item6]

// 더보기 1회 클릭 (displayCount = 12)
displayData = data.slice(0, 12) // [item1 ~ item12]

// 더보기 2회 클릭 (displayCount = 18)
displayData = data.slice(0, 18) // [item1 ~ item18]
Step 4: 카드 생성 및 추가
javascript
displayData.forEach((item, index) => {
    const card = createCaseCard(item, index);
    grid.appendChild(card);
});
forEach의 index 파라미터:

javascript
['a', 'b', 'c'].forEach((item, index) => {
    console.log(index, item);
})
// 0 'a'
// 1 'b'
// 2 'c'
appendChild()란?

javascript
// 부모 요소의 마지막에 자식 추가
parent.appendChild(child)

// 예시
<div id="grid">
    <!-- 여기에 추가됨 ↓ -->
</div>
실제 동작:

javascript
// 1번째 반복 (index = 0)
const card = createCaseCard(item1, 0)  // 카드 생성
grid.appendChild(card)                 // 그리드에 추가

// 2번째 반복 (index = 1)
const card = createCaseCard(item2, 1)
grid.appendChild(card)

// 3번째 반복 (index = 2)
const card = createCaseCard(item3, 2)
grid.appendChild(card)

// ... 6번째까지 반복
결과:

html
<div class="card-grid" id="cloudGrid">
    <article class="case-card" style="animation-delay: 0s">...</article>
    <article class="case-card" style="animation-delay: 0.1s">...</article>
    <article class="case-card" style="animation-delay: 0.2s">...</article>
    <article class="case-card" style="animation-delay: 0.3s">...</article>
    <article class="case-card" style="animation-delay: 0.4s">...</article>
    <article class="case-card" style="animation-delay: 0.5s">...</article>
</div>
Step 5: 더보기 버튼 제어
javascript
if (displayCount < data.length) {
    loadMoreBtn.style.display = 'flex';
} else {
    loadMoreBtn.style.display = 'none';
}
로직:

javascript
// 데이터가 20개 있음
data.length = 20

// 6개 표시 중
displayCount = 6
if (6 < 20) {  // true
    loadMoreBtn.style.display = 'flex'  // 더보기 버튼 보이기 ✅
}

// 18개 표시 중
displayCount = 18
if (18 < 20) {  // true
    loadMoreBtn.style.display = 'flex'  // 더보기 버튼 보이기 ✅
}

// 20개 모두 표시
displayCount = 20
if (20 < 20) {  // false
    loadMoreBtn.style.display = 'none'  // 더보기 버튼 숨기기 ❌
}
4️⃣ createCaseCard(item, index) - 카드 생성
🎯 목적
"데이터 하나를 받아서 HTML 카드 요소를 만들어 반환하기"

📖 코드 분석
Step 1: 카드 컨테이너 생성
javascript
const card = document.createElement('article');
card.className = 'case-card';
card.style.animationDelay = `${index * 0.1}s`;
createElement():

javascript
// HTML 요소를 JavaScript로 생성
const div = document.createElement('div')
// <div></div> 생성 (아직 화면에는 없음)
템플릿 리터럴:

javascript
`${index * 0.1}s`

// index = 0: "0s"
// index = 1: "0.1s"
// index = 2: "0.2s"
// index = 3: "0.3s"
결과:

html
<article class="case-card" style="animation-delay: 0.2s">
    <!-- 내용이 여기에 추가됨 -->
</article>
```

**애니메이션 딜레이 효과:**
```
카드 1: 0.0초 후 나타남
카드 2: 0.1초 후 나타남
카드 3: 0.2초 후 나타남
카드 4: 0.3초 후 나타남
...

→ 순차적으로 나타나는 효과!
Step 2: 이미지 영역 생성
javascript
const imageDiv = document.createElement('div');
imageDiv.className = 'card-image';
Step 3: 이미지 조건 처리
Case A: 이미지가 있는 경우
javascript
if (item.success_yn === 'T' && item.success_img) {
    const img = document.createElement('img');
    img.src = item.success_img;
    img.alt = item.title || '사례 이미지';
    img.loading = 'lazy';
    
    img.onload = () => {
        imageDiv.classList.add('loaded');
        console.log('✅ 이미지 로드 완료:', item.success_img);
    };
    
    img.onerror = () => {
        console.error('❌ 이미지 로드 실패:', item.success_img);
        imageDiv.innerHTML = `<svg>...</svg>`;
        imageDiv.classList.add('loaded');
    };
    
    imageDiv.appendChild(img);
}
조건 분석:

javascript
item.success_yn === 'T' && item.success_img

// AND 연산자: 둘 다 true여야 true
'T' === 'T' && 'https://...'
true && true = true ✅

'F' === 'T' && 'https://...'
false && true = false ❌

'T' === 'T' && ''
true && false = false ❌  // 빈 문자열은 false
img.loading = 'lazy':

javascript
// 브라우저 네이티브 lazy loading
// 화면에 보일 때만 이미지 로드
onload 이벤트:

javascript
img.onload = () => {
    // 이미지 로드 성공 시 실행
    imageDiv.classList.add('loaded')  // skeleton 효과 제거
}
onerror 이벤트:

javascript
img.onerror = () => {
    // 이미지 로드 실패 시 실행
    // 플레이스홀더(SVG)로 교체
}
Case B: 이미지가 없는 경우
javascript
else {
    console.log('ℹ️ 이미지 없음:', item.title, '(success_yn:', item.success_yn, ')');
    imageDiv.innerHTML = `
        <svg class="card-image-placeholder" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
            <path d="M21 15L16 10L5 21" stroke="currentColor" stroke-width="2"/>
        </svg>
    `;
    imageDiv.classList.add('loaded');
}
Step 4: 콘텐츠 영역 생성
javascript
const contentDiv = document.createElement('div');
contentDiv.className = 'card-content';
Step 5: 로고 HTML 생성
javascript
let logoHtml = '';
if (item.logo_img) {
    logoHtml = `<img src="${item.logo_img}" alt="${item.company || ''} 로고" class="card-logo">`;
}
예시:

javascript
// logo_img가 있는 경우
item.logo_img = "https://example.com/logo.png"
item.company = "삼성SDS"

logoHtml = '<img src="https://example.com/logo.png" alt="삼성SDS 로고" class="card-logo">'

// logo_img가 없는 경우
item.logo_img = null

logoHtml = ''  // 빈 문자열
Step 6: 태그 HTML 생성
javascript
const tags = (item.category || []).map(cat => 
    `<span class="card-tag">${cat}</span>`
).join('');
map()이란?

javascript
// 배열의 각 요소를 변환
[1, 2, 3].map(num => num * 2)  // [2, 4, 6]
['a', 'b'].map(str => str.toUpperCase())  // ['A', 'B']
join()이란?

javascript
// 배열을 문자열로 합치기
['a', 'b', 'c'].join('')    // "abc"
['a', 'b', 'c'].join('-')   // "a-b-c"
['a', 'b', 'c'].join(' ')   // "a b c"
실제 동작:

javascript
item.category = ["클라우드", "공공", "금융"]

// Step 1: map으로 변환
[
    '<span class="card-tag">클라우드</span>',
    '<span class="card-tag">공공</span>',
    '<span class="card-tag">금융</span>'
]

// Step 2: join으로 합치기
tags = '<span class="card-tag">클라우드</span><span class="card-tag">공공</span><span class="card-tag">금융</span>'
Step 7: 콘텐츠 HTML 삽입
javascript
contentDiv.innerHTML = `
    ${logoHtml}
    <h3 class="card-title">${item.title || '제목 없음'}</h3>
    <p class="card-description">${item.description || '설명 없음'}</p>
    <div class="card-tags">${tags}</div>
`;
결과:

html
<div class="card-content">
    <img src="logo.png" alt="회사명 로고" class="card-logo">
    <h3 class="card-title">NH농협은행 현장 주요 업무 자동화</h3>
    <p class="card-description">NH농협은행에서 세무리포팅...</p>
    <div class="card-tags">
        <span class="card-tag">클라우드</span>
        <span class="card-tag">공공</span>
    </div>
</div>
Step 8: 카드 조립
javascript
card.appendChild(imageDiv);
card.appendChild(contentDiv);
최종 구조:

html
<article class="case-card">
    <div class="card-image">
        <img src="...">
    </div>
    <div class="card-content">
        <h3>...</h3>
        <p>...</p>
        <div class="card-tags">...</div>
    </div>
</article>
Step 9: 클릭 이벤트 추가
javascript
if (item.link) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
        window.open(item.link, '_blank');
    });
}
window.open():

javascript
// 새 탭에서 열기
window.open(url, '_blank')

// 같은 탭에서 열기
window.open(url, '_self')
Step 10: 카드 반환
javascript
return card;
🎬 전체 흐름 시나리오
페이지 로드부터 카드 표시까지
javascript
// 1. 페이지 로드
initApp()
    ↓
// 2. 데이터 가져오기
loadData()
    ↓
// 3. 데이터 분류
filterDataByCategory()
    // cloudData: 10개
    // adminData: 8개
    ↓
// 4. 초기 렌더링
renderAllData()
    ↓
    ├─ renderTabData('cloud')
    │   ├─ grid.innerHTML = ''  (초기화)
    │   ├─ displayData = cloudData.slice(0, 6)  (6개 추출)
    │   ├─ forEach로 6번 반복
    │   │   ├─ createCaseCard(item1, 0)
    │   │   │   └─ <article> 생성
    │   │   ├─ grid.appendChild(card1)
    │   │   ├─ createCaseCard(item2, 1)
    │   │   ├─ grid.appendChild(card2)
    │   │   └─ ...
    │   └─ 더보기 버튼 표시 (6 < 10)
    │
    └─ renderTabData('admin')
        └─ (같은 방식으로 6개 생성)

// 5. 화면 결과
// 클라우드 탭: 6개 카드 + 더보기 버튼
// 행정 탭: 6개 카드 (숨겨짐) + 더보기 버튼
더보기 버튼 클릭 시
javascript
// 사용자가 클라우드 더보기 클릭
handleLoadMore('cloud')
    ↓
AppState.cloudDisplayCount = 6 + 6 = 12
    ↓
renderTabData('cloud')
    ├─ grid.innerHTML = ''  (기존 6개 삭제)
    ├─ displayData = cloudData.slice(0, 12)  (12개 추출)
    ├─ forEach로 12번 반복
    │   └─ 12개 카드 생성
    └─ 더보기 버튼 표시 (12 < 10? 아님 → 숨김)

// 결과: 12개 카드 표시, 더보기 버튼 없음
💡 핵심 정리
1. filterDataByCategory()
✅ 전체 데이터를 category 기준으로 분류
✅ cloudData와 adminData에 저장
✅ 하나의 항목이 양쪽에 모두 들어갈 수 있음
2. renderAllData()
✅ 페이지 최초 로드 시 호출
✅ 표시 개수를 6개로 초기화
✅ 두 탭 모두 렌더링 (하나는 숨김)
3. renderTabData(tab)
✅ 특정 탭의 카드들을 화면에 표시
✅ displayCount만큼만 표시
✅ 더보기 버튼 표시/숨김 제어
4. createCaseCard(item, index)
✅ 데이터 객체를 HTML 카드로 변환
✅ 이미지, 제목, 설명, 태그 포함
✅ 애니메이션 딜레이 적용
✅ 클릭 이벤트 추가
이 4개 함수가 완벽하게 조화를 이루어 동적인 카드 그리드 시스템을 만듭니다! 🎨





Claude는 AI이며 실수할 수 있습니다. 응답을 다