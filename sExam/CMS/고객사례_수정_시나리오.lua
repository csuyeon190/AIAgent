삼성SDS 고객사례 페이지 소스 코드를 분석하여, URL 파라미터(?cateparam=클라우드)를 넘겨주었을 때 해당 카테고리 버튼이 활성화되고 관련 고객사례 리스트가 필터링되도록 수정해야 할 코드와 그 상세 분석 내용을 설명해 드리겠습니다.

1. 웹 소스 동작 방식 분석 (기존 로직)
데이터의 비동기 로딩: 페이지가 로드되면 DOMContentLoaded 이벤트 시점에 loadCaseStudy() 함수가 호출되어 서버로부터 기사 데이터를 비동기(fetchData(dataUrl))로 가져오고 화면에 초기 리스트를 렌더링합니다.
카테고리 버튼 정의: 카테고리 버튼들은 li.category_item button 엘리먼트로 정의되어 있으며, const cateButtons = document.querySelectorAll('li.category_item button');으로 참조되고 있습니다.
필터링 메커니즘: 각 버튼에는 click 이벤트 리스너가 등록되어 있어 클릭 시 다음과 같은 과정이 수행됩니다.
클릭된 카테고리 버튼에 on 클래스를 추가하고 aria-pressed="true" 상태로 변경합니다. (전체 버튼은 비활성화)
활성화된 카테고리의 텍스트(예: "클라우드")를 selectedEyebrows 배열에 수집합니다.
renderCateArticles() 함수를 실행하여 selectedEyebrows에 매칭되는 데이터를 필터링하고 화면을 다시 렌더링(contentRender)합니다.
따라서 가장 안전하고 중복 없는 수정 방법은 비동기 데이터 로딩이 완료된 시점에 URL 파라미터를 읽어와 해당 카테고리 버튼을 강제로 클릭(click())하게 만드는 것입니다. 이렇게 하면 기존의 UI 활성화 및 필터링 렌더링 로직을 그대로 재사용할 수 있습니다.

2. 수정해야 할 소스 코드
데이터가 완전히 로드되고 초기 렌더링이 수행되는 loadCaseStudy() 함수 내 비동기 콜백 마지막 부분(loading_stop(); 바로 아래)에 파라미터 처리 코드를 추가합니다.

[수정 대상 파일]
case_study/index.html (또는 해당 페이지의 스크립트 영역)
[코드 수정본 (Diff)]
diff
function loadCaseStudy() {
         // $.getJSON($dataUrl, function (result) {
         fetchData(dataUrl).then((result) =>{
             if(result.data && result.data.length>0 ){
                 totalData = result.data;
                 filterData(totalData);
                 //currentData = totalData;
 
                 document.querySelector('em.emph_count').textContent = currentData.length;
                 document.querySelector(".grp_conts_filter").querySelector(".txt_l").textContent = txt_total;
             }
             isLocationHash();
             contentRender(currentData, cpage);
             // if (scroll > 0) {
             //     $('html,body').animate({scrollTop: scroll}, 100);
             //     scroll = 0;
             // }
             
             loading_stop();
+
+            // URL 파라미터(?cateparam=...) 분석 및 버튼 클릭 처리
+            const urlParams = new URLSearchParams(window.location.search);
+            const cateParam = urlParams.get('cateparam');
+            
+            if (cateParam) {
+                // 카테고리 버튼 중 텍스트가 파라미터 값과 일치하는 버튼 검색
+                const targetBtn = Array.from(cateButtons).find(btn => {
+                    const span = btn.querySelector('span');
+                    return span && span.textContent.trim() === cateParam.trim();
+                });
+                
+                // 일치하는 카테고리 버튼이 있다면 강제로 클릭 이벤트 발생
+                if (targetBtn) {
+                    targetBtn.click();
+                }
+            }
         });
     }
3. 추가된 코드 상세 분석 및 설명
new URLSearchParams(window.location.search)
현재 브라우저 창의 URL 뒤에 붙은 쿼리 스트링(?cateparam=클라우드)을 쉽게 분석할 수 있도록 해주는 모던 브라우저 표준 API 객체입니다.
urlParams.get('cateparam')
cateparam이라는 이름의 쿼리 키값을 읽어옵니다. 만약 URL이 ...?cateparam=클라우드 라면 cateParam 변수에는 "클라우드"가 문자열로 저장됩니다.
Array.from(cateButtons).find(...)
문서에 정의된 카테고리 버튼 목록(cateButtons)을 배열로 변환한 뒤, 내부의 <span> 태그 텍스트가 파라미터 값(예: "클라우드")과 일치하는 버튼 엘리먼트를 찾습니다.
trim()을 사용하여 공백 유무에 따른 오작동을 방지합니다.
targetBtn.click()
찾은 버튼 엘리먼트에 강제로 클릭 이벤트를 트리거합니다.
이렇게 하면 버튼에 등록되어 있는 기존 이벤트 리스너가 그대로 동작하여, ① 버튼 활성화(클래스 on 추가, aria-pressed="true" 변경, '전체' 해제), ② selectedEyebrows 데이터 필터링 및 리스트 갱신이 추가 연산 없이 유기적으로 완료됩니다.
위치 선택의 이유 (loading_stop(); 직후)
데이터 로드 과정이 비동기(fetchData().then(...))로 작동하기 때문에, 데이터가 모두 불러와지고 화면의 기본 구조 렌더링이 완료된 다음에 버튼 클릭을 발생시켜야 데이터 유실이나 렌더링 오류 없이 정상적으로 필터링이 동작합니다.