제공해주신 URL의 module.js 소스 코드를 분석한 결과, 삼성SDS 고객사례 페이지 상단의 히어로 이미지 슬라이더는 MP_customer_list_v1 이라는 함수에서 제어되고 있습니다.

해당 슬라이더의 좌우 화살표 버튼이 어떻게 동작하는지 소스 코드 분석 내용을 바탕으로 설명해 드리겠습니다.

1. 핵심 슬라이더 라이브러리: carouFredSel
히어로 슬라이더는 jQuery 기반의 슬라이더 플러그인인 **carouFredSel**을 사용하여 구현되어 있습니다. module.js 내의 setCarousel 함수에서 이 플러그인을 초기화하며 슬라이더의 전반적인 동작을 정의합니다.

2. 좌/우 버튼 컨트롤 매핑
HTML 소스에 있는 좌우 화살표 버튼(.arrow-prev, .arrow-next)은 자바스크립트 코드에서 아래와 같이 매핑되어 동작합니다.

javascript
function setCarousel(_plugin) {
    // 1. 좌우 버튼 요소를 찾아서 변수에 할당합니다.
    var $prevBtn = _plugin.$el.find('.arrow-prev');
    var $nextBtn = _plugin.$el.find('.arrow-next');
    // 2. carouFredSel 플러그인을 초기화할 때 옵션으로 버튼 객체를 넘겨줍니다.
    _plugin.$carousel.carouFredSel({
        // ... (생략) ...
        prev: {
            button: $prevBtn, // 좌측 화살표 동작 연결
        },
        next: {
            button: $nextBtn, // 우측 화살표 동작 연결
        },
        // ... (생략) ...
플러그인 자체 기능(API)을 통해, 사용자가 해당 버튼을 클릭할 때마다 이전/다음 슬라이드로 넘어가는 이벤트가 내부적으로 자동 바인딩됩니다.

3. 슬라이더의 주요 특징 (옵션 분석)
코드를 보면 버튼 제어 외에도 다음과 같은 슬라이더의 동작 특징이 정의되어 있습니다.

자동 롤링 (Auto Play): auto: { play: true, timeoutDuration: 10000 } 옵션이 적용되어 있어, 버튼을 누르지 않아도 10초(10000ms) 단위로 자동으로 다음 슬라이드로 넘어갑니다.
터치 & 스와이프 지원: swipe: { onMouse: true, onTouch: true } 옵션이 설정되어 있어, 데스크탑에서 마우스 드래그를 하거나 모바일에서 손가락으로 스와이프해도 버튼을 누른 것과 동일하게 다음 슬라이드로 넘어갑니다.
전환 효과 (Fade 효과): scroll: { fx: 'fade' } 옵션으로 인해 슬라이드가 옆으로 밀리는 형태가 아닌, 서서히 나타나고 사라지는 페이드(Fade) 효과로 이미지가 전환됩니다.
접근성(Aria) 동적 제어: 버튼으로 슬라이드가 전환된 직후(onAfter 콜백 함수 실행 시), 새롭게 화면에 보여지는 슬라이드 요소에 active 클래스를 추가하고 화면에 보이지 않는 이전 슬라이드의 탭 이동 권한(tabindex: -1)과 스크린 리더 인식(aria-hidden: true)을 차단하여 웹 접근성을 향상시키는 코드가 포함되어 있습니다.
요약하자면, 해당 기능은 직접 click 이벤트를 작성하여 수동으로 슬라이드를 넘기는 방식이 아니라, .arrow-prev와 .arrow-next 클래스를 가진 버튼을 jQuery의 carouFredSel 슬라이더 플러그인 설정 객체에 넘겨주어 플러그인 자체 제어 기능에 슬라이딩 동작을 위임하는 방식으로 작동하고 있습니다.