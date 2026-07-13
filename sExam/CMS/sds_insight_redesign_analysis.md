# 삼성SDS 인사이트 리포트 페이지 웹디자인 리뉴얼 분석 보고서

본 보고서는 `samsungsds.com/kr/insights/index.html` 페이지의 웹디자인을 `https://ssssyyy.dothome.co.kr/insight/report.html` 스타일로 변경할 때, 기존의 기능(카테고리 선택, 검색창 추천어 작동 및 선택, 최신순/정확도순 정렬)이 마크업 변경 후에도 이전과 동일하게 올바르게 동작하도록 하기 위해 수정해야 하는 **HTML, CSS, JavaScript** 영역에 대한 상세 분석 내용입니다.

---

## 1. 카테고리 선택 기능 (Category Selection)

### 기존 디자인 vs 신규 디자인 개요
*   **기존 디자인:** 가로 형태의 나열형 탭 버튼 구조 (`전체`, `AX`, `클라우드` 등). 활성화 시 부모 `<li>`에 `.on` 클래스가 추가되고 `<a>` 태그의 `aria-pressed` 속성이 `true`로 설정됨.
*   **신규 디자인:** `주제` 등의 아코디언 드롭다운 버튼 클릭 시 하단에 체크박스 형태의 메뉴 리스트가 노출되는 구조 (`전체선택`, `AX`, `클라우드` 등).

### 마크업 변경 및 JS 연동 수정 사항

#### [기존 HTML 구조]
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
            <!-- 생략 -->
        </ul>
    </div>
</div>
```

#### [신규 HTML 구조 제안 (드롭다운 & 체크박스)]
```html
<div class="dropdown topic_dropdown">
    <button type="button" class="dropdown_btn" id="topicBtn" aria-haspopup="true" aria-expanded="false">주제</button>
    <div class="dropdown_menu" id="topicMenu">
        <ul class="checkbox_list">
            <li>
                <input type="checkbox" id="topic_all" class="check_all" checked>
                <label for="topic_all">전체선택</label>
            </li>
            <li>
                <input type="checkbox" id="topic_ax" name="topic" value="AX">
                <label for="topic_ax">AX</label>
            </li>
            <li>
                <input type="checkbox" id="topic_cloud" name="topic" value="클라우드">
                <label for="topic_cloud">클라우드</label>
            </li>
            <!-- 기타 카테고리 항목들 -->
        </ul>
    </div>
</div>
```

#### [JavaScript 수정 방향]
기존 스크립트는 `li.category_item a` 요소들을 선택하여 클릭 이벤트를 바인딩하고 있습니다. 마크업이 체크박스로 전환됨에 따라 다음과 같이 이벤트를 수정해야 합니다.

1.  **선택자 정의 변경:**
    *   기존: `const cateButtons = document.querySelectorAll('li.category_item a');`
    *   변경: `const cateCheckboxes = document.querySelectorAll('.checkbox_list input[type="checkbox"]:not(.check_all)');` 및 `const allCheckbox = document.querySelector('.check_all');`
2.  **이벤트 핸들러 수정:**
    *   `click` 이벤트 대신 체크박스의 `change` 이벤트를 모니터링합니다.
    *   `aria-pressed="true/false"` 및 부모 `li`의 `.on` 클래스 추가/제거 대신, 체크박스의 `checked` 상태를 직접 판단합니다.
3.  **"전체선택" 토글 로직 구현:**
    *   `전체선택`이 체크될 경우: 개별 체크박스들을 모두 해제(`checked = false`)하고 `selectedEyebrows` 배열을 비운 뒤 `renderCateArticles("all")`을 호출합니다.
    *   개별 카테고리가 체크될 경우: `전체선택` 체크를 해제(`checked = false`)하고, 체크된 카테고리의 텍스트를 수집하여 `selectedEyebrows`에 담은 후 `renderCateArticles()`를 실행합니다. 만약 모든 개별 체크박스가 해제되면 다시 `전체선택`을 체크 처리합니다.

```javascript
// JS 수정 예시 코드
document.addEventListener("DOMContentLoaded", () => {
    const allCheckbox = document.querySelector('.check_all');
    const cateCheckboxes = document.querySelectorAll('.checkbox_list input[type="checkbox"]:not(.check_all)');
    
    // 전체선택 핸들러
    allCheckbox.addEventListener('change', function() {
        if (this.checked) {
            document.getElementById('notice_keyword').value = "";
            cateCheckboxes.forEach(cb => {
                cb.checked = false;
            });
            selectedEyebrows = [];
            renderCateArticles("all");
        } else {
            // 전체선택이 해제되었을 때 최소한 하나의 카테고리는 선택되도록 강제하거나 전체보기로 유지
            this.checked = true; 
        }
    });

    // 개별 체크박스 핸들러
    cateCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            let checkedItems = document.querySelectorAll('.checkbox_list input[type="checkbox"]:not(.check_all):checked');
            
            if (checkedItems.length > 0) {
                allCheckbox.checked = false;
                selectedEyebrows = [];
                checkedItems.forEach(item => {
                    // label 텍스트 혹은 value 추출
                    const labelText = document.querySelector(`label[for="${item.id}"]`).textContent;
                    selectedEyebrows.push(labelText);
                });
                
                if (document.getElementById('notice_keyword').value.trim() !== "") {
                    document.getElementsByClassName('btn_sch_ip')[0].click();
                } else {
                    renderCateArticles();
                }
            } else {
                // 아무것도 체크되지 않았으면 전체선택으로 회귀
                allCheckbox.checked = true;
                allCheckbox.dispatchEvent(new Event('change'));
            }
        });
    });
});
```

### CSS 추가/수정 사항
*   드롭다운 버튼(`dropdown_btn`) 클릭 시 드롭다운 메뉴(`dropdown_menu`)를 노출하기 위해 `.active` 또는 `.show` 클래스를 제어하는 스타일을 정의합니다.
*   체크박스 디자인을 브라우저 기본 디자인 대신 맞춤형 체크박스로 스타일링하여 깔끔한 모던 웹 디자인 룩을 유지합니다.

---

## 2. 검색창 클릭 시 추천어 노출 및 추천어 선택 (Search Recommendations)

### 기존 디자인 vs 신규 디자인 개요
*   **기존 디자인:** 검색창 포커스 시 인기검색어가 세로 목록 형태로 노출되며, 닫기 버튼이 포함된 박스 형태(`sch_quick`)가 하단에 나타남.
*   **신규 디자인:** 검색창 포커스 또는 클릭 시, "추천 검색어" 영역에 키워드들이 가로 형태의 둥근 알약(Pill/Tag) 형태로 나열되는 오버레이 형태.

### 마크업 변경 및 JS 연동 수정 사항

#### [기존 HTML & 템플릿 구조]
*   기존에는 JS의 `popwordTemplate` 함수가 `<ul>`과 `<li>` 구조의 마크업을 동적으로 생성하여 `#sch_quick` 내부에 밀어 넣는 방식이었습니다.

