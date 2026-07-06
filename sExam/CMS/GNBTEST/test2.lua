https://www.samsungsds.com/kr/insights/ai-decision-making-accountability.html
상세페이지에서는 module.js를 어떻게 참조하는지 분석해주세요.
10:53 PM
상세 페이지(https://www.samsungsds.com/kr/insights/ai-decision-making-accountability.html)에서의 module.js 참조 분석 결과입니다.

1. HTML 내 스크립트 및 스타일시트 참조 방식
상세 페이지에서도 메인 페이지(Index)와 동일하게 <head> 영역에서 module.js와 관련 라이브러리 및 공통 모듈 스크립트를 로드하고 있습니다.

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
동일하게 캐시 방지용 파라미터(?queryString=20260706022434)를 사용하고 있습니다.
2. 메인 페이지와의 실질적 동작 차이점
module.js를 불러오고 로직을 메모리에 등록하는 구조(fo.addPlugin)는 메인 페이지와 완벽히 같습니다. 하지만 상세 페이지에서 실제로 인스턴스화되어 실행되는 컴포넌트는 극히 제한적입니다.

① 실제로 동작하는 모듈: GNB (M00_A) 단 하나
상세 페이지의 HTML 소스 내에서 data-fn 속성을 갖거나 플러그인이 바인딩되는 요소는 GNB 컴포넌트인 M00_A 뿐입니다.

html
<!-- line 264 -->
<div class="M00_A" data-fn="M00_A" data-current="gkr51" data-url="/kr/gnb/gnb.json" data-url-feature="/kr/gnb/feature/feature.html" data-history="true"></div>
따라서 문서 로드가 끝난 후 ($(document).ready()), common_module.js가 자동으로 new M00_A()를 실행하여 상단 헤더 영역만 module.js를 통해 제어하게 됩니다.

② 메인 페이지용 컴포넌트 비활성화
메인 페이지에서 기사 리스트를 구현하던 MP_insight_list나 기타 다양한 visual 모듈 등은 상세 페이지 HTML 내에 일치하는 태그(data-fn)나 클래스가 존재하지 않기 때문에, 코드 자체는 로드되지만 실제로 객체가 생성되거나 초기화(init)되지는 않습니다.

3. 추가 참조 파일 (sdscommon.js)
상세 페이지에서는 메인 페이지와 다르게 아래의 공통 헬퍼 스크립트가 추가적으로 로드됩니다.

html
<script type="text/javascript" src="/resource/kr/js/sdscommon.js?queryString=20260706022434"></script>
이 파일은 module.js 컴포넌트 아키텍처와는 무관하며, 목록 이동(goList), 텍스트 생략 표시 처리(textEllipsis), 메타 태그 이미지 강제 지정(setMetaImage) 등 아티클 본문 및 상세 페이지 레이아웃에 특화된 단순 유틸리티 함수들을 포함하고 있습니다.