ce
https://www.samsungsds.com/kr/insights/index.html에서 module.js 파일을 어떻게 참조하는지 분석해주세요.
10:39 PM
삼성에스디에스 인사이트 리포트 페이지(https://www.samsungsds.com/kr/insights/index.html)에서 module.js 파일을 참조하고 동작시키는 방식에 대한 분석 결과입니다.

1. HTML 내 직접적인 스크립트 및 스타일시트 참조
HTML 소스의 <head> 영역에서 module.js와 함께 관련 라이브러리 및 공통 모듈 스크립트, CSS 스타일시트를 다음과 같이 순차적으로 로드하고 있습니다.

JavaScript 로드
html
<script type="text/javascript" src="/module_src/js/lib/libs.js?queryString=20260706022434"></script>
<script type="text/javascript" src="/module_src/js/common_module.js?queryString=20260706022434"></script>
<script type="text/javascript" src="/module_src/js/module.js?queryString=20260706022434"></script>
CSS 로드
html
<link rel="stylesheet" type="text/css" href="/module_src/css/lib/libs.css?queryString=20260706022434">
<link rel="stylesheet" type="text/css" href="/module_src/css/common_module.css?queryString=20260706022434">
<link rel="stylesheet" type="text/css" href="/module_src/css/module.css?queryString=20260706022434">
캐시 버스팅(Cache Busting): 파일 경로 뒤에 ?queryString=20260706022434와 같은 타임스탬프 형식(YYYYMMDDhhmmss)의 쿼리 스트링을 붙여, 파일이 업데이트되었을 때 브라우저가 캐시된 예전 파일 대신 최신 파일을 강제로 다운로드하도록 처리하고 있습니다.
2. JavaScript 모듈 로드 및 동작 메커니즘 (내부 동작 구조)
삼성에스디에스 사이트는 페이지 내의 다양한 UI 컴포넌트(GNB, 아코디언, 탭, 배너 슬라이드 등)를 플러그인 형태로 구조화하여 관리하고 있습니다. 이들의 등록과 실행은 common_module.js와 module.js 간의 협업으로 이루어집니다.

① 플러그인 등록 매니저 (fo 객체)
common_module.js 파일에서 전역 등록 객체인 pluginObject와 등록 기능을 담당하는 fo 객체를 정의합니다.

javascript
var pluginObject = {};
var fo = {
    addPlugin : function(fn, selector){
        !pluginObject[fn.name] ? pluginObject[fn.name] = fn : null;
    },
    ...
}
② 각 UI 컴포넌트 구현 및 등록 (module.js)
module.js 내부에는 GNB(M00_A), 오퍼링 목록(M04_B), 텍스트 롤링 등 각 UI 컴포넌트들을 처리하는 생성자 함수들이 정의되어 있습니다. 각 함수 정의가 끝나는 시점에 fo.addPlugin을 호출하여 전역 pluginObject에 등록합니다.

javascript
// GNB 컴포넌트 예시
function M00_A(el) {
    // GNB 구현 로직 ...
}
fo.addPlugin(M00_A); // 전역 pluginObject에 'M00_A' 등록
③ DOM 파싱 후 자동 인스턴스화 (common_module.js)
HTML 문서의 로드가 완료되면 ($(document).ready()), common_module.js 내에서 아래의 두 가지 방식으로 DOM 요소를 찾아 플러그인을 자동으로 생성(new)하고 바인딩합니다.

data-fn 속성을 통한 자동 바인딩: HTML 마크업에 data-fn="M00_A"와 같이 지정된 요소들을 찾아 매칭되는 플러그인 객체를 동적으로 생성합니다.

javascript
$('[data-fn]').each(function(i, el){
    var fnName = $(this).data('fn');
    if(!$(this).data("plugin")){
        if(pluginObject.hasOwnProperty(fnName)){
            $(this).data("plugin", new pluginObject[fnName]($(el)));
        }
    }
})
(예시: 해당 인사이트 페이지 HTML 내 <div class="M00_A" data-fn="M00_A"></div> 요소를 만나면 new M00_A()가 실행되어 GNB가 활성화됩니다.)

readyModule 사전 정의 배열을 통한 클래스 바인딩: 특정 CSS 클래스 선택자(예: .M01_A, .M04_B)를 스캔하여 매치되는 플러그인을 인스턴스화합니다.

javascript
customModule.readyModule.map(function(module){
    $(module.selector).each(function(i, el){
        var fnName = module.plugin;
        if(!$(this).data("plugin")){
            if(pluginObject.hasOwnProperty(fnName)){
                $(this).data("plugin", new pluginObject[fnName]($(el)));
            }
        }
    });
});
요약
https://www.samsungsds.com/kr/insights/index.html은 HTML 상에서 common_module.js를 먼저 로드하여 전역 플러그인 등록 아키텍처(fo, pluginObject)를 구축한 다음, module.js를 로드하여 각 UI 구성요소 클래스들을 등록합니다. 이후 DOM이 완성되면 **data-fn이나 특정 클래스명을 추적하여 필요한 UI 모듈 객체를 동적으로 자동 생성(New)**하는 정교한 컴포넌트 바인딩 구조를 사용하고 있습니다.