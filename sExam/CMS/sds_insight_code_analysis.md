# 삼성SDS 인사이트 리포트 페이지 핵심 기능 코드 분석 보고서

본 분석은 로컬 작업공간의 [insights.html](file:///c:/Users/guidi/Documents/cms_project/insights.html) 파일을 바탕으로, 다음 3가지 핵심 기능이 구현되어 동작하는 내부 메커니즘을 상세 분석한 내용입니다.

1.  **카테고리 선택 (Category Selection)**
2.  **검색창 입력 시 추천어/자동완성 노출 및 추천어 선택 (Search Suggestions & Auto-Complete)**
3.  **최신순 / 정확도순 정렬 (Sorting: Latest vs Accuracy)**

---

## 1. 카테고리 선택 기능 (Category Selection)

카테고리 선택은 사용자가 여러 분야(AX, 클라우드, 보안 등)의 아티클을 선택 필터링하여 리스트에 출력하는 기능입니다. 

### 관련 HTML 코드 ([insights.html:L538-620](file:///c:/Users/guidi/Documents/cms_project/insights.html#L538-L620))
```html
<div class="category_wrap">
    <div class="category_inner">
        <p class="md_tit">카테고리</p>
        <ul class="list">
            <li class="category_item">
                <a href="#" role="button" aria-pressed="true" data-type="all"><span>전체</span></a>
            </li>
            <li class="category_item">
                <a href="#" role="button" aria-pressed="false"><span>AX</span></a>
            </li>
            <!-- ... 중략 ... -->
        </ul>
    </div>
</div>
```

### 동작 핵심 변수 ([insights.html:L1083-L1179](file:///c:/Users/guidi/Documents/cms_project/insights.html#L1083-L1179))
*   `selectedEyebrows = []`: 사용자가 선택한 카테고리명(텍스트)을 동적으로 담아두는 배열입니다.
*   `cateButtons`: 모든 카테고리 `<a>` 링크 요소를 선택한 NodeList입니다. (`document.querySelectorAll('li.category_item a')`)
*   `allBtn`: 첫 번째 카테고리 요소인 "전체" 버튼입니다.

### 동작 시퀀스 ([insights.html:L1201-1262](file:///c:/Users/guidi/Documents/cms_project/insights.html#L1201-L1262))
사용자가 카테고리 버튼을 클릭하면 `click` 이벤트 핸들러가 실행됩니다.

1.  **"전체" 버튼 클릭 시 (`data-type="all"`):**
    *   검색창 입력을 초기화합니다: `document.getElementById('notice_keyword').value = "";`
    *   클릭된 "전체" 버튼의 부모 `<li>`에 `.on` 클래스를 추가하고, `aria-pressed`를 `"true"`로 만듭니다.
    *   나머지 다른 모든 카테고리 버튼들의 부모 `<li>`에서 `.on` 클래스를 제거하고, `aria-pressed`를 `"false"`로 초기화합니다.
    *   `renderCateArticles("all")`을 호출하여 모든 아티클을 가져와 렌더링합니다.
2.  **개별 카테고리 버튼 클릭 시:**
    *   "전체" 버튼의 활성화 상태(`.on` 클래스, `aria-pressed="true"`)를 즉시 해제합니다.
    *   클릭된 개별 카테고리 요소의 부모 `<li>` 클래스 `.on`을 토글하고, 이에 따라 `aria-pressed`의 값을 `"true"` 또는 `"false"`로 변경합니다.
    *   전체 카테고리 리스트(`tmpArr`)를 순회하면서 `aria-pressed`가 `"true"`인 카테고리의 텍스트(예: "AX", "클라우드")를 찾아 `selectedEyebrows` 배열에 추가합니다.
    *   **검색창 키워드가 비어있지 않은 경우:** 카테고리 필터링이 적용된 검색 결과를 다시 가져오기 위해 검색 실행 버튼(`.btn_sch_ip`)을 프로그래밍 방식으로 클릭하여 백엔드 검색을 재시작합니다.
    *   **검색창 키워드가 비어있는 경우:** 로컬에서 `selectedEyebrows`에 해당하는 데이터만 필터링하여 출력하는 `renderCateArticles()`를 실행합니다.

---

## 2. 검색창 클릭 시 추천어/자동완성 노출 및 선택 (Search Suggestions)

검색창 클릭 또는 키워드 입력 시 사용자에게 관련 인기 검색어 또는 자동완성 리스트를 제안하는 영역입니다.

### 관련 HTML 코드 ([insights.html:L514-534](file:///c:/Users/guidi/Documents/cms_project/insights.html#L514-L534))
```html
<div class="sch_box" id="sch_box_id" ...>
    <div class="sch_ip">
        <input type="text" id="notice_keyword" placeholder="검색어를 입력하세요" ... autocomplete="off">
        <button type="button" class="btn_sch_ip">search</button>
    </div>
    <div class="inner_sch_quick">
        <div class="sch_quick no_list dpn" id="sch_quick">
            <!-- 동적으로 추천검색어/자동완성 목록이 이곳에 주입됨 -->
        </div>
    </div>
</div>
```

### 동작 시퀀스

#### A. 검색창 Focus 시 (추천어 노출) ([insights.html:L1893-1899](file:///c:/Users/guidi/Documents/cms_project/insights.html#L1893-L1899))
1.  사용자가 검색창(`#notice_keyword`)을 포커싱(클릭)합니다.
2.  `SDS_COMMON.search.open()`이 호출되어 검색창 컨테이너에 상태 클래스를 더하고 오버레이를 열 준비를 합니다.
3.  `popularKeyword(keyword, e)` 함수가 호출되어 `/app/search/transnew.jsp`에 `transMode: 'popkeyword'` 파라미터로 AJAX 요청을 보냅니다.
4.  서버로부터 인기 검색어 리스트(`data`)를 수신하면 `popwordTemplate(data)` 함수로 `<ul>/<li>` 형식의 HTML 스트링을 생성하여 `#sch_quick` 영역의 내부 HTML로 삽입하고, 클래스 `.dpn` (Display: None)을 제거하여 화면에 노출합니다.

#### B. 검색창 글자 입력 시 (자동완성 기능) ([insights.html:L1937-1952](file:///c:/Users/guidi/Documents/cms_project/insights.html#L1937-L1952))
1.  키보드 `keyup` 이벤트가 발생합니다.
2.  입력값이 존재하고 엔터키가 아니면 `autoComplete(keyword)` 함수를 실행합니다.
3.  `/app/search/transnew.jsp`로 `transMode: 'autocomplete'` AJAX 요청을 호출합니다.
4.  받아온 결과 배열을 `autoCompleteTemplete(result, keywordLength)`를 통해 매칭 부분을 `<span class="point">`로 강조한 HTML로 변환하여 `#sch_quick`에 대입합니다.
5.  입력 내용이 지워져 빈 값이 되면 다시 `popularKeyword(keyword, e)`를 호출해 인기 검색어로 대체합니다.

#### C. 추천어 / 자동완성 선택 시 ([insights.html:L1929-1934](file:///c:/Users/guidi/Documents/cms_project/insights.html#L1929-L1934))
1.  사용자가 제안된 리스트 아이템을 클릭하면 위임된 이벤트 핸들러 `$(document).on('click', '#searchResult > li > a', ...)`가 실행됩니다.
2.  해당 태그의 `data-keyword` 값을 읽어와 검색 입력창(`#notice_keyword`)의 Value로 주입합니다.
3.  `searchStart(keyword, searchCallBack)`를 실행하여 신규 검색 로직을 구동합니다.
4.  `SDS_COMMON.search.close()`를 통해 추천어 레이어 창을 닫습니다.

---

## 3. 최신순 / 정확도순 정렬 기능 (Sorting)

아티클 목록을 보여줄 때 정확도가 높은 순서 또는 최신 날짜 순서로 데이터를 정렬하는 기능입니다.

### 관련 HTML 코드 ([insights.html:L638-654](file:///c:/Users/guidi/Documents/cms_project/insights.html#L638-L654))
```html
<div class="searchSort_select event_select">
    <div class="select_box">
        <button type="button" id="optSort" class="select_btn" ...>
            <span>정확도순</span>
        </button>
        <ul id="selBoxSchOrderby" class="list" ...>
            <li><a href="#" id="option_recom" class="link_comm" role="option">정확도순</a></li>
            <li><a href="#" id="option_recent" class="link_comm" role="option">최신순</a></li>
        </ul>
    </div>
</div>
```

### 동작 시퀀스 ([insights.html:L1973-1983](file:///c:/Users/guidi/Documents/cms_project/insights.html#L1973-L1983))

#### A. 사용자가 정렬 레이어에서 정렬 조건 클릭 시:
1.  클릭한 `<a>` 태그의 `id`값(`option_recent` 또는 `option_recom`)을 읽어와 `searchOrderby` 변수에 대입합니다.
2.  `#optSort` 버튼 태그의 `data-option` 속성을 갱신하고, 버튼 내 스팬 텍스트를 선택한 텍스트로 수정합니다.
3.  **검색창 입력 키워드가 존재할 경우 (서버 기반 검색 정렬):**
    *   `searchStart(keyword, searchCallBack)`를 다시 시작합니다.
    *   `getSearchFormData(keyword)` 내에서 정렬 값에 따라 Elasticsearch 정렬 쿼리 설정을 동적으로 가공합니다.
        *   `option_recent` (최신순): `regdate` (등록일) 내림차순 정렬 우선 적용
        *   기타 (정확도순): `_score` (매칭 정밀도 점수) 내림차순 정렬 우선 적용
    *   서버에 요청하여 정렬이 가미된 결과 리스트를 응답받아 화면을 재구성합니다.
4.  **검색창 키워드가 비어있는 경우 (로컬 카테고리 필터링 상태 정렬):**
    *   [insights.html:L1485-1491](file:///c:/Users/guidi/Documents/cms_project/insights.html#L1485-L1491)의 로컬 필터링 렌더러 `renderCateArticles()`가 담당합니다.
    *   카테고리가 눌려 검색어가 없는 조건이면 무조건 최신 등록일 순 정렬이 적용됩니다.
    *   Lodash 라이브러리를 사용하여 프론트 영역에서 직접 수신하고 있던 로컬 배열(`insightArtList`)을 정렬 처리합니다.
        ```javascript
        if(lang=='en'){
            insightArtList = _.sortBy(insightArtList, 'dateValue').reverse();
        }else{
            insightArtList = _.sortBy(insightArtList, 'releaseDate').reverse();
        }
        ```
