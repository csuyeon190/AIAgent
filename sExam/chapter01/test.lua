웹 보안과 관련하여 XSSCheck 체크를 하려고 합니다. url  검사를 할 때 뒤에 붙은 쿼리 스트링만 하면 되나요?


XSS 체크 시 검사 범위
쿼리 스트링만 검사하면 충분하지 않습니다. XSS 공격은 다양한 입력 경로를 통해 발생하기 때문에, 아래 모든 영역을 검사해야 합니다.

🔍 검사해야 할 전체 범위
1. URL 관련

Query String → ?name=<script>alert(1)</script> ✅ (알고 계신 부분)
URL Path → /search/<script>alert(1)</script>/result
URL Fragment (Hash) → #<img src=x onerror=alert(1)> (서버엔 안 가지만 JS로 처리 시 위험)
2. HTTP 요청 바디

POST 폼 데이터 → username=<script>...</script>
JSON 바디 → {"name": "<svg onload=alert(1)>"}
Multipart 데이터 (파일 이름 등)
3. HTTP 요청 헤더

Referer, User-Agent, Cookie, X-Forwarded-For 등
이 값들이 서버에서 HTML로 출력될 경우 XSS 가능
4. 저장형(Stored) XSS 입력값

DB에 저장되는 모든 사용자 입력 (댓글, 프로필, 게시글 등)
💡 결론
입력 경로	XSS 위험
Query String	✅ 높음
URL Path	✅ 있음
POST Body	✅ 높음
HTTP Header	⚠️ 상황에 따라
Hash Fragment	⚠️ 클라이언트 측 처리 시
핵심 원칙: 사용자 입력이 HTML/JS로 출력되는 모든 곳을 검사해야 합니다.

실무 팁
XSS 검사를 구현한다면, 입력값이 어디서 들어오든 출력 전에 이스케이프 처리하는 것이 더 근본적인 방어입니다:

javascript
// 예: Node.js에서 출력 시 이스케이프
const escapeHtml = (str) => str
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#x27;");
어떤 프레임워크나 환경에서 XSS 체크를 구현하려고 하시나요? 더 구체적으로 도와드릴 수 있습니다!

url 전체를 해야하나요?


URL에서 XSS 검사 범위
현실적으로는 URL 전체를 검사하는 것이 맞지만, 각 부분별 위험도가 다릅니다.

URL 구조별 위험도
https://example.com/path/value?name=test&id=123#hash
         ↑              ↑        ↑              ↑
       Host           Path    Query String    Fragment
     (검사불필요)    (검사필요)  (검사필요)    (상황따라)
