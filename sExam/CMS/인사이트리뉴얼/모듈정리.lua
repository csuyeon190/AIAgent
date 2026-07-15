삼성SDS 사이트의 GNB(상단 네비게이션) 영역은 M00_A라는 전역 컴포넌트 모듈로 동작하고 있으며, 우측의 '문의하기' 버튼 역시 이 GNB 마크업 및 스타일 구성 요소에 속해 있습니다.

1.4MB에 달하는 방대한 module.js와 module.css에서 GNB(M00_A) 및 문의하기 영역을 구동하는 데 필요한 핵심 스타일(CSS)과 스크립트(JS)만 정리하여 전달해 드립니다.

1. GNB 및 문의하기 영역 핵심 CSS 정리
GNB 레이아웃, 메뉴 배치, 모바일 대응을 위한 미디어 쿼리, 그리고 사진에서 강조 표시된 둥근 테두리 형태의 '문의하기' 버튼을 스타일링하는 핵심 CSS입니다.

css
/* ==========================================
   1. GNB Header Layout (M00_A)
   ========================================== */
.M00_A {
    position: absolute;
    width: 100%;
    max-width: 1920px;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    opacity: 1;
    z-index: 7000;
    transition: top 0.2s;
    background: transparent !important;
}
.M00_A > .inner {
    position: relative;
    max-width: none;
    padding: 0 30px;
    border-bottom: 1px solid #ddd;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 61px;
}
/* SAMSUNG SDS 로고 영역 */
.M00_A .logo {
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
}
.M00_A .logo a {
    display: block;
    width: 120px;
    height: 20px;
    background: url('https://image.samsungsds.com/resource/kr/images/logo.png') no-repeat center;
    background-size: contain;
}
/* ==========================================
   2. Navigation Menus (메인 & 유틸 메뉴)
   ========================================== */
/* GNB 메인 메뉴 (Generative AI, 클라우드, 솔루션, 물류) */
.M00_A .gnb_menu_wrap {
    display: flex;
    align-items: center;
    height: 100%;
}
.M00_A .gnb {
    display: flex;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
}
.M00_A .gnb li {
    margin: 0 20px;
}
.M00_A .gnb li a {
    font-size: 15px;
    color: #000;
    font-weight: bold;
    text-decoration: none;
    display: block;
    line-height: 61px;
}
/* 우측 상단 유틸리티 메뉴 (이벤트, 인사이트, 뉴스룸, 회사정보) */
.M00_A .util_menu {
    display: flex;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
}
.M00_A .util_menu li {
    margin-left: 18px;
}
.M00_A .util_menu li a {
    font-size: 14px;
    color: #333;
    text-decoration: none;
}
/* ==========================================
   3. Inquiry Button (문의하기 버튼 스타일 - 빨간색 표시 영역)
   ========================================== */
.M00_A .btn_inquiry,
.M00_A .inquiry_btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 22px;
    border: 1.5px solid #000;
    border-radius: 20px;
    font-size: 13px;
    font-weight: bold;
    color: #000;
    background-color: transparent;
    text-decoration: none;
    transition: all 0.3s ease;
}
/* 마우스 호버 시 인터랙션 */
.M00_A .btn_inquiry:hover,
.M00_A .inquiry_btn:hover {
    background-color: #000;
    color: #fff;
}
/* ==========================================
   4. Mobile Responsive GNB (1024px 이하)
   ========================================== */
@media all and (max-width: 1024px) {
    .M00_A > .inner {
        height: 50px;
        padding: 0 20px;
    }
    .M00_A .gnb_menu_wrap,
    .M00_A .util_menu {
        display: none; /* 모바일에서는 레이어 햄버거 메뉴 구조로 대체 */
    }
}
2. GNB 및 문의하기 영역 핵심 JS 뼈대 구조
GNB 데이터를 비동기로 로드하고 헤더 영역 마우스 호버 모션 및 반응형 처리를 담당하는 M00_A 모듈의 핵심 골격 자바스크립트 코드입니다.

javascript
/**
 * M00_A | GNB 모듈 핵심 스크립트
 */
