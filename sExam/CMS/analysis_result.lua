-- 삼성SDS 고객사례 페이지 히어로 이미지 슬라이더 분석 결과
-- 대상 파일: module.js

local analysis = {
    plugin = "carouFredSel",
    function_name = "MP_customer_list_v1",
    description = "jQuery 기반의 carouFredSel 플러그인을 사용하여 슬라이더를 구현함",
    
    controls = {
        prev_button = ".arrow-prev",
        next_button = ".arrow-next",
        mapping_logic = "플러그인 설정 객체의 prev, next 속성에 버튼 엘리먼트를 매핑하여 제어를 위임함"
    },
    
    features = {
        auto_play = {
            enabled = true,
            timeout_duration = 10000, -- 10초
            description = "10초 단위로 자동으로 다음 슬라이드로 넘어감"
        },
        swipe = {
            on_mouse = true,
            on_touch = true,
            description = "데스크탑 마우스 드래그 및 모바일 터치 스와이프 지원"
        },
        effect = {
            type = "fade",
            description = "슬라이드가 서서히 나타나고 사라지는 페이드(Fade) 효과 적용"
        },
        accessibility = {
            description = "onAfter 콜백을 통해 활성화된 슬라이드 외의 요소들에 tabindex=-1, aria-hidden=true 속성을 부여하여 스크린 리더 인식을 차단"
        }
    }
}

return analysis
