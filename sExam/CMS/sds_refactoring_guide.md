# 삼성SDS 인사이트 리포트 마크업 변경 및 연동 가이드

본 가이드는 `samsungsds.com/kr/insights/index.html` 페이지의 기존 기능(카테고리 다중 선택, 추천 검색어 오버레이, 정렬 기능)이 신규 디자인인 `report.html` 마크업 구조에서도 동일하게 작동하도록 구현하기 위한 **HTML 교체 본문**, **CSS 추가 본문**, **JavaScript 리팩토링 코드**를 제공합니다.

외부 UI 라이브러리 의존성을 없애고 독립적으로 작동할 수 있도록 **자체 경량 CustomSelectbox 스크립트**를 포함하여 구성했습니다.

---

## 1. HTML 마크업 교체

기존 [insights.html](file:///c:/Users/guidi/Documents/cms_project/insights.html)의 검색 및 카테고리 필터 영역([insights.html:L513-655](file:///c:/Users/guidi/Documents/cms_project/insights.html#L513-L655))을 아래의 신규 마크업 구조로 교체합니다.

```html
<!-- 변경된 검색/카테고리/정렬 폼 영역 -->
<div class="insight-report__toolbar">
    <!-- 필터 및 검색 폼 -->
    <form class="insight-report__filter" id="insightFilterForm" action="#" onsubmit="return false;">
        <div class="insight-report__selectbox-group">
            
            <!-- [주제] 카테고리 셀렉트박스 -->
            <div class="custom-selectbox js-show-selected" data-type="topic" data-multiple="true">
                <button type="button" class="custom-selectbox__selected">
                    <span class="custom-selectbox__selected-text">주제</span>
                </button>
                <div class="custom-selectbox__box">
                    <div class="custom-selectbox__box-inner">
                        <div class="custom-selectbox__list">
                            <div class="custom-selectbox__title">주제 선택</div>
                            <div class="custom-selectbox__options">
                                <label class="custom-selectbox__option custom-selectbox__option--all" aria-selected="true">
                                    <input type="checkbox" class="custom-selectbox__checkbox" checked />
                                    <div class="custom-selectbox__label">
                                        <span class="custom-selectbox__text">전체선택</span>
                                    </div>
                                </label>
                                <label class="custom-selectbox__option" aria-selected="false">
                                    <input type="checkbox" class="custom-selectbox__checkbox" value="AX" />
                                    <div class="custom-selectbox__label">
                                        <span class="custom-selectbox__text">AX</span>
                                    </div>
                                </label>
                                <label class="custom-selectbox__option" aria-selected="false">
                                    <input type="checkbox" class="custom-selectbox__checkbox" value="클라우드" />
                                    <div class="custom-selectbox__label">
                                        <span class="custom-selectbox__text">클라우드</span>
                                    </div>
                                </label>
                                <label class="custom-selectbox__option" aria-selected="false">
                                    <input type="checkbox" class="custom-selectbox__checkbox" value="업무 혁신" />
                                    <div class="custom-selectbox__label">
                                        <span class="custom-selectbox__text">업무 혁신</span>
                                    </div>
                                </label>
                                <label class="custom-selectbox__option" aria-selected="false">
                                    <input type="checkbox" class="custom-selectbox__checkbox" value="보안" />
                                    <div class="custom-selectbox__label">
                                        <span class="custom-selectbox__text">보안</span>
                                    </div>
                                </label>
                                <label class="custom-selectbox__option" aria-selected="false">
                                    <input type="checkbox" class="custom-selectbox__checkbox" value="DX" />
                                    <div class="custom-selectbox__label">
                                        <span class="custom-selectbox__text">DX</span>
                                    </div>
                                </label>
                                <label class="custom-selectbox__option" aria-selected="false">
                                    <input type="checkbox" class="custom-selectbox__checkbox" value="테크 트렌드" />
                                    <div class="custom-selectbox__label">
                                        <span class="custom-selectbox__text">테크 트렌드</span>
                                    </div>
                                </label>
                            </div>
                            <div class="custom-selectbox__footer">
                                <button type="button" class="custom-selectbox__close">확인</button>
                            </div>
                        </div>
                    </div>
                </div>
                <input type="hidden" class="custom-selectbox__input" name="chkTopic" value="" />
            </div>

            <span class="bar"></span>

            <!-- [산업] 카테고리 셀렉트박스 -->
            <div class="custom-selectbox js-show-selected" data-type="industry" data-multiple="true">
                <button type="button" class="custom-selectbox__selected">
                    <span class="custom-selectbox__selected-text">산업</span>
                </button>
                <div class="custom-selectbox__box">
                    <div class="custom-selectbox__box-inner">
                        <div class="custom-selectbox__list">
                            <div class="custom-selectbox__title">산업 선택</div>
                            <div class="custom-selectbox__options">
                                <label class="custom-selectbox__option custom-selectbox__option--all" aria-selected="true">
                                    <input type="checkbox" class="custom-selectbox__checkbox" checked />
                                    <div class="custom-selectbox__label">
                                        <span class="custom-selectbox__text">전체선택</span>
                                    </div>
                                </label>
                                <label class="custom-selectbox__option" aria-selected="false">
                                    <input type="checkbox" class="custom-selectbox__checkbox" value="공공" />
                                    <div class="custom-selectbox__label">
                                        <span class="custom-selectbox__text">공공</span>
                                    </div>
                                </label>
                                <label class="custom-selectbox__option" aria-selected="false">
                                    <input type="checkbox" class="custom-selectbox__checkbox" value="금융" />
                                    <div class="custom-selectbox__label">
                                        <span class="custom-selectbox__text">금융</span>
                                    </div>
                                </label>
                                <label class="custom-selectbox__option" aria-selected="false">
                                    <input type="checkbox" class="custom-selectbox__checkbox" value="제조" />
                                    <div class="custom-selectbox__label">
                                        <span class="custom-selectbox__text">제조</span>
                                    </div>
                                </label>
                                <label class="custom-selectbox__option" aria-selected="false">
                                    <input type="checkbox" class="custom-selectbox__checkbox" value="유통" />
                                    <div class="custom-selectbox__label">
                                        <span class="custom-selectbox__text">유통</span>
                                    </div>
                                </label>
                            </div>
                            <div class="custom-selectbox__footer">
                                <button type="button" class="custom-selectbox__close">확인</button>
                            </div>
                        </div>
                    </div>
                </div>
                <input type="hidden" class="custom-selectbox__input" name="chkIndustry" value="" />
            </div>

            <span class="bar"></span>

            <!-- [정렬] 셀렉트박스 -->
            <div class="custom-selectbox js-order" data-type="sort">
                <button type="button" class="custom-selectbox__selected">
                    <span class="custom-selectbox__selected-text">정확도순</span>
                </button>
                <div class="custom-selectbox__box">
                    <div class="custom-selectbox__box-inner">
                        <div class="custom-selectbox__list">
                            <div class="custom-selectbox__options">
                                <button type="button" class="custom-selectbox__option is-active" data-value="option_recom" aria-selected="true">정확도순</button>
                                <button type="button" class="custom-selectbox__option" data-value="option_recent" aria-selected="false">최신순</button>
                            </div>
                            <div class="custom-selectbox__footer">
                                <button type="button" class="custom-selectbox__close">확인</button>
                            </div>
                        </div>
                    </div>
                </div>
                <input type="hidden" class="custom-selectbox__input" name="chkSort" value="option_recom" />
            </div>
        </div>

        <span class="bar"></span>

        <!-- [검색창] 영역 -->
        <div class="insight-report__search search-form" id="sch_box_id" data-catid="kr3_2" data-lang="kr" data-page-size="1000">
            <div class="search-form__inner">
                <div class="search-form__box">
                    <input id="insightKeyword" class="insight-report__search-field search-form__input" type="search" name="keyword" placeholder="인사이트 검색" autocomplete="off" />
                    <button type="button" class="insight-report__search-button search-form__button btn_sch_ip" aria-label="검색하기"></button>
                </div>
                
                <!-- 추천 검색어 레이어 -->
                <div class="search-form__recommend">
                    <strong class="search-form__recommend-title">추천 검색어</strong>
                    <div class="search-form__keyword-list" id="sch_quick">
                        <!-- 동적으로 주입됨 -->
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>

<!-- 선택한 카테고리 필터 표시용 요약 바 (선택 사항) -->
<div class="insight-report__selected-area">
    <div class="insight-report__selected-list" id="selectedArea"></div>
    <button type="button" class="insight-report__reset-button reset-button">초기화</button>
</div>
```

---

## 2. JavaScript 연동 수정 스크립트

페이지 하단 `<script>` 블록 내부의 카테고리 바인딩 및 정렬 클릭 코드를 아래 로직으로 교체 또는 업데이트합니다.

```javascript
/* ==========================================
   1. 경량 CustomSelectbox 동작 제어 플러그인 (자체 탑재)
   ========================================== */
const CustomSelectbox = {
    init: function() {
        // 드롭다운 열기/닫기
        $(document).on('click', '.custom-selectbox__selected', function(e) {
            e.stopPropagation();
            const $box = $(this).closest('.custom-selectbox');
            $('.custom-selectbox').not($box).removeClass('is-open');
            $box.toggleClass('is-open');
        });
        
        // 확인/닫기 버튼 클릭 시 닫기
        $(document).on('click', '.custom-selectbox__close', function(e) {
            e.stopPropagation();
            $(this).closest('.custom-selectbox').removeClass('is-open');
        });

        // 드롭다운 영역 외 클릭 시 닫기
        $(document).on('click', function(e) {
            if (!$(e.target).closest('.custom-selectbox').length) {
                $('.custom-selectbox').removeClass('is-open');
            }
        });

        // 카테고리(체크박스) 변경 이벤트
        $(document).on('change', '.custom-selectbox__checkbox', function() {
            const $option = $(this).closest('.custom-selectbox__option');
            const $selectbox = $(this).closest('.custom-selectbox');
            
            if ($option.hasClass('custom-selectbox__option--all')) {
                // '전체선택' 체크 시 나머지 전부 해제
                if (this.checked) {
                    $selectbox.find('.custom-selectbox__checkbox').not(this).prop('checked', false);
                    $selectbox.find('.custom-selectbox__option').not($option).attr('aria-selected', 'false');
                    $option.attr('aria-selected', 'true');
                } else {
                    $option.attr('aria-selected', 'false');
                }
            } else {
                // 개별 아이템 체크 시
                if (this.checked) {
                    $option.attr('aria-selected', 'true');
                    // '전체선택' 해제
                    $selectbox.find('.custom-selectbox__option--all .custom-selectbox__checkbox').prop('checked', false);
                    $selectbox.find('.custom-selectbox__option--all').attr('aria-selected', 'false');
                } else {
                    $option.attr('aria-selected', 'false');
                }
                
                // 아무것도 체크되지 않은 경우 전체선택 강제 활성화
                const checkedCount = $selectbox.find('.custom-selectbox__checkbox:checked').length;
                if (checkedCount === 0) {
                    const $allOption = $selectbox.find('.custom-selectbox__option--all');
                    $allOption.find('.custom-selectbox__checkbox').prop('checked', true);
                    $allOption.attr('aria-selected', 'true');
                }
            }
            
            // 커스텀 이벤트 전파
            $selectbox.trigger('change.customSelect');
        });

        // 정렬 탭 버튼 클릭 시
        $(document).on('click', '.js-order .custom-selectbox__option', function() {
            const $selectbox = $(this).closest('.custom-selectbox');
            const val = $(this).attr('data-value');
            const txt = $(this).text();
            
            $selectbox.find('.custom-selectbox__option').removeClass('is-active').attr('aria-selected', 'false');
            $(this).addClass('is-active').attr('aria-selected', 'true');
            $selectbox.find('.custom-selectbox__selected-text').text(txt);
            $selectbox.find('.custom-selectbox__input').val(val);
            
            $selectbox.removeClass('is-open');
            $selectbox.trigger('change.customSelect', [val, txt]);
        });
    }
};

/* ==========================================
   2. 기존 로직과의 기능적 연결 & 재조정
   ========================================== */
$(function() {
    // 마크업 초기화 및 공통 드롭다운 동작 바인딩
    CustomSelectbox.init();

    // 카테고리 필터(주제/산업) 체크박스 상태 변경 이벤트
    $(".custom-selectbox").not(".js-order").on("change.customSelect", function() {
        selectedEyebrows = [];
        
        // 주제 및 산업에서 선택된 텍스트들을 수집
        $(".custom-selectbox").not(".js-order").each(function() {
            $(this).find(".custom-selectbox__option[aria-selected='true']").not(".custom-selectbox__option--all").each(function() {
                const cateText = $.trim($(this).find(".custom-selectbox__text").text());
                selectedEyebrows.push(cateText);
            });
        });

        const keyword = $("#insightKeyword").val() || "";
        if (keyword.trim() !== "") {
            // 키워드가 존재하면 카테고리 적용 후 서버 검색 실행
            searchStart(keyword, searchCallBack);
        } else {
            // 로컬 카테고리 렌더링
            if (selectedEyebrows.length === 0) {
                renderCateArticles('all');
            } else {
                renderCateArticles();
            }
        }
        
        // 요약 브레드크럼 표시 갱신
        renderSelectedSummary();
    });

    // 정렬 셀렉트박스 변경 이벤트 연결
    $(".js-order").on("change.customSelect", function(e, value, text) {
        searchOrderby = value; // 'option_recom' 또는 'option_recent'
        
        const keyword = $("#insightKeyword").val() || "";
        if (keyword.trim() !== "") {
            searchStart(keyword, searchCallBack);
        } else {
            // 검색어 없을 때 로컬 정렬 처리
            if (searchOrderby === "option_recent") {
                if (lang === 'en') {
                    insightArtList = _.sortBy(insightArtList, 'dateValue').reverse();
                } else {
                    insightArtList = _.sortBy(insightArtList, 'releaseDate').reverse();
                }
            }
            renderCateArticles();
        }
    });

    // 요약 표시 갱신용 헬퍼 함수
    function renderSelectedSummary() {
        const $area = $("#selectedArea");
        $area.empty();
        
        selectedEyebrows.forEach(function(item) {
            $area.append('<span class="summary-badge">' + item + '</span>');
        });
        
        if(selectedEyebrows.length > 0) {
            $(".insight-report__selected-area").show();
        } else {
            $(".insight-report__selected-area").hide();
        }
    }

    // 필터 전체 초기화 버튼
    $(".insight-report__reset-button").on("click", function() {
        $("#insightKeyword").val("");
        selectedEyebrows = [];
        
        // 드롭다운 리셋 (전체선택으로 체크 환원)
        $(".custom-selectbox").not(".js-order").each(function() {
            const $box = $(this);
            $box.find('.custom-selectbox__checkbox').prop('checked', false);
            $box.find('.custom-selectbox__option').attr('aria-selected', 'false');
            
            const $all = $box.find('.custom-selectbox__option--all');
            $all.find('.custom-selectbox__checkbox').prop('checked', true);
            $all.attr('aria-selected', 'true');
        });
        
        renderSelectedSummary();
        renderCateArticles('all');
    });

    /* ==========================================
       3. 검색어 오버레이 UI 인터랙션 수정
       ========================================== */
    // 검색창 포커스 시 추천검색어 레이어 활성화
    $(document).on('focus', '#insightKeyword', function(e) {
        e.preventDefault();
        $("#sch_box_id").addClass("is-focus");
        var keyword = $(this).val();
        popularKeyword(keyword, e);
    });

    // 추천 검색어 태그 클릭 시 검색어 세팅 후 검색 수행
    $(document).on('click', '.search-form__keyword-button', function(e) {
        e.preventDefault();
        var keyword = $(this).data('keyword') || $.trim($(this).text());
        $("#insightKeyword").val(keyword);
        searchStart(keyword, searchCallBack);
        $("#sch_box_id").removeClass("is-focus");
    });

    // 검색창 키보드 이벤트
    $(document).on('keyup', '#insightKeyword', function(e) {
        e.preventDefault();
        var keyword = $(this).val();
        if (e.key === 'Enter') {
            searchStart(keyword, searchCallBack);
            $("#sch_box_id").removeClass("is-focus");
        } else {
            if (keyword.length > 0) {
                autoComplete(keyword);
            } else {
                popularKeyword(keyword, e);
            }
        }
    });

    // 외부 영역 클릭 시 검색창 포커스 클래스 해제
    $(document).on('click', function(e) {
        if (!$(e.target).closest('#sch_box_id').length) {
            $("#sch_box_id").removeClass("is-focus");
        }
    });
});

/* ==========================================
   4. 추천어/자동완성 HTML 템플릿 재배치
   ========================================== */
// 인기검색어(추천검색어) 알약(Pill) 구조 템플릿
function popwordTemplate(data) {
    var html = '';
    var popwordDpCnt = data.length > 10 ? 10 : data.length; 
    for (var i = 0; i < popwordDpCnt; i++) {
        var originWord = data[i].query.indexOf('  ') > 0 ? data[i].query.split('  ')[1] : data[i].query.split(' ')[0];
        html += '<button type="button" class="search-form__keyword-button" data-keyword="' + originWord + '">' + originWord + '</button>';
    }
    return html;
}

// 자동완성 알약 구조 템플릿
function autoCompleteTemplete(data, len) {
    var html = '';
    var autoCompIdx = data.length > 10 ? 10 : data.length; 
    for (var i = 0; i < autoCompIdx; i++) {
        html += '<button type="button" class="search-form__keyword-button" data-keyword="' + data[i] + '">' +
                '<span class="point">' + data[i].substring(0, len) + '</span>' + data[i].substr(len) +
                '</button>';
    }
    return html;
}
```

---

## 3. CSS 오버라이딩 스타일시트

기존의 외부 스타일을 건드리지 않고, 추가 드롭다운 디자인과 오버레이 기능을 표현하기 위해 `<head>` 내에 주입 가능한 CSS 소스코드입니다.

```css
/* 드롭다운 부모 컨테이너 */
.custom-selectbox {
    position: relative;
    display: inline-block;
}

/* 드롭다운 버튼 스타일 */
.custom-selectbox__selected {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 15px;
    color: #333;
    padding: 8px 30px 8px 16px;
    cursor: pointer;
    position: relative;
}

.custom-selectbox__selected::after {
    content: '';
    position: absolute;
    right: 12px;
    top: 50%;
    width: 6px;
    height: 6px;
    border-bottom: 2px solid #555;
    border-right: 2px solid #555;
    transform: translateY(-50%) rotate(45deg);
    transition: transform 0.2s ease;
}

.custom-selectbox.is-open .custom-selectbox__selected::after {
    transform: translateY(-50%) rotate(-135deg);
}

/* 드롭다운 레이어 */
.custom-selectbox__box {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    min-width: 200px;
    background: #fff;
    border: 1px solid #ccc;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    margin-top: 8px;
}

.custom-selectbox.is-open .custom-selectbox__box {
    display: block;
}

.custom-selectbox__list {
    padding: 12px;
}

.custom-selectbox__title {
    font-weight: 700;
    font-size: 13px;
    color: #666;
    padding-bottom: 8px;
    border-bottom: 1px solid #eee;
    margin-bottom: 8px;
}

/* 체크박스 옵션 정렬 */
.custom-selectbox__option {
    display: flex;
    align-items: center;
    padding: 6px 4px;
    cursor: pointer;
}

.custom-selectbox__checkbox {
    margin-right: 8px;
    cursor: pointer;
}

.custom-selectbox__text {
    font-size: 14px;
}

.custom-selectbox__footer {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #eee;
    text-align: right;
}

.custom-selectbox__close {
    background: #0056ff;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 4px 12px;
    font-size: 12px;
    cursor: pointer;
}

/* 정렬 셀렉트 스타일 */
.js-order .custom-selectbox__option {
    display: block;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    padding: 8px 12px;
    cursor: pointer;
}

.js-order .custom-selectbox__option:hover,
.js-order .custom-selectbox__option.is-active {
    background-color: #f1f6ff;
    color: #0056ff;
}

/* 검색창 노출 및 포커스 상태 제어 */
.search-form__recommend {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: #fff;
    border: 1px solid #ccc;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    z-index: 999;
    border-radius: 8px;
    margin-top: 6px;
    padding: 16px;
    text-align: left;
}

.insight-report__search.is-focus .search-form__recommend {
    display: block;
}

.search-form__recommend-title {
    display: block;
    font-size: 13px;
    color: #666;
    margin-bottom: 8px;
}

.search-form__keyword-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.search-form__keyword-button {
    background-color: #f1f6ff;
    color: #0056ff;
    border: none;
    border-radius: 20px;
    padding: 6px 12px;
    font-size: 13px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.search-form__keyword-button:hover {
    background-color: #e0ecff;
}

.search-form__keyword-button span.point {
    font-weight: 700;
    color: #ff3b30; /* 자동완성 매칭 강조 포인트 */
}

/* 요약 배지 스타일 */
.insight-report__selected-area {
    display: none;
    margin-top: 12px;
    padding: 8px 12px;
    background: #f9f9f9;
    border-radius: 6px;
}

.summary-badge {
    display: inline-block;
    background: #e0ecff;
    color: #0056ff;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    margin-right: 6px;
}

.insight-report__reset-button {
    background: none;
    border: none;
    color: #999;
    font-size: 12px;
    cursor: pointer;
    float: right;
    line-height: 24px;
}
```