function M00_A(el) {
    _proto = M00_A.prototype;
    _this = this;
    this.$el = el;
    this.lang = $('html').attr('lang') || 'ko';
    this.country = $('html').attr('data-country') || 'kr';
    
    // GNB 데이터 비동기 조회 주소
    this.gnbUrl = this.$el.attr('data-url') || '/kr/gnb/gnb.json';
    this.isMobile = $(window).width() > 1024 ? false : true;
    _proto.init = function() {
        this.loadGnbData();
        this.bindEvents();
    };
    // GNB 메뉴 데이터 JSON 로드 및 빌드
    _proto.loadGnbData = function() {
        const _self = this;
        $.ajax({
            url: _self.gnbUrl,
            dataType: 'json',
            success: function(data) {
                _self.renderGnb(data);
            },
            error: function(xhr, status, error) {
                console.error("GNB 로드 실패: ", error);
            }
        });
    };
    // GNB 렌더링
    _proto.renderGnb = function(data) {
        // 받아온 JSON 데이터를 기반으로 메뉴 구조 바인딩 진행
        // 문의하기 버튼 URL 동적 셋업 및 렌더링 포함
    };
    // 메뉴 열기/닫기 및 스크롤 이벤트 바인딩
    _proto.bindEvents = function() {
        // PC: 마우스 호버(hover) 시 드롭다운 패널(gsnb) 오픈 제어
        this.$el.on('mouseenter', function() {
            $(this).addClass('is-hover');
        }).on('mouseleave', function() {
            $(this).removeClass('is-hover');
        });
        // 모바일 및 스크롤 다운 시 헤더 상단 고정(Fixed) 및 숨김 처리
        $(window).on('scroll', function() {
            const scrollTop = $(window).scrollTop();
            if (scrollTop > 61) {
                $('body').addClass('sc_down');
            } else {
                $('body').removeClass('sc_down');
            }
        });
    };
    this.init();
}
// Global Module Framework에 GNB 모듈 등록
fo.addPlugin(M00_A);
💡 (팁) 무거운 module.js에서 쓸데없는 모듈을 자동 제거하는 방법
insights.html 페이지에서 data-fn을 사용하여 생성되는 실질적인 모듈은 **M00_A (GNB)**와 MP_insight_list (목록) 두 가지뿐입니다. 다른 4만 라인의 무거운 모듈(M01_A ~ M40_A 등)을 수작업으로 지우다 보면 괄호나 종속성이 깨질 수 있습니다.

아래의 간단한 Node.js 스크립트를 사용하여 프로젝트 루트 디렉토리에서 실행하면 module.js로부터 필요한 M00_A 모듈과 MP_insight_list 모듈만 자동으로 추출하여 가벼운 purged_module.js를 만들어 줍니다.

[정제(Purge)를 위한 Node.js 스크립트 purge_script.js]
javascript
const fs = require('fs');
// 원본 module.js 파일 로드
const code = fs.readFileSync('module.js', 'utf8');
// 1. GNB 모듈 (M00_A) 추출
const m00Start = code.indexOf('/** M00_A | GNB */');
const m00End = code.indexOf('/*** M01_A | Hero ***/');
const m00Code = code.substring(m00Start, m00End);
// 2. 인사이트 목록 모듈 (MP_insight_list) 추출
const listStart = code.indexOf('/** Page | 오퍼링 > 인사이트 리스트 | MP_insight_list */');
const listEnd = code.indexOf('fo.addPlugin(MP_insight_list);');
const listCode = code.substring(listStart, listEnd) + '\nfo.addPlugin(MP_insight_list);\n';
// GNB와 목록 모듈만 합쳐서 새로운 정제용 JS 파일 작성 (용량 획기적 축소)
const purgedCode = `${m00Code}\n\n${listCode}`;
fs.writeFileSync('purged_module.js', purgedCode, 'utf8');
console.log('불필요한 모듈이 정리된 purged_module.js 생성이 완료되었습니다!');
위 Node.js 코드를 임시 파일로 만들어 한 번 실행하신 후 생성된 purged_module.js를 페이지에 적용하시면 1.4MB의 스크립트 용량을 수십 KB로 최적화하실 수 있습니다.