#### [JavaScript 템플릿 함수 변경]
가로형 태그 디자인을 위해 동적 마크업 템플릿인 `popwordTemplate` 및 `autoCompleteTemplete`을 신규 마크업에 맞추어 버튼 혹은 링크 배지 스타일로 변경해야 합니다.

```javascript
// 기존의 세로 list형 템플릿을 신규 가로 Pill형 구조로 변경
function popwordTemplate(data) {
    var html = '';
    var popwordDpCnt = data.length > 10 ? 10 : data.length; // 추천어 개수 제한 설정

    html += '<p class="tit">추천 검색어</p>' +
            '<div class="recommended_tags">';

    for (var i = 0; i < popwordDpCnt; i++) {
        var originWord = data[i].query.indexOf('  ') > 0 ? data[i].query.split('  ')[1] : data[i].query.split(' ')[0];
        // <a> 태그 대신 스타일링이 편한 <button>을 사용하거나, 기존 이벤트를 유지하기 위해 동일 데이터 바인딩
        html += '<button type="button" class="tag_btn" data-keyword="' + originWord + '">' + originWord + '</button>';
    }

    html += '</div>';
    return html;
}
```

#### [이벤트 리스너 변경]
*   기존에는 추천 검색어 클릭 시 `$(document).on('click', '#searchResult > li > a', ...)`로 바인딩되어 있었습니다.
*   수정 후에는 새로 생성된 태그 클래스에 맞게 위임 이벤트를 변경해야 합니다.

```javascript
// 기존 이벤트를 신규 클래스(.tag_btn)에 매핑하도록 변경
$(document).on('click', '.recommended_tags .tag_btn', function() {
    var keyword = $(this).data('keyword');
    $("#notice_keyword").val(keyword);
    searchStart(keyword, searchCallBack);
    SDS_COMMON.search.close(); // 추천어 박스 닫기
});
```

### CSS 추가/수정 사항
추천 검색어 오버레이 디자인 및 알약 형태의 태그 스타일링을 CSS에 추가합니다.

```css
/* 추천 검색어 컨테이너 */
.recommended_tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 12px 16px;
}

/* 태그 버튼 디자인 */
.recommended_tags .tag_btn {
    background-color: #f1f6ff;
    color: #0056ff;
    border: none;
    border-radius: 20px;
    padding: 8px 14px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.1s;
}

.recommended_tags .tag_btn:hover {
    background-color: #e0ecff;
    transform: translateY(-1px);
}
```

---

## 3. 최신순 / 정확도순 정렬 기능 (Sorting)

### 기존 디자인 vs 신규 디자인 개요
*   **기존 디자인:** 우측 상단 셀렉트 박스(`#optSort` 버튼과 `#selBoxSchOrderby` 레이어 리스트). 클릭 시 클래스 제어로 열림/닫힘 제어.
*   **신규 디자인:** `정렬`이라는 이름의 드롭다운 영역으로 디자인이 더욱 슬림하고 모던하게 배치되어 있으며 클릭 시 하위 옵션이 보여짐.