부분	검사 필요?	이유
Protocol/Host	❌ 불필요	XSS 삽입 불가
Path	✅ 필요	/board/<script>/view 같은 공격 가능
Query String	✅ 필요	가장 흔한 공격 경로
Fragment (#)	⚠️ 조건부	서버엔 전송 안 됨, JS로 처리할 때만 위험
실무적 접근
서버 사이드 검사라면 → Path + Query String 검사로 충분

/path/value?key=value  ← 이 부분만 검사
클라이언트 사이드 검사라면 → Fragment(#) 도 추가

간단한 예시
javascript
function xssCheck(url) {
  const parsed = new URL(url);
  
  // Path 검사
  const path = parsed.pathname;
  
  // Query String 검사
  const params = parsed.searchParams;
  
  // Fragment 검사 (필요 시)
  const hash = parsed.hash;
  
  const xssPattern = /<[^>]*>|javascript:|on\w+=/gi;
  
  return xssPattern.test(path) || 
         [...params.values()].some(v => xssPattern.test(v));
}
보통 Query String이 90% 이상의 XSS 공격 경로이므로, 최소한 Query String은 반드시, Path도 함께 검사하는 것을 권장합니다!

documant.location과 document.search중 document.search 만 하면 될까요?


document.location vs location.search
location.search만 하면 충분하지 않습니다.

각각 담고 있는 정보
https://example.com/path/value?name=test#hash
                     ↑          ↑        ↑
              location.pathname  location.search  location.hash
속성	값	XSS 위험
location.pathname	/path/value	✅ 있음
location.search	?name=test	✅ 있음
location.hash	#hash	✅ 있음 (클라이언트 처리 시)
location.href	URL 전체	위 전부 포함
그래서 클라이언트에서 검사한다면
javascript
// ❌ 이것만으론 부족
location.search

// ✅ 이렇게 전체를 검사하거나
location.href

// ✅ 또는 각각 나눠서
location.pathname + location.search + location.hash

javascript

document.location     // ✅ location 객체 전체
location.search       // ✅ 쿼리스트링만 (?포함)
window.location.search // ✅ 동일
결론: 최소한 location.pathname + location.search, 가능하면 location.href로 전체를 검사하는 것이 안전합니다!



코드 분석 및 개선점
🚨 현재 코드의 문제점
1. XSSCheck 함수가 너무 허술함

javascript
// 현재: 단순 특수문자 제거만
str.replace(/\<|\>|\"|\'|\%|\;/g, "");
javascript:, onerror=, onload= 같은 패턴은 전혀 막지 못합니다.

2. decodeURIComponent 이중 디코딩 위험

javascript
// 공격자가 이중 인코딩으로 우회 가능
// %253Cscript%253E → 1차 decode → %3Cscript%3E → 2차 decode → <script>
decodeURIComponent(decodeURIComponent(param))
3. utm_source != "" 조건 문제

javascript
// null이어도 통과됨
utm_source != ""   // null != "" → true ❌
4. URL에 그대로 값을 붙이는 위험

javascript
// href에 검증 없이 값을 붙임
$(this).attr('href', $(this).attr('href') + addParmStr);
✅ 개선된 코드
javascript
$(document).ready(function () {
  const url = new URL(window.location.href);
  const param = new URLSearchParams(url.search);

  // ✅ 이중 디코딩 제거, 한 번만 디코딩
  const decodedParam = decodeURIComponent(param.toString());
  const cleanParam = XSSCheck(decodedParam);
  const params = new URLSearchParams(cleanParam);

  // ✅ null 체크 강화
  const utm_source = params.get('utm_source');
  if (utm_source !== null && utm_source.trim() !== "") {

    // ✅ utm_ 파라미터만 허용 (화이트리스트)
    const allowedUtmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    const addParams = new URLSearchParams();

    for (const [key, value] of params) {
      if (allowedUtmKeys.includes(key)) {
        // ✅ 값도 개별 검증
        const cleanValue = XSSCheck(value);
        addParams.append(key, cleanValue);
      }
    }

    const addParmStr = addParams.toString() ? `?${addParams.toString()}` : '';

    if (addParmStr) {
      $('.utmLink').each(function () {
        const currentHref = $(this).attr('href') || '';

        // ✅ javascript: 같은 위험한 프로토콜 차단
        if (/^javascript:/i.test(currentHref)) return;

        // ✅ 이미 ? 가 있는 경우 처리
        const separator = currentHref.includes('?') ? '&' : '?';
        $(this).attr('href', currentHref + separator + addParams.toString());
      });
    }
  }
});

function XSSCheck(str) {
  if (typeof str !== 'string') return '';

  let newStr = str;

  // ✅ 위험 패턴 제거 (이벤트 핸들러, javascript:, 태그 등)
  newStr = newStr.replace(/javascript\s*:/gi, '');
  newStr = newStr.replace(/on\w+\s*=/gi, '');          // onerror=, onload= 등
  newStr = newStr.replace(/<\s*script[^>]*>.*?<\/script>/gi, '');
  newStr = newStr.replace(/<[^>]*>/g, '');              // 모든 HTML 태그
  newStr = newStr.replace(/[<>"';]/g, '');              // 특수문자

  return newStr;
}
📋 개선 요약
항목	기존	개선
XSS 패턴	특수문자 6개만 제거	javascript:, on*= 등 위험 패턴 추가
이중 디코딩	decode 2번 → 우회 가능	1번만 디코딩
null 체크	!= "" (null 통과)	!== null && trim() !== ""
utm 키 검증	없음	허용 키 화이트리스트
href 프로토콜	검증 없음	javascript: 차단
? 중복	항상 ? 붙임	기존 ? 여부 확인 후 처리
💡 더 강력한 보안이 필요하다면 DOMPurify 라이브러리 사용을 추천합니다!

더 자세하게 설명해주고, dompurify 라이브러리도 설명해줘.


코드 개선 상세 설명 + DOMPurify
1. 기존 코드 문제점 상세 분석
❌ 문제 1: 이중 디코딩 (Double Decoding)
javascript
// 기존 코드
let params = XSSCheck(decodeURIComponent(decodeURIComponent(param)));
```

**공격 시나리오:**
```
공격자가 URL에 이중 인코딩된 값을 삽입
?name=%2527%253Cscript%253Ealert(1)%253C%252Fscript%253E

1차 decode → %27%3Cscript%3Ealert(1)%3C%2Fscript%3E
2차 decode → '<script>alert(1)</script>'  ← XSS 성공!
왜 위험한가:

XSSCheck가 1차 디코딩 후 검사하기 전에 이미 2차 디코딩이 완료되면 악성 스크립트가 그대로 통과
이중 인코딩은 보안 필터를 우회하는 대표적인 기법
javascript
// ✅ 개선: 한 번만 디코딩
const decodedParam = decodeURIComponent(param.toString());
❌ 문제 2: XSSCheck 함수의 허점
javascript
// 기존 코드 - 단순 특수문자 제거
let newStr = str.replace(/\<|\>|\"|\'|\%|\;/g, "");
통과되는 공격 패턴들:

javascript
// 1. 이벤트 핸들러 방식 (꺽쇠 없이도 XSS 가능)
?name=something" onerror=alert(1) x="
// <, > 없으므로 필터 통과 → HTML에 삽입 시 실행됨

// 2. javascript: 프로토콜
?redirect=javascript:alert(document.cookie)
// 특수문자 없으므로 통과 → href에 삽입 시 실행됨

// 3. 대소문자 우회
?name=<SCRIPT>alert(1)</SCRIPT>
// 정규식이 소문자만 검사한다면 통과

// 4. 공백 삽입 우회
?name=<scr ipt>alert(1)</scr ipt>
// 공백으로 분리하면 단순 패턴 매칭 우회
✅ 개선된 XSSCheck:

javascript
function XSSCheck(str) {
  if (typeof str !== 'string') return '';
  
  let newStr = str;
  
  // 1단계: javascript: 프로토콜 제거 (대소문자, 공백 모두 처리)
  newStr = newStr.replace(/j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/gi, '');
  
  // 2단계: 이벤트 핸들러 제거 (onerror=, onload=, onclick= 등)
  newStr = newStr.replace(/on\w+\s*=/gi, '');
  
  // 3단계: script 태그 제거 (내용 포함)
  newStr = newStr.replace(/<\s*script[^>]*>[\s\S]*?<\/\s*script\s*>/gi, '');
  
  // 4단계: 모든 HTML 태그 제거
  newStr = newStr.replace(/<[^>]+>/g, '');
  
  // 5단계: 위험 특수문자 제거
  newStr = newStr.replace(/[<>"';]/g, '');
  
  return newStr;
}
❌ 문제 3: null 체크 오류
javascript
// 기존 코드
let utm_source = params.get('utm_source')
if(utm_source != ""){
문제:

javascript
params.get('utm_source')  
// utm_source 파라미터 자체가 없으면 → null 반환

null != ""  // → true ← 조건 통과해버림!
null != ""  // JS에서 null과 ""는 다른 값

// 결과: utm_source가 없어도 이후 로직이 실행됨
✅ 개선:

javascript
const utm_source = params.get('utm_source');
if (utm_source !== null && utm_source.trim() !== "") {
  // null도 아니고, 빈 문자열도 아닐 때만 실행
}
❌ 문제 4: href에 값을 그대로 붙이는 위험
javascript
// 기존 코드
$(this).attr('href', $(this).attr('href') + addParmStr);
문제 시나리오:

javascript
// 만약 기존 href가 이미 ? 를 포함하고 있다면?
href = "https://example.com/page?lang=ko"
addParmStr = "?utm_source=google"

// 결과
"https://example.com/page?lang=ko?utm_source=google"  // ❌ URL 깨짐

// 만약 href 자체가 javascript: 라면?
href = "javascript:void(0)"  // 악성 코드 실행 가능
✅ 개선:

javascript
$('.utmLink').each(function () {
  const currentHref = $(this).attr('href') || '';
  
  // javascript: 프로토콜 차단
  if (/^javascript:/i.test(currentHref)) return;
  
  // ? 중복 방지
  const separator = currentHref.includes('?') ? '&' : '?';
  $(this).attr('href', currentHref + separator + addParams.toString());
});
❌ 문제 5: utm_ 키 화이트리스트 없음
javascript
// 기존 코드: utm_ 으로 시작하면 무조건 허용
if(keyStr.startsWith("utm_")){
  addParmStr += `${key}=${value}&`;
}
```

**문제:**
```
?utm_<script>alert(1)</script>=malicious  
// utm_ 으로 시작하므로 통과 → 키 자체가 XSS 벡터가 됨
✅ 개선: 화이트리스트 방식

javascript
// 허용할 utm 키를 명시적으로 정의
const allowedUtmKeys = [
  'utm_source', 
  'utm_medium', 
  'utm_campaign', 
  'utm_term', 
  'utm_content'
];

for (const [key, value] of params) {
  if (allowedUtmKeys.includes(key)) {  // 정해진 키만 허용
    addParams.append(key, XSSCheck(value));
  }
}
2. DOMPurify 라이브러리
DOMPurify란?
DOM 기반 XSS 공격을 방어하기 위한 HTML Sanitization 라이브러리

Cure53에서 개발한 오픈소스
브라우저의 실제 DOM 파서를 사용하여 안전하게 HTML을 정제
GitHub 스타 15k+, 대형 서비스에서 널리 사용
직접 구현 vs DOMPurify 비교
javascript
// ❌ 직접 구현한 정규식 방식의 한계
str.replace(/<[^>]+>/g, '')
// 이런 우회 패턴을 모두 막기가 매우 어려움:
// <scr\x00ipt>
// <img src="x" onerror="alert(1)">
// <svg><animate onbegin=alert(1)>
// <<script>script>alert(1)<</script>/script>

// ✅ DOMPurify는 브라우저 DOM 파서로 실제 파싱 후 정제
// 우회가 거의 불가능
DOMPurify.sanitize(str)
설치 및 기본 사용법
html
<!-- CDN으로 사용 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.6/purify.min.js"></script>
bash
# npm으로 설치
npm install dompurify
javascript
// 기본 사용 - 위험한 HTML 제거
const dirty = '<script>alert(1)</script><b>굵은 텍스트</b>';
const clean = DOMPurify.sanitize(dirty);
// 결과: '<b>굵은 텍스트</b>'  ← script만 제거, 안전한 태그는 유지
다양한 옵션 사용법
javascript
// 1. 모든 HTML 태그 제거 (텍스트만 남김) ← URL 파라미터에 적합
DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] });
// '<script>alert(1)</script>hello' → 'hello'

// 2. 특정 태그만 허용
DOMPurify.sanitize(dirty, { 
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong'] 
});

// 3. 특정 속성만 허용
DOMPurify.sanitize(dirty, { 
  ALLOWED_TAGS: ['a'],
  ALLOWED_ATTR: ['href', 'title']  // onclick 같은 이벤트 핸들러 차단
});

// 4. HTML 태그 완전 제거 후 텍스트만
DOMPurify.sanitize(dirty, { 
  ALLOWED_TAGS: [], 
  ALLOWED_ATTR: [] 
});
현재 코드에 DOMPurify 적용
javascript
$(document).ready(function () {
  const url = new URL(window.location.href);
  const param = new URLSearchParams(url.search);
  
  // ✅ DOMPurify로 전체 파라미터 정제
  // URL 파라미터는 텍스트만 필요하므로 태그 전부 제거
  const cleanParamStr = DOMPurify.sanitize(
    decodeURIComponent(param.toString()), 
    { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }  // 텍스트만 남김
  );
  
  const params = new URLSearchParams(cleanParamStr);
  
  const utm_source = params.get('utm_source');
  if (utm_source !== null && utm_source.trim() !== "") {

    const allowedUtmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    const addParams = new URLSearchParams();

    for (const [key, value] of params) {
      if (allowedUtmKeys.includes(key)) {
        // ✅ 각 값도 개별적으로 DOMPurify 정제
        const cleanValue = DOMPurify.sanitize(value, { 
          ALLOWED_TAGS: [], 
          ALLOWED_ATTR: [] 
        });
        addParams.append(key, cleanValue);
      }
    }

    const addParmStr = addParams.toString();
    
    if (addParmStr) {
      $('.utmLink').each(function () {
        const currentHref = $(this).attr('href') || '';
        
        if (/^javascript:/i.test(currentHref)) return; // 프로토콜 차단
        
        const separator = currentHref.includes('?') ? '&' : '?';
        $(this).attr('href', currentHref + separator + addParmStr);
      });
    }
  }
});
DOMPurify가 막아주는 공격 예시
javascript
// 아래 공격들을 모두 자동으로 처리
DOMPurify.sanitize(`<script>alert(1)</script>`);           // → ''
DOMPurify.sanitize(`<img onerror=alert(1) src=x>`);        // → '<img src="x">'
DOMPurify.sanitize(`<svg><animate onbegin=alert(1)>`);     // → ''
DOMPurify.sanitize(`javascript:alert(1)`);                  // → ''
DOMPurify.sanitize(`<a href="javascript:alert(1)">click`); // → '<a>click</a>'
DOMPurify.sanitize(`<<script>script>alert(1)`);            // → ''
3. 최종 비교 요약
항목	기존 코드	개선 코드	DOMPurify 적용
이중 디코딩	❌ 위험	✅ 1회만	✅ 1회만
XSS 패턴 탐지	❌ 기본만	⚠️ 개선됐지만 우회 가능성	✅ 거의 완벽
null 체크	❌ 오류	✅ 정확	✅ 정확
utm 화이트리스트	❌ 없음	✅ 있음	✅ 있음
유지보수	❌ 직접 패턴 관리	❌ 직접 패턴 관리	✅ 라이브러리가 관리
신뢰도	낮음	중간	높음
결론: URL 파라미터 정제 목적이라면 DOMPurify를 { ALLOWED_TAGS: [] } 옵션과 함께 사용하는 것이 가장 안전하고 유지보수도 편합니다! 🛡️

