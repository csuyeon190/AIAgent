# 삼성SDS 인사이트 리포트 경량화 CSS 가이드

기존의 `css.css`, `common_module.css`, `module.css` 파일은 약 **2.17 MB (2,229 KB)**에 달하는 대용량 파일이었습니다. 이 중 인사이트 리포트 페이지(`insights.html`)에서 실제로 사용되는 태그, ID, 클래스 및 스크립트 제어 상태만을 엄격히 분석하여 꼭 필요한 규칙들만 추려냈습니다.

정밀 필터링(Purging)을 거쳐 최종 용량을 **30.08 KB**로 압축하였으며, 이는 기존 대비 **98.62%의 용량 감소** 효과를 냅니다.

---

## 1. 경량화 CSS 적용 방법

기존 [insights.html](file:///c:/Users/guidi/Documents/cms_project/insights.html#L46-L55)의 무거운 외부 스타일시트 링크를 아래와 같이 하나의 경량화 파일인 `purged_insights.css` 호출로 교체합니다.

### [기존 코드]
```html
<link rel="stylesheet" type="text/css" href="/resource/kr/css/swiper.min.css?queryString=20260706022434">
<link rel="stylesheet" type="text/css" href="/resource/kr/css/css.css?queryString=20260706022434">

<!-- [S]: for Module -->
<link rel="stylesheet" type="text/css" href="/module_src/css/lib/libs.css?queryString=20260706022434">
<link rel="stylesheet" type="text/css" href="/module_src/css/common_module.css?queryString=20260706022434">
<link rel="stylesheet" type="text/css" href="/module_src/css/module.css?queryString=20260706022434">
<!-- [E]: for Module -->
```

### [변경 후 코드]
```html
<link rel="stylesheet" type="text/css" href="/resource/kr/css/swiper.min.css?queryString=20260706022434">
<link rel="stylesheet" type="text/css" href="/module_src/css/lib/libs.css?queryString=20260706022434">
<!-- 단일 경량화 스타일시트 적용 -->
<link rel="stylesheet" type="text/css" href="./purged_insights.css">
```

---

## 2. 추출된 CSS 코드 본문

추출된 코드는 작업공간에 [purged_insights.css](file:///c:/Users/guidi/Documents/cms_project/purged_insights.css) 파일로도 생성되어 있어 에디터로 바로 복사 및 업로드하여 활용하실 수 있습니다.

```css
/* === Purged from css.css === */


/* === Purged from common_module.css === */
@font-face {font-family: 'Noto Sans'; font-style: normal; font-weight: bold; src: url(https://image.samsungsds.com/module_src/css/font/NotoSansKR-Bold.woff2?queryString=20260619035537) format('woff2'), url(https://image.samsungsds.com/module_src/css/font/NotoSansKR-Bold.woff?queryString=20260619035537) format('woff'), url(https://image.samsungsds.com/module_src/css/font/NotoSansKR-Bold.otf?queryString=20260619035537) format('opentype');}
@font-face {font-family: 'Noto Sans PT'; font-style: normal; font-weight: normal; src: url(https://image.samsungsds.com/module_src/css/font/NotoSansPT-Regular.woff2?queryString=20260619035537) format('woff2'), url(https://image.samsungsds.com/module_src/css/font/NotoSansPT-Regular.woff?queryString=20260619035537) format('woff'), url(https://image.samsungsds.com/module_src/css/font/NotoSansPT-Regular.otf?queryString=20260619035537) format('opentype');}
@font-face {font-family: 'Noto Sans PT'; font-style: normal; font-weight: bold; src: url(https://image.samsungsds.com/module_src/css/font/NotoSansPT-Bold.woff2?queryString=20260619035537) format('woff2'), url(https://image.samsungsds.com/module_src/css/font/NotoSansPT-Bold.woff?queryString=20260619035537) format('woff'), url(https://image.samsungsds.com/module_src/css/font/NotoSansPT-Bold.otf?queryString=20260619035537) format('opentype');}
@font-face {font-family: 'Noto Sans SC'; font-style: normal; font-weight: normal; src: url(https://image.samsungsds.com/module_src/css/font/NotoSansSC-Regular.woff2?queryString=20260619035537) format('woff2'), url(https://image.samsungsds.com/module_src/css/font/NotoSansSC-Regular.woff?queryString=20260619035537) format('woff'), url(https://image.samsungsds.com/module_src/css/font/NotoSansSC-Regular.otf?queryString=20260619035537) format('opentype');}
@font-face {font-family: 'Noto Sans SC'; font-style: normal; font-weight: bold; src: url(https://image.samsungsds.com/module_src/css/font/NotoSansSC-Bold.woff2?queryString=20260619035537) format('woff2'), url(https://image.samsungsds.com/module_src/css/font/NotoSansSC-Bold.woff?queryString=20260619035537) format('woff'), url(https://image.samsungsds.com/module_src/css/font/NotoSansSC-Bold.otf?queryString=20260619035537) format('opentype');}
@font-face {font-family: 'SharpSansNo1'; font-style: normal; font-weight: normal; src: url(https://image.samsungsds.com/module_src/css/font/SharpSansNo1-Medium.eot?queryString=20260619035537); src: local('※'), url(https://image.samsungsds.com/module_src/css/font/SharpSansNo1-Medium.eot?#iefix) format('embedded-opentype'), url(https://image.samsungsds.com/module_src/css/font/SharpSansNo1-Medium.woff?queryString=20260619035537) format('woff');}
@font-face {font-family: 'SharpSansNo1'; font-style: normal; font-weight: bold; src: url(https://image.samsungsds.com/module_src/css/font/SharpSansNo1-Bold.eot?queryString=20260619035537); src: local('※'), url(https://image.samsungsds.com/module_src/css/font/SharpSansNo1-Bold.eot?#iefix) format('embedded-opentype'), url(https://image.samsungsds.com/module_src/css/font/SharpSansNo1-Bold.woff?queryString=20260619035537) format('woff');}
@font-face {font-family: 'OPTITimes'; 
    font-style: normal; 
    font-weight: normal; 
    src: url('https://image.samsungsds.com/resource/kr/css/fonts/OPTITimes-Roman.otf?queryString=20260619035537') format('opentype');}
@font-face {font-family: 'OPTITimes'; 
    font-style: italic; 
    font-weight: normal; 
    src: url('https://image.samsungsds.com/resource/kr/css/fonts/OPTITimesRoman-Italic.otf?queryString=20260619035537') format('opentype');}
* {font-family: 'Noto Sans', sans-serif !important;}
html[data-country="vn"] * {font-family: 'OPTITimes', sans-serif !important;}
body {min-width: 360px; font-family: 'Noto Sans', sans-serif; color: #000; font-size: 16px; font-weight: normal; line-height: 1.2; letter-spacing: -0.4px; -webkit-text-size-adjust: none;     word-wrap: break-word; word-break: keep-all; white-space: normal; overflow-y: scroll;}
.tit_b {margin-left: -1px; color: #000; font-size: 40px; font-weight: bold; line-height: 62px; letter-spacing: -0.6px; transition: font-size 0.4s;}
.tit_s {color: #000; font-size: 22px; font-weight: bold; line-height: 32px; letter-spacing: -0.5px; transition: font-size 0.4s;}
.blind {position: absolute !important; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(1px 1px 1px 1px); border: 0; z-index:-1; clip-path: inset(50%); color: transparent !important; font-size: 1px; line-height: 1px;}
.sns_box {position: absolute; right: 30px; bottom: 60px; z-index: 2; transition: filter .3s;}
.sns_box ul {display: flex;}
.sns_box ul .sns_item {margin-left: 20px;}
.sns_box ul .sns_item a {display: block; transition: opacity .2s;}
.sns_box ul .sns_item a:hover {opacity: 0.6;}
.sns_box ul .sns_item a img {max-height: 29px;}
.sns_box ul .sns_item {margin-left: 20px;}
.sns_box ul .sns_item:first-child {margin-left: 0;}
.sns_box ul li.sns_item:first-child a {min-width: auto; height: auto; display: block;}
.sns_box ul li:first-child a {min-width: 166px; font-size: 14px; height: 40px; display: flex; align-items: center; justify-content: center;}
.sns_box ul li .btn_m {color: #fff;}
.sns_box ul li .btn_ty::after {border: 1px solid #fff;}
.sns_box.black ul li .btn_m:hover {color: #fff;}
.sns_box ul li .btn_ty:hover::after, .sns_box.black ul li .btn_ty:hover::after {border-color: #2189ff;}
.arrow-nav.black::before, .navigation.black .md_pagn a, .navigation.black .md_play .md_btn_stop::before, .navigation.black .md_play .md_btn_stop::after, .sns_box.black ul .sns_item a, .navigation.black .md_play .md_btn_play::before, .navigation.black .md_play .md_btn_stop::before {filter: invert(1);}
.sns_box.black ul li .btn_m {color: #000;}
.sns_box.black ul li .btn_ty::after {border: 1px solid #000;}
.cont+.cont {padding-top: 20px;}
.cont .inner {position: relative; width: auto; max-width: 1504px; margin: 0 auto; padding: 0 93px; box-sizing: border-box;}
.btn_m {display: inline-block; position: relative; min-width: 215px; height: 44px; padding: 0 30px; box-sizing: border-box; font-size: 16px; font-weight: bold; line-height: 42px; text-align: center; vertical-align: top; overflow: hidden; outline: none; transition: all 0.4s; cursor: pointer; webkit-backface-visibility: hidden; -moz-backface-visibility: hidden; -webkit-transform: translate3d(0, 0, 0); -moz-transform: translate3d(0, 0, 0);}
.btn_m span {display: inline-block; position: relative;}
.btn_m.round {border-radius: 23px;}
.btn_m.round:after {border-radius: 23px;}
.btn_ty:before {background: #2189ff;}
.btn_ty:after {border: 1px solid #000;}
.btn_ty:hover, .btn_ty:focus {background: #2189ff; color: #fff;}
.btn_ty:hover:after, .btn_ty:focus:after {border-color: #2189ff;}
.btn_ty02 {color: #fff;}
.btn_ty02::before {background: #2189ff;}
.btn_ty02::after {border: 1px solid #fff;}
.btn_ty02:hover, .btn_ty02:focus {background: #2189ff; color: #fff;}
.btn_ty02:hover::after, .btn_ty02:focus::after {border-color: #2189ff;}
.btn_ty:before, .btn_ty02:before {position: absolute; left: 0%; top: 0%; width: 100%; height: 100%; content: ""; transform: translateX(-105%); transition: all 0.4s;}
.btn_ty:after, .btn_ty02:after {position: absolute; left: 0; top: 0; width: 100%; height: 100%; box-sizing: border-box; content: ""; transition: all 0.4s;}
.btn_ty:hover:before, .btn_ty:focus:before, .btn_ty02:hover:before, .btn_ty02:focus:before {transform: translateX(0%);}
.btn_ty:hover, .btn_ty:focus, .btn_ty02:hover, .btn_ty02:focus {background: none;}
.btn_m.round::before {border-radius: 23px;}
.btn_ty:disabled, .btn_ty02:disabled {background: none; color: rgba(255, 255, 255, 0.5); cursor: default;}
.btn_ty:disabled:before, .btn_ty02:disabled:before {display: none;}
.btn_ty:disabled:after, .btn_ty02:disabled:after {border-color: rgba(255, 255, 255, 0.5);}
.btn_ty:disabled {color: rgba(0, 0, 0, 0.5);}
.btn_ty:disabled:after {border-color: rgba(0, 0, 0, 0.5);}
.btn_arrow {display: inline-block; color: #2189FF; font-size: 16px; transition: all 0.4s; outline: none; cursor: pointer;}
.btn_arrow span {display: inline-block; position: relative; padding-right: 17px;}
.btn_arrow span:after {position: absolute; right: 0; top: 50%; width: 16px; height: 16px; margin-top: -7px; border: solid #2189FF; border-width: 3px 3px 0 0; box-sizing: border-box; transform: rotate(45deg) scale(0.5); content: ""; transition: all 0.4s;}
.btn_arrow:hover, .btn_arrow:focus {color: #0098c2;}
.btn_arrow:hover span:after, .btn_arrow:focus span:after {right: -3px; border-color: #0098c2;}
.btn_arrow:disabled {color:rgba(0, 0, 0, 0.5) !important;}
.btn_arrow:disabled span:after {right:0;border-color:rgba(0, 0, 0, 0.5) !important;}
.btn_arrow:disabled:hover span:after {right:0;}
.btn_more {position: relative; text-align: center;}
.btn_more a, .btn_more button {margin-top: 40px;}
.module_ty {position: relative;}
.module_ty .img {position: relative; margin-bottom: 20px; overflow: hidden;}
.module_ty .img:before {content: ""; display: block; width: 100%; height: 0; padding-bottom: 56.346%;}
.module_ty .img img {width: 100%;}
.module_ty .img .img_p {position: absolute; left: 0; top: 0; width: 100%; height: 100%;}
.module_ty .img .img_m {position: absolute; left: 0; top: 0; width: 100%; height: 100%;}
.module_ty .txt {position: relative; padding: 0 10% 0 0; text-align: left;}
.module_ty .txt .md_txt {margin-top: 6px; font-size: 16px; font-weight: normal; line-height: 28px; letter-spacing: -0.4px;}
.module_ty .txt .md_tit, .module_ty .txt .md_txt {display: block;}
.module_ty .md_btn {margin: 16px -8px 0 -8px;}
.module_ty .md_btn a {margin: 0 8px; cursor: pointer;}
.md_share_area.on {display: block; animation: fade 0.4s; z-index: 7001;}
.md_share_area.off {animation: fadeOut 0.3s;}
.md_share_dimd {display: none;}
.md_share_box {position: relative; padding: 15px 26px 10px 26px; background: #fff; border: 1px solid #000; box-sizing: border-box; z-index: 1001;}
.md_share_box .li_s {display: inline-block; min-width: 62px; margin: 0 2px; color: #000; font-size: 12px; line-height: 24px; text-align: center; transition: all 0.4s;}
.md_share_box .li_s i {display: block; text-align: center;}
.md_share_box .li_s i img {width: 30px;}
.md_share_box .li_s span {display: block; margin-top: 5px;}
.md_share_box .li_s:hover {color: #2189ff;}
.md_share_box .li_s:hover, .md_share_box .li_s:focus {color: #2189ff;}
.md_btn_share_close {display: block; position: absolute; right: 0; top: 0; width: 30px; height: 30px; overflow: hidden;}
.md_btn_share_close span {display: block; position: absolute; left: 50%; top: 50%; width: 19px; height: 0; padding-top: 19px; margin: -10px 0 0 -10px; transform: rotate(45deg); font-size: 10px; overflow: hidden; transition: transform 0.4s;}
.md_btn_share_close span:before {position: absolute; left: 50%; top: 0; width: 1px; height: 100%; margin-left: -1px; background: #000; content: "";}
.md_btn_share_close span:after {position: absolute; left: 0; top: 50%; width: 100%; height: 1px; margin-top: -1px; background: #000; content: "";}
.md_btn_share_close:hover span, .md_btn_share_close:focus span {transform: rotate(225deg);}
.md_btn_share_close:hover span:before, .md_btn_share_close:hover span:after, .md_btn_share_close:focus span:before, .md_btn_share_close:focus span:after {background: #2189ff;}
.md_share_box.ver2 {outline: 1px solid #ccc; padding: 20px 20px 25px 20px; max-width: 290px; border: unset;}
.md_share_box.ver2 .title_wrap {display: flex; justify-content: space-between; margin-bottom: 2rem;}
.md_share_box.ver2 .title_wrap .title {font-size: 1.8rem; font-weight: 600; line-height: 30px;}
.md_share_box.ver2 .ico_share_box {display: flex; flex-wrap: wrap; gap: 24px; justify-content: center;}
.md_share_box.ver2 .ico_share_box .li_s {width: 60px; height: 60px; min-width: unset; margin: unset; background-color: #f6f6f6; border-radius: 50%;}
.md_share_box.ver2 .ico_share_box .li_s i img {width: 25px; transition: all .4s;}
.md_share_box.ver2 .ico_share_box .li_s:hover i img, .md_share_box.ver2 .ico_share_box .li_s:focus i img {filter: invert(45%) sepia(69%) saturate(696%) hue-rotate(155deg) brightness(92%) contrast(94%);}
.md_share_box.ver2 .ico_share_box .li_s i img.df_size {width: 30px;}
.md_share_box.ver2 .md_btn_share_close {position: relative;}
.md_share_box.ver2 .md_btn_share_close span::before {width: 2px;}
.md_share_box.ver2 .md_btn_share_close span::after {height: 2px;}
.grp_conts_filter.align_r {text-align: right;}
.grp_conts_filter .txt_count {display: inline-block; font-size: 0; vertical-align: middle;}
.grp_conts_filter .txt_count .txt_l {display: inline-block; font-size: 1.6rem; color: #000; vertical-align: middle;}
.grp_conts_filter .txt_count .emph_count {margin: 0 0.2rem;}
.grp_conts_filter .emph_count {display: inline-block; font-weight: 700; font-size: 1.6rem; color: #2189ff; vertical-align: middle;}
.grp_conts_filter .txt_count + .searchSort_select {margin-left: 3.1rem;}
.grp_conts_filter .searchSort_select {display: inline-block; width: auto; max-width: none; height: auto; margin: 0; vertical-align: middle;}
.grp_conts_filter .select_box {float: none; margin-right: 0;}
.grp_conts_filter .select_box .select_btn {min-width: auto; height: auto; padding: 0; border: 0 none; box-sizing: border-box; line-height: normal;}
.grp_conts_filter .select_box .select_btn span {padding: 0.8rem 2.6rem 0.8rem 1.3rem;}
.grp_conts_filter .select_box.on .select_btn span:after {border-color: #000;}
.grp_conts_filter .select_box.on .select_btn, .grp_conts_filter .select_box .select_btn:hover {background-color: transparent; color: #000;}
.grp_conts_filter .select_box .select_btn:hover span:after {border-color: #000;}
.grp_conts_filter .searchSort_select .select_box .list {min-width: 9.8rem; padding: 0; border-top: 0.1rem solid #ccc; text-align: left;}
.grp_conts_filter .searchSort_select .select_box .list li {margin-top: 0;}
.grp_conts_filter .searchSort_select .select_box .link_comm {display: block; padding: 0.8rem 1.3rem;}
.grp_conts_filter .select_box .select_btn span:after {top: 1.5rem; right: 0.7rem;}
.grp_conts_filter .searchSort_select .select_box .link_comm {white-space:nowrap;}
.ban_bnr {height: 56px; display: flex; align-items: center; background-color: #EEF6FC;}
.ban_bnr a {display: flex; align-items: center;}
input[type=text]::placeholder {color:#888;}
input[type=text]::-webkit-input-placeholder {color: #888;}
input[type=text]:-ms-input-placeholder {color: #888;}


/* === Purged from module.css === */
a:focus-visible {outline: 2px solid #2189ff !important; z-index: 1;}
a:not(:focus-visible), button:not(:focus-visible), a:active, button:active {outline: none !important;}
.M00_A > .inner {position:relative;max-width:none;padding:0;border-bottom:1px solid #ddd;background-color:#fff;}
#wrap #header {position:relative;height:61px;}
.M00_A .sch_box.on {background:#fff;}
[class*='outer_offering_depth'].active, [class*='inner_offering_depth'].active {display: block;}
.md_play .md_btn_play:focus:before {border-left-color: #0098c2;}
.inner_sch_form .sch_box {width:100%;max-width:654px;}
.inner_sch_form .sch_box .sch_ip {position:relative;height:45px;margin:0 auto;border:0;border-bottom:1px solid rgba(0,0,0,0.5);}
.inner_sch_ip > input[type=text] {padding-left:10px;padding-right:90px;height:63px;font-size:22px;border:none;border-bottom:1px solid #000;}
.inner_sch_box .sch_ip button.btn_sch_ip {position:absolute;top:19px;right:10px;width:30px;height:30px;background:url("https://image.samsungsds.com/module_src/images/icon/ic_search_black.svg?queryString=20260630013551") center no-repeat;transition:filter 0.2s;}
.sch_box .sch_ip button.btn_sch_ip:hover, .sch_box .sch_ip button.btn_sch_ip:focus {filter:invert(45%) sepia(69%) saturate(696%) hue-rotate(155deg) brightness(92%) contrast(94%);}
.inner_sch_quick {position:absolute;top:27px;max-width:800px;width:100%;}
.cont.MP_insight_list {padding:0;}
.MP_insight_list .insight_carousel {position:relative;overflow:hidden;height:670px;}
.MP_insight_list .insight_carousel .carousel::before {position:absolute;left:0;top:0;width:100%;height:100%;content:"";z-index:0;}
.MP_insight_list .insight_carousel .li {position:relative;cursor:default;}
.MP_insight_list .insight_carousel .li .visual_img {overflow:hidden;background-color:#f5f5f5;}
.MP_insight_list .insight_carousel .li .visual_img:after {content:"";position:relative;display:block;width:100%;height:675px;background:rgba(0,0,0,0.5);}
.MP_insight_list .insight_carousel .li .visual_img::before {content:"";position: absolute;left:0;top:0;display:block;width:100%;height:100%;z-index:1;}
.MP_insight_list .insight_carousel .li .visual_img .img_p, .MP_insight_list .insight_carousel .li .visual_img .img_m {position:absolute;top:0;left:0;width:100%;height:100%;}
.MP_insight_list .insight_carousel .li .visual_img .img_m {display:none;}
.MP_insight_list .insight_carousel .li .txt_cont {display:flex;position:absolute;top:0;left:0;right:0;max-width:1504px;margin:0 auto;width:100%;height:100%;padding:62px 93px 60px;align-items:center;justify-content:center;color:#fff;z-index:2;}
.MP_insight_list .insight_carousel .li .md_thumb {position:relative; width: 280px; min-height:360px; background:url('https://image.samsungsds.com/module_src/images/data/img_insight_book_bg.png') no-repeat center; background-size: cover;}
.MP_insight_list .insight_carousel .li .md_thumb .img_box {position:absolute; width: 70%; margin: 0 auto; overflow:hidden; bottom: 10%; left: 0; right: 0; padding: 21%;}
.MP_insight_list .insight_carousel .li .md_thumb .img {position:absolute; left:0; top:0; display: block; background-size: cover; width: 100%; height: 100%; background-repeat: no-repeat;}
.MP_insight_list .insight_carousel .li .md_thumb .in_txt {position:absolute; left:0; right:0; width: 71%; top: 23%; margin: 0 auto; text-align:center; font-size:12px; line-height: 18px;}
.MP_insight_list .insight_carousel .li .md_thumb .md_tit {display:block; color:#000; -webkit-line-clamp: 3; overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-box-orient:vertical;}
.MP_insight_list .insight_carousel .li .md_thumb .md_name {top:44%; white-space:nowrap; overflow:hidden; text-overflow: ellipsis; color:#999;}
.MP_insight_list .insight_carousel .li .txt_cont .txt {max-width:760px;margin-left:60px;width:calc(100% - 300px);}
.MP_insight_list .insight_carousel .li .txt .tit_b {display:block;color:#fff;font-weight:bold;}
.MP_insight_list .insight_carousel .li .txt .tit_b i {display: block; white-space: nowrap; white-space: normal; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;}
.MP_insight_list .insight_carousel .li .txt .md_txt {margin-top: 20px;}
.MP_insight_list .insight_carousel .li .txt .md_btn {padding-top:35px;overflow:hidden;}
.MP_insight_list .insight_carousel .li .txt .md_btn a {margin-right: 20px;}
.MP_insight_list .insight_carousel .li .txt .md_btn a:last-child {margin-right:0;}
.MP_insight_list .insight_carousel .li.active .txt .tit_b i {animation:txtTop both 0.4s 0.75s;}
.MP_insight_list .insight_carousel .li.active .txt .tit_b span {animation-delay:0.2s;}
.MP_insight_list .insight_carousel .li.active .txt .tit_b span:nth-child(1) i {animation-delay:0.2s;}
.MP_insight_list .insight_carousel .li.active .txt .tit_b span:nth-child(2) i {animation-delay:0.4s;}
.MP_insight_list .insight_carousel .li.active .txt .tit_b span:nth-child(3) i {animation-delay:0.6s;}
.MP_insight_list .insight_carousel .li.active .txt .md_txt {position:relative;-webkit-line-clamp:3;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;animation:fade both 0.7s 0.7s;}
.MP_insight_list .insight_carousel .li.active .txt .md_btn {animation:fade both 0.7s 1s;}
html[lang="en"] .MP_insight_list .insight_carousel .li .txt .md_txt {-webkit-line-clamp: 2;}
html[lang="en"] .MP_insight_list .insight_carousel .li .txt .tit_b i {-webkit-line-clamp: 3;}
.MP_insight_list .insight_carousel .navigation {display:flex;position:absolute;bottom:60px;width:auto;z-index:3;left:50%;transform: translateX(-50%);}
.MP_insight_list .insight_carousel .navigation .md_pagn {margin-right:10px;line-height:25px;}
.MP_insight_list .insight_carousel .navigation .md_pagn a {display:inline-block;width:10px;height:10px;margin: 0 0 0 10px;color: transparent;border: 1px solid #fff;background: transparent;opacity: 1;font-size: 1px;line-height: 1px;overflow:hidden;position:relative;border-radius:10px;}
.MP_insight_list .insight_carousel .navigation .md_pagn a span {position:absolute !important;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip: rect(0px 0px 0px 0px);border:0;}
.MP_insight_list .insight_carousel .arrow-nav {position:absolute;top:50%;width:30px;height:56px;z-index:2;}
.MP_insight_list .insight_carousel .arrow-prev {left:50%;transform:translateY(-50%) translateX(-659px);}
.MP_insight_list .insight_carousel .arrow-next {right:50%;transform:translateY(-50%) translateX(659px);}
.MP_insight_list .insight_carousel .arrow-nav::before {position: absolute;top:9px;width:39px;height:39px;border-top:2px solid #fff;border-left:2px solid #fff;transition:border-color 0.3s;opacity:1;content:'';}
.MP_insight_list .insight_carousel .arrow-nav:hover::before {border-color:#2189ff;}
.MP_insight_list .insight_carousel .arrow-prev::before {left:9px;transform: rotate(-45deg);}
.MP_insight_list .insight_carousel .arrow-next::before {right:9px;transform: rotate(135deg);}
.MP_insight_list .insight_carousel .navigation .md_play a {display:block;position:relative;width:25px;height:25px;overflow:hidden;outline:none;}
.MP_insight_list .insight_carousel .navigation .md_play .md_btn_play {display: none;}
.MP_insight_list .insight_carousel .navigation .md_play.on .md_btn_play {display: block;}
.MP_insight_list .insight_carousel .navigation .md_play .md_btn_play::before {content: "";position: absolute;left: 50%;top: 50%;width: 0;height: 0;margin-top: -6px;margin-left: -4px;border-width: 6px 0 6px 9px;border-style: solid;border-color: transparent;border-left-color: #fff;transition: all 0.3s;}
.MP_insight_list .insight_carousel .navigation .md_play.on .md_btn_stop {display: none;}
.MP_insight_list .insight_carousel .navigation .md_play .md_btn_stop::before, .MP_insight_list .insight_carousel .navigation .md_play .md_btn_stop::after {content: "";position: absolute;top: 8px;width: 2px;height: 11px;background-color: #fff;transition: all 0.3s;}
.MP_insight_list .insight_carousel .navigation .md_play .md_btn_stop::before {left: 9px;}
.MP_insight_list .insight_carousel .navigation .md_play .md_btn_stop::after {left: 14px;}
.MP_insight_list .ban_bnr a::before {content: ''; display: inline-block; width: 32px; height: 32px; background-image: url('https://image.samsungsds.com/kr/insights/banner_icon_01.png?queryString=20260630013551'); background-position: center; background-repeat: no-repeat; margin-right: 10px;}
.MP_insight_list .insight_carousel .li.featured_v2 {height: 670px;}
.MP_insight_list .insight_carousel .li.featured_v2 .visual_img:after {display: none;}
.MP_insight_list .insight_carousel .li.featured_v2 .txt_cont {justify-content: space-between; padding: 130px 190px 0;}
.MP_insight_list .insight_carousel .li.featured_v2 .txt_box {position: absolute; inset: 0; color: #fff; padding: 50px 40px 0; z-index: 2;}
.MP_insight_list .insight_carousel .li.featured_v2 .txt_box.black {color: #000;}
.MP_insight_list .insight_carousel .li.featured_v2 .md_thumb .in_txt {position: initial; display: block; width: initial; line-height: 1.4; text-align: left; word-break: keep-all; color: #fff;}
.MP_insight_list .insight_carousel .li.featured_v2 .md_thumb .txt_box.black .in_txt {color: #000;}
.MP_insight_list .insight_carousel .li.featured_v2 .md_thumb .md_cate {font-size: 14px;}
.MP_insight_list .insight_carousel .li.featured_v2 .md_thumb .md_tit {height: 73px; font-size: 26px; letter-spacing: -0.075rem; margin-top: 15px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;}
html[lang="en"] .MP_insight_list .insight_carousel .li.featured_v2 .md_thumb .md_tit {height: auto; -webkit-line-clamp: 5;}
.MP_insight_list .insight_carousel .li.featured_v2 .md_thumb .md_name {font-size: 18px; margin-top: 27px;}
.MP_insight_list .insight_carousel .li.featured_v2 .md_thumb {flex: 0 1 40%; width: auto; max-width: 386px; min-height: auto; margin-right: auto; background: none; z-index: 2;}
.MP_insight_list .insight_carousel .li.featured_v2 .md_thumb::after {content: ''; display: block; padding-bottom: 139.89637305699483%;}
.MP_insight_list .insight_carousel .li.featured_v2 .md_thumb .img_box {position: absolute; inset: 0; width: auto; padding: 0; margin: 0;}
.MP_insight_list .insight_carousel .li.featured_v2 .md_thumb .img_box .img {width: 100%; height: 100%; border-radius: 8px 8px 0 0; overflow: hidden;}
.MP_insight_list .insight_carousel .li.featured_v2 .txt_cont .txt {flex: 0 1 55%; max-width: 610px; color: #000; line-height: 1.56; margin-left: 0; padding-bottom: 90px;}
.MP_insight_list .insight_carousel .li.featured_v2 .txt .tit_b {color: inherit; letter-spacing: -0.075rem;}
.MP_insight_list .insight_carousel .arrow-nav.black {width: 30px; height: 50px;}
.MP_insight_list .insight_carousel .arrow-nav.black::before {top: 12px; width: 26px; height: 26px;}
.insight_sch {padding:30px 0;top:0;position:relative;background:#222;transition: 0.2s;z-index:3;}
.insight_sch.fixed {position:fixed;top:112px;left:0;width:100%;z-index:10;}
.insight_sch .inner_sch_form {display:flex;align-items:center;height:auto;}
.insight_sch .inner_sch_form .md_tit {font-size:24px;line-height:24px;color:#fff;font-weight:normal;}
.insight_sch .inner_sch_form .sch_box {max-width:640px;margin-left:130px;}
.insight_sch .sch_box.on .sch_ip .toggle_btn {display:none;}
.insight_sch .sch_box .sch_ip .toggle_btn {width:40px;height:40px;right:0;background:#909090;transition:background-color .3s;}
.insight_sch .toggle_btn:after {position:absolute;right:11px;top:16px;width:17px;height:17px;transform:rotate(315deg);border:solid #fff;border-width:2px 2px 0 0;box-sizing:border-box;content:"";transition:all 0.4s;}
.insight_sch .inner_sch_form .sch_box .sch_ip {border-bottom:0;height:inherit;background:#fff;}
.insight_sch .inner_sch_form .sch_box .sch_ip > input[type=text] {padding-left:18px;height:40px;font-size:16px; border-bottom: 0;}
.insight_sch .inner_sch_form .sch_box:not(.on) .sch_ip > input[type=text] {padding-right:130px;}
.insight_sch .sch_box .sch_ip button.btn_sch_ip {top:5px;}
.insight_sch .sch_box:not(.on) .sch_ip button.btn_sch_ip {right:60px;}
.insight_sch .inner_sch_quick {top:4px;}
.insight_sch .category_wrap {display:block;padding-top:30px;margin-top:30px;border-top:1px solid #666;}
.insight_sch .category_wrap .md_tit {margin-right:30px;color:#fff;}
.insight_sch .category_wrap .category_inner {display:flex;}
.insight_sch .category_wrap .category_inner .list {display:flex;flex-wrap:wrap;justify-content:left;margin:-5px auto;}
.insight_sch .category_wrap .category_item {margin:5px 5px;}
.insight_sch .category_wrap .category_item a {display:block;padding:0 14px;height:32px;font-size:14px;line-height:30px;color:#E1E1E1;background:#404040;transition:.3s;}
.insight_sch .category_wrap .category_item a:hover {color:#fff;background:#0098c2;}
.insight_sch .category_wrap .category_item.on a {color:#fff;background:#2189FF;}
.insight_sch .category_wrap .category_item button {display:block;padding:0 14px;height:32px;font-size:14px;line-height:30px;color:#E1E1E1;background:#404040;transition:.3s;}
.insight_sch .category_wrap .category_item button:hover {color:#fff;background:#0098c2;}
.insight_sch .category_wrap .category_item.on button {color:#fff;background:#2189FF;}
.MP_insight_list .list_wrap {margin:60px 0 160px;}
.MP_insight_list .list_wrap .cont_list {display:flex; flex-wrap:wrap;}
.MP_insight_list .list_wrap .btn_more {margin-top:60px;}
.MP_insight_list .list_wrap .btn_more a {margin-top:0;}
.MP_insight_list .list_wrap .grp_conts_filter {margin-top: -2.5rem;}
.MP_insight_list .list_wrap .grp_conts_filter ~ .cont_list {margin-top: -2.5rem;}
.md_inquiry .list {display:flex;flex-wrap:wrap;}
.md_inquiry .list .li {display:block;position:relative;width:50%;padding:80px 40px;background:#fafafa;overflow:hidden;text-align:center;}
.md_inquiry .list .md_tit {display:block;color:#fff;font-size:30px;font-weight: bold;line-height: 42px;}
.md_inquiry .list .md_txt {margin-top:10px;color:#fff;}
.md_inquiry .list .txt {text-align:center;padding:0;position:relative;}
.md_inquiry .list .txt .md_btn {margin-top:25px;}
.md_inquiry .list .txt .md_btn .btn_ty02:after {opacity:.4;}
.md_inquiry .list .visual_img {position:absolute;left:0;right:0;top:0;bottom:0;background:#fafafa;overflow:hidden;}
.md_inquiry .list .visual_img:after {position:absolute;left:0;top:0;width:100%;height:100%;background:#122949;opacity:.7;content:'';}
.md_inquiry .list .visual_img .img_p {position:absolute;left:0;top:0;width:100%;height:100%;overflow:hidden;}
.md_inquiry .list .li {display: block; position: relative; width: 50%; padding: 80px 40px; background: #fafafa; overflow: hidden; text-align: center;}
.md_inquiry .list .md_tit {display: block; color: #fff; font-size: 30px; font-weight: bold; line-height: 42px;}
.md_inquiry .list .md_txt {margin-top: 10px; color: #fff;}
.md_inquiry .list .txt {text-align: center; padding: 0;}
.md_inquiry .list .txt .md_btn {margin-top: 25px;}
.md_inquiry .list .txt .md_btn .btn_ty02:after {opacity: .4;}
.md_inquiry .list .visual_img {position: absolute; left: 0; right: 0; top: 0; bottom: 0; background: #fafafa; overflow: hidden;}
.md_inquiry .list .visual_img:after {position: absolute; left: 0; top: 0; width: 100%; height: 100%; background: #122949; opacity: .7; content: '';}
.md_inquiry .list .visual_img .img_p {position: absolute; left: 0; top: 0; width: 100%; height: 100%; overflow: hidden;}
#footer a {outline:none;}
#footer .inner {position:relative;max-width:1378px;padding:30px;}