### 마크업 변경 및 JS 연동 수정 사항

#### [기존 HTML 구조]
```html
<div class="searchSort_select event_select">
    <strong class="blind">리스트 정렬 기준</strong>
    <div class="select_box">
        <button type="button" id="optSort" class="select_btn" role="combobox" aria-haspopup="listbox" ...>
            <span>정확도순</span>
        </button>
        <ul id="selBoxSchOrderby" class="list" role="listbox" ...>
            <li><a href="#" id="option_recom" class="link_comm" role="option">정확도순</a></li>
            <li><a href="#" id="option_recent" class="link_comm" role="option">최신순</a></li>
        </ul>
    </div>
</div>
```

#### [신규 HTML 구조 제안]
```html
<div class="dropdown sort_dropdown">
    <button type="button" class="dropdown_btn" id="sortBtn" aria-haspopup="true" aria-expanded="false">
        <span>정렬</span>
    </button>
    <ul class="dropdown_menu sort_menu" id="sortMenu">
        <li><button type="button" class="sort_option" data-sort="option_recent">최신순</button></li>
        <li><button type="button" class="sort_option" data-sort="option_recom">정확도 순</button></li>
    </ul>
</div>
```

#### [JavaScript 수정 방향]
기존 스크립트는 `#selBoxSchOrderby > li`의 클릭 이벤트를 감지하고 있습니다. 신규 마크업에 맞추어 다음과 같이 갱신합니다.

```javascript
// 정렬 옵션 클릭 시 동작
$(document).on('click', '.sort_option', function() {
    searchOrderby = $(this).data('sort');
    
    // 버튼 텍스트 변경
    $('#sortBtn span').text($(this).text());
    
    // 드롭다운 닫기
    $('.sort_dropdown').removeClass('active');
    
    var keyword = $("#notice_keyword").val();
    if(keyword.trim() != "") {
        // 검색어가 있으면 서버(ElasticSearch) 재정렬 검색 요청
        searchStart(keyword, searchCallBack);
    } else {
        // 검색어가 없고 카테고리만 선택된 상태일 때 프론트엔드 자체 정렬 실행
        if (searchOrderby === "option_recent") {
            if (lang === 'en') {
                insightArtList = _.sortBy(insightArtList, 'dateValue').reverse();
            } else {
                insightArtList = _.sortBy(insightArtList, 'releaseDate').reverse();
            }
        }
        renderCateArticles(); // 화면에 아티클 리스트 재렌더링
    }
});
```

### CSS 추가/수정 사항
*   드롭다운 버튼과 리스트 레이어의 배치 및 여백 정렬을 맞춰 신규 슬림형 정렬 바 스타일을 표현합니다.

---

## 4. 공통 드롭다운 스타일링 및 이벤트 제어 (CSS & JS)

신규 디자인의 카테고리(`주제`, `산업`), 정렬(`정렬`) 탭은 모두 클릭 시 하위 레이어가 노출되는 **드롭다운 형태**로 통일되어 있습니다. 이를 위해 공통 드롭다운 동작을 보장하는 스크립트와 스타일이 필수적입니다.

### [공통 드롭다운 JS 제어]
```javascript
document.addEventListener("DOMContentLoaded", () => {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const btn = dropdown.querySelector('.dropdown_btn');
        
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // 다른 활성화된 드롭다운은 닫음
            dropdowns.forEach(other => {
                if (other !== dropdown) {
                    other.classList.remove('active');
                    other.querySelector('.dropdown_btn').setAttribute('aria-expanded', 'false');
                }
            });
            
            const isActive = dropdown.classList.toggle('active');
            btn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        });
    });
    
    // 외부 클릭 시 모든 드롭다운 닫기
    document.addEventListener('click', () => {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
            dropdown.querySelector('.dropdown_btn').setAttribute('aria-expanded', 'false');
        });
    });
});
```

### [공통 드롭다운 CSS 스타일 제안]
```css
/* 드롭다운 부모 컨테이너 */
.dropdown {
    position: relative;
    display: inline-block;
}

/* 드롭다운 버튼 스타일 */
.dropdown_btn {
    background: none;
    border: none;
    font-size: 15px;
    color: #333;
    padding: 8px 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
}

.dropdown_btn::after {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-bottom: 2px solid #555;
    border-right: 2px solid #555;
    transform: rotate(45deg) translateY(-2px);
    transition: transform 0.2s ease;
}

/* 드롭다운 활성화 시 화살표 회전 */
.dropdown.active .dropdown_btn::after {
    transform: rotate(-135deg) translateY(-2px);
}

/* 드롭다운 메뉴 스타일 */
.dropdown_menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 100;
    min-width: 160px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin-top: 8px;
    padding: 8px 0;
}

/* 활성화 시 노출 */
.dropdown.active .dropdown_menu {
    display: block;
}
```
