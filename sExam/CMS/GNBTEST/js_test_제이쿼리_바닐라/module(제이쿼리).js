/** M00_A | GNB */
function M00_A(el) {
    _proto = M00_A.prototype;
    _this = this;
 
    this.lang = $('html').attr('lang') || 'en';
    this.country = $('html').attr('data-country') || 'en';
    this.$el = el;
    this.data = {
        history: true,
    };
    this.menuData;
    this.menuDataXml;
    this.breadData = [];
    this.gnbTopLinks;
    this.featureData;
    this.offeringData;
    this.currentPageType;
    this.gnbType = 'main';
    this.isOfferingMain = false;
    this.isMobile = getCurrentWidth() > 1024 ? false : true;
    this.isMobileDevice = isMobileDevice();
    this.isFocus = false;
    this.historyMaxCount = 0;
    this.historyStorageKey = 'visitHistory_' + this.lang + '_' + this.country;
 
    //202304-01 웹접근 전제 변수 추가
    this.$hd_iconNavigator = this.$el.find('.hd-etc');
    this.$hd_iconNavigator_area = this.$hd_iconNavigator.find('.util');
 
    var checkDone = {};
    var currentPage;
    var gnbMainTransparentTimer;
    var menuCloseTimer;
    var subMenuCloseTimer;
    var rnbMenuCloseTimer;
    var historyMenuCloseTimer;
    var gnbResizeTimer;
    var detectResizeHandlerTimer;
    var gnbYtPlayers = {};
    var gnbYtPlayersReady = {}; // 플레이어 준비 상태 저장
    var gnbYtplayerIds = ['gnbYoutube', 'gnbGenYoutube'];
	var SearchBtnCloseFocus = null;
	var LanguageBtnCloseFocus = null;


    // API 로드 완료 시 호출되는 함수
    window.onYouTubeIframeAPIReady = function() {
        gnbYtplayerIds.forEach(function(id) {
            gnbYtPlayersReady[id] = false; // 초기값 false
            gnbYtPlayers[id] = new YT.Player(id, {
                events: {
                    'onReady': function(event) {
                        gnbYtPlayersReady[id] = true; // 준비 완료 표시
                    }
                }
            });
        });
    };

    function stopAllPlayers() {
        Object.keys(gnbYtPlayers).forEach(function(id) {
            if(gnbYtPlayersReady[id] && gnbYtPlayers[id] && typeof gnbYtPlayers[id].stopVideo === "function"){
                gnbYtPlayers[id].stopVideo();
            }
        });
    }
    
    // YouTube IFrame API 로드
    // var tag = document.createElement('script');
    // tag.src = "https://www.youtube.com/iframe_api";
    // var firstScriptTag = document.getElementsByTagName('script')[0];
    // firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var host = '';
    if (window.location.hostname.includes('70.225.30.31')) host = 'http://70.225.30.31:8001';
             
    // 20240701 gnb 리뉴얼 테스트용 로컬&품질, 운영 분기
    $(function() {
        var reUrl = window.location.href;
        var portNums = [':7000/', ':8001/', ':8002/'];
        var mainUrl = 'samsungsds.com/';
        var excludeCountrys = ['cn'];
        // 포트 번호가 포함된 경우 체크
        var matchUrl = portNums.some(function(portNum) {
            return reUrl.includes(portNum);
        });
        // 특정 국가 (vn, cn)가 포함된 samsungsds.com URL 제외
        var isExcludedCountry = excludeCountrys.some(function(excludeCountry) {
            return reUrl.includes(mainUrl + excludeCountry);
        });
        // 포트 번호가 포함되어 있거나 특정 국가가 아닌 경우에만 클래스 추가
        if (matchUrl || !isExcludedCountry) {
            $('.gnb').addClass('gnb_ver2024 ver2024_2');
        }
    });
    
    _proto.init = function() {
        //console.log("init:: M00_A");
        // data 값 설정
        $.extend(_this.data, _this.$el.data());
 
        this.data.url = host + this.data.url;
        this.data.urlFeature = host + this.data.urlFeature;
        try {
            this.getData(this.data.url, function() {
                _this.setSticky();
                // _this.drawHistory();
                // _this.writeHistory();
                _this.setTextByCountry(); // 언어별 text 설정
                //_this.setHeightRightContainer();
            });
        } catch (e) {
            // console.log(e);
        }
 
        // setTimer(childpanel off)
        var $gnb = $('.M00_A');
        gnbMainTransparentTimer = new Timer(function() {
            if ($('body').hasClass('hid_s')) return;
            if (_this.$el.find('.gnb ul.menu > li.on').length == 0) {
                $gnb.removeClass('mc_chk');
            }
        }, 100);
        menuCloseTimer = new Timer(this.menuClose, 100);
        subMenuCloseTimer = new Timer(this.subMenuClose, 100);
        rnbMenuCloseTimer = new Timer(this.rnbMenuClose, 100);
        historyMenuCloseTimer = new Timer(this.historyMenuClose, 100);
        gnbResizeTimer = new Timer(this.resizeHandler, 100);
 
        $(window).on('load', function() {
            _this.gnbChildpanelStyle('windowLoad');
        });

        $(window).on('resize', function() {
            _this.isMobile = getCurrentWidth() > 1024 ? false : true; // detect mobile resolution
            _this.isMobileDevice = isMobileDevice(); // detect mobile device
        });

        fixedTab(); //20241119 fixed_tab : 공통 서브페이지 fixed탭
    };
 
    _proto.isIos = function() {
        var userAgent = navigator.userAgent.toLowerCase();
        var IS_IPHONE = /iphone/i.test(userAgent);
        var IS_IPAD = /iPad/i.test(userAgent);
        var IS_IPOD = /iPod/i.test(userAgent);
 
        return (IS_IOS = IS_IPHONE || IS_IPAD || IS_IPOD);
    };
 
    _proto.setGnbHeight = function() {
        var height;
        if (this.gnbType == 'offering') {
            if (this.isOfferingMain) {
                height = this.$el.height();
            } else {
                height = this.$el.height() + ($('.brandcolor').is(':visible') ? $('.brandcolor').height() : 0);
            }
        } else if (this.gnbType == 'normal' || this.gnbType == 'static') {
            height = this.$el.height();
        }
        if (this.gnbType != 'main') {
            $('#header').css({
                height: height + 'px',
            });
        }
        if (height == undefined) height = $('#header').height(); // [20240124] height값 undefined 일 때 값 추가
        document.documentElement.style.setProperty('--headerH', `${height}px`);
    };
 
    _proto.setSticky = function() {
        _this.setGnbHeight();
 
        this.$el.css({
            position: 'fixed',
            width: '100%',
            'z-index': '7000',
        });
        
        var scroll = $(window).scrollTop();
        var $wrap = $('#wrap');
        var hasTailBox = $('body').hasClass('tail_chk');
        var tailHeight = 0;
        if (_this.isMobile) hasTailBox = false;
        if (hasTailBox) {
            tailHeight = $('.tail_wrap').height();
        }
 
        if (scroll > $('#header').offset().top) {
            if (hasTailBox) {
                /*
                _this.$el.css({
                    'visibility' : 'hidden'
                });
                */
                _this.$el.css({
                    top: '-' + tailHeight + 'px',
                });
                /*
                setTimeout(function(){
                    _this.$el.css({
                        'visibility' : ''
                    });
                },200);
                */
            } else {
                _this.$el.css({
                    top: '0px',
                });
            }
        } else {
            if (hasTailBox) {
                /*
                _this.$el.css({ 
                    'visibility' : 'hidden'
                });
                */
                _this.$el.css({
                    top: $('#header').offset().top - scroll - tailHeight + 'px',
                });
                /*
                setTimeout(function(){
                    _this.$el.css({
                        'visibility' : ''
                    });
                },200);
                */
            } else {
                _this.$el.css({
                    top: '0px',
                });
            }
        }
 
        if ($(window).scrollTop() > 0) {
            $wrap.removeClass('scroll_chk');
        } else {
            $wrap.addClass('scroll_chk');
        }
    };
 
    _proto.getData = function(dataUrl, callback) {
        var methodType = dataUrl.indexOf('/data_ajax/') < 0 ? 'POST' : 'GET';
        $.ajax({
            url: dataUrl,
            method: methodType,
            data: null,
            dataType: 'json',
            async: false,
            success: function(data) {
                _this.setupMenu(data);
                if (callback) {
                    callback();
                }
            },
            error: function() {
                console.log('GNB getData Ajax error :::::::::::::::::::', arguments);
            },
        });
    };
 
    _proto.setupMenu = function(data, callback) {
        this.menuData = data;
        this.menuDataXml = $.parseXML(OBJtoXML({ root: data }).replace(/&/g, '&amp;'));
        var target = this.menuDataXml.getElementsByTagName('menuId');
        var type;
        for (var i = 0; i < target.length; i++) {
            var idNode = target[i];
            if (idNode.textContent == this.data.current) {
                currentPage = idNode;
                type = getChildByNodeName(idNode.parentNode, 'type').textContent;
                _this.currentPageType = type;
                type ? (type = type.split('_')[0]) : null;
                break;
            }
        }
 
        if (type == 'static') {
            this.gnbType = 'static';
            this.setBreadData();
        } else if (type == 'offering') {
            this.gnbType = 'offering';
        } else if (type == 'normal') {
            this.gnbType = 'normal';
        } else {
            this.gnbType = 'main';
        }
        var urlHtml = [];
        var rnbHtml = [];
        for (var group in this.menuData) {
            var menuGroup = this.menuData[group];
            for (var depth1 in menuGroup) {
                if (menuGroup[depth1].gnbHtml) {
                    var d1Html = host + menuGroup[depth1].gnbHtml;
                    var d1rnbHtml = host + menuGroup[depth1].rnbHtml;
                    urlHtml.push(d1Html);
                    rnbHtml.push(d1rnbHtml);
                }
            }
        }
        $.ajax({
            url: this.data.urlFeature,
            method: 'get',
            data: null,
            dataType: 'html',
            async: false,
            success: function(data) {
                _this.featureData = data;
                if (type == 'offering' || type == 'normal') {
                    _this.setBreadData();
                } else {
                    _this.drawGnb();
                    _this.setOfferingGnbMh();
                }
 
                if (callback) {
                    callback();
                }
            },
            error: function() {
                console.log('GNB getData Ajax error :::::::::::::::::::', arguments);
            },
        });
    };
 
    // gnb Title matchHeight
    _proto.setOfferingGnbMh = function(data) {
        if (!$('.offering_gnb').length) return;
        var mhTargetWrap = $('.offering_gnb');
        var mhTargetTit = mhTargetWrap.find('.md_tit');
        var mhTargetTxt = mhTargetWrap.find('.md_txt');
        var opt = {
            init: { tbyRow: true, remove: false },
            remove: { tbyRow: false, remove: true },
        };
 
        mhTargetTit.matchHeight(opt.init);
        mhTargetTxt.matchHeight(opt.init);
    };
 
    _proto.setBreadData = function(data) {
        if (!this.menuDataXml && data) {
            this.menuDataXml = $.parseXML(OBJtoXML({ root: data }).replace(/&/g, '&amp;'));
        }
        var target = this.menuDataXml.getElementsByTagName('menuId');
        for (var i = 0; i < target.length; i++) {
            var idNode = target[i];
            if (idNode.textContent == this.data.current) {
                var tit = getChildByNodeName(idNode.parentNode, 'title').textContent;
                var url = getChildByNodeName(idNode.parentNode, 'url').textContent;
                var tar = getChildByNodeName(idNode.parentNode, 'target').textContent;
                _this.breadData.push({ title: tit, url: url || null, target: tar || null });
                // breadcrumb 모두 수집시 tree 가져옴
                if (getChildByNodeName(idNode.parentNode, 'type').textContent == 'offering_main') {
                    this.getOfferingTree(idNode.textContent);
                    this.drawBread();
                } else if (getChildByNodeName(idNode.parentNode, 'type').textContent == 'normal_main') {
                    this.getOfferingTree(idNode.textContent);
                    this.drawBread();
                } else if (getChildByNodeName(idNode.parentNode, 'type').textContent == 'static') {
                    this.drawBread();
                } else {
                    // breadcrumb 수집
                    getParentTarget(idNode.parentNode);
                }
                break;
            }
        }
 
        function getParentTarget(node) {
            var parent = node.parentNode;
            if (parent && getChildByNodeName(parent, 'type')) {
                //부모가 있고 type 속성이 있을시
                // "오퍼링" 메뉴 패스
                if (getChildByNodeName(parent, 'type').textContent == 'offering_cate') {
                    getParentTarget(parent);
                    return;
                }
                /*
                if(getChildByNodeName(parent, "type").textContent == "normal_cate"){
                    getParentTarget(parent);
                    return;
                }
                */
                if (getChildByNodeName(parent, 'type').textContent == 'offering_main') {
                    _this.offeringColor = getChildByNodeName(parent, 'color').textContent;
                    _this.getOfferingTree(getChildByNodeName(parent, 'menuId').textContent);
                }
 
                if (getChildByNodeName(parent, 'type').textContent == 'normal_main') {
                    _this.getOfferingTree(getChildByNodeName(parent, 'menuId').textContent);
                }
 
                var tit = getChildByNodeName(parent, 'title').textContent;
                var url = getChildByNodeName(parent, 'url').textContent;
                var tar = getChildByNodeName(parent, 'target').textContent;
                _this.breadData.unshift({ title: tit || null, url: url || null, target: tar || null });
                getParentTarget(parent);
            } else {
                return;
            }
        }
        if (this.breadData.length) this.drawBread();
    };
 
    _proto.drawBread = function() {
        var len = this.breadData.length;
        var current = this.breadData[len - 1];
        var color = _this.offeringColor;
 
        var htmlStr = '<div class="brandcolor" style="background-color:' + color + '"><div class="inner">'; //원본

        if (this.gnbType == 'normal' || this.gnbType == 'static') {
            htmlStr = '<div class="brandcolor normal"><div class="inner">';
        }
        if (this.gnbType == 'offering') {
            // offering main 일때
            if (this.offeringData.menuId == $(currentPage).text()) {
                htmlStr = '<div class="brandcolor normal"><div class="inner">';
                this.isOfferingMain = true;
            } else {
                htmlStr += '<p class="title">' + current.title + '</p>';
            }
        }
        //htmlStr += '<div class="breadcrumb"><a href="/'+ langSet[ _this.lang ].countryCode + '/index.html"><span>Home</span></a>';
        htmlStr += '<nav class="breadcrumb"><a href="' + _this.getHomeUrl() + '"><span>Home</span></a>';
        for (var i = 0; i < len; i++) {
            if (i == len - 1 || !this.breadData[i].url) {
                htmlStr += '<span>' + this.breadData[i].title + '</span>';
            } else {
                htmlStr += '<a href="' + this.breadData[i].url + '" target="' + this.breadData[i].target + '" ><span>' + this.breadData[i].title + '</span></a>';
            }
        }
        htmlStr += '</nav></div></div>';
        // 스티키 제어를 위해 append 위치 바뀔 수 있음
        !$(".brandcolor").length ? $('#header').append(htmlStr) : null;
        $('#header .brandcolor').css({ 'top': this.$el.height() + 'px' });
        /*
        if (this.gnbType == "normal"){
            !$(".brandcolor").length ? $('#header').after(htmlStr) : null;//$(".brandcolor").replaceWith(htmlStr)
        } else {
            !$(".brandcolor").length ? this.$el.append(htmlStr) : null;//$(".brandcolor").replaceWith(htmlStr)
        }
        */

        var breadColor = $(".brandcolor").css("background-color");
        var insight_CategoryCheck;
        if(this.country === "eu" || this.country === "in") {
            insight_CategoryCheck = `g${this.country}6`
        } else if(this.country === "la"){
            insight_CategoryCheck = `g${this.country}c6`
        } else {
            insight_CategoryCheck = `g${this.country}5`
        }
        if((breadColor == 'rgba(0, 0, 0, 0)' && this.gnbType == "offering") || this.gnbType == "static" || this.offeringData.menuId === insight_CategoryCheck){
            //바탕색이 흰색일 경우 브래드크럼색 회색처리
            $(".breadcrumb a").css({color:'#888'});
            $(".breadcrumb span").css({color:'#888'});
        }
        //고객사례,인사이트 등 게시판성 페이지 상세페이지일 경우 브래드크럼색 회색처리
        if($('meta[property="og:type"]' ).attr( 'content' )=='article'){
            $(".breadcrumb a").css({color:'#888'});
            $(".breadcrumb span").css({color:'#888'});
        }
        //이벤트 리스트페이지 브래드크럼 검정처리
        if($("#postType").val()==='event'){
            $(".breadcrumb a").css({color:'#FFF'});
            $(".breadcrumb span").css({color:'#FFF'});
        }


        /** 20230420 서브페이지 클라우드 였을때 */
        if (this.offeringData == undefined) {
            return false;
        } else {
            if (this.offeringData.menuId == "gkr12"){
                $('.brandcolor').addClass('brandBG_01');
            }
        }
        /** 20230420 서브페이지 클라우드 였을때 */
    };
 
    _proto.writeHistory = function() {
        if (_this.data.history == false) return;
 
        // 라이브러리 > 리소스  || 컨텐츠 타입 구분값   백서,프레젠테이션,기술소개 등
        var isresEyebrow = !!_this.getUrlParams().resEyebrow ? true : false;
        var storage = window.localStorage;
        var historyArray = JSON.parse(storage.getItem(_this.historyStorageKey));
        var historyObj = {};
 
        if (!!historyArray == false || Array.isArray(historyArray) == false) {
            historyArray = [];
        }
 
        // 중복 페이지 검색
        var isOverlap = false;
        if (historyArray.length > 0) {
            historyArray.map(function(data) {
                if (data.menuId == _this.data.current && data.url == window.location.href) isOverlap = true;
            });
        }
        if (isOverlap) return;
 
        $('meta[property*="og:"]').each(function() {
            var $this = $(this);
            var key = $this.attr('property').split(':')[1];
 
            historyObj[key] = $this.attr('content');
        });
 
        var locationTxt = (function(breadData) {
            var location = '';
            for (var i = 0; i < breadData.length; i++) {
                if (i == breadData.length - 1) {
                    location += breadData[i].title;
                } else {
                    location += breadData[i].title + ' > ';
                }
            }
            return breadData.length == 0 ? 'Home' : location;
        })(_this.breadData);
 
        historyObj['menuId'] = _this.data.current;
        historyObj['location'] = locationTxt;
        historyObj['url'] = window.location.href;
        // 리소스 컨텐츠일때 title 값 컨텐츠 타입으로 변경
        if (isresEyebrow) {
            historyObj['location'] = decodeURI(_this.getUrlParams().resEyebrow);
        }
        if (historyArray.length > _this.historyMaxCount - 1) {
            historyArray.pop();
        }
        // add history
        if (historyArray.length == 0) {
            historyArray.push(historyObj);
        } else {
            historyArray.splice(0, 0, historyObj);
        }
        // set data
        storage.setItem(_this.historyStorageKey, JSON.stringify(historyArray));
    };
 
    _proto.clearHistory = function() {
        window.localStorage.removeItem(_this.historyStorageKey);
        _this.drawHistory();
        _this.writeHistory();
    };
 
    _proto.getHistoryData = function() {
        return JSON.parse(window.localStorage.getItem(_this.historyStorageKey));
    };
 
    _proto.drawHistory = function() {
        var historyDataArray = this.getHistoryData();
        var $history;
 
        if (Array.isArray(historyDataArray) && historyDataArray.length) {
            $history = $('<ul></ul>');
            for (var i = 0; i < historyDataArray.length; i++) {
                var item = historyDataArray[i];
                var itemStr = '<li>';
                itemStr += '<div class="summary">';
                itemStr += '<span class="bread" title="' + item.location + '">' + item.location + '</span>';
                itemStr += '<p class="title"><a href="' + item.url + '">' + item.title + '</a></p>';
                itemStr += '</div>';
                itemStr += '<div class="pic">';
                itemStr += '<a href="' + item.url + '" target="_self"><img src="' + item.image + '" alt="' + item.title + '"></a>';
                itemStr += '</div></li>';
 
                if (i == 0 && item.menuId == _this.data.current && item.url == window.location.href) {} else {
                    $history.append(itemStr);
                }
            }
 
            if (historyDataArray.length == 1 && historyDataArray[0].menuId == _this.data.current && historyDataArray[0].url == window.location.href) {
                $history = $('<p class="empty-text">' + langSet[_this.lang].history.emptyHistory + '</p>');
                $('.history .btn-clear').hide();
            } else {
                $('.history .btn-clear').show();
            }
        } else {
            $history = $('<p class="empty-text">' + langSet[_this.lang].history.emptyHistory + '</p>');
            $('.history .btn-clear').hide();
        }
        this.$el.find('.pages').empty().append($history);
    };
 
    _proto.getOfferingTree = function(menuId) {
        for (var group in this.menuData) {
            var menuGroup = this.menuData[group];
            for (var depth1 in menuGroup) {
                var d1Items = menuGroup[depth1].items || null;
                var d1PanelType = menuGroup[depth1].panelType;
                if (d1Items && d1PanelType == 'offering' && this.gnbType == 'offering') {
                    for (var depth2 in d1Items) {
                        var d2MenuId = d1Items[depth2].menuId;
                        if (d2MenuId == menuId) {
                            this.offeringData = d1Items[depth2];
                            this.drawGnb();
                            break;
                        }
                    }
                }
 
                if (d1Items && d1PanelType == 'normal' && this.gnbType == 'normal') {
                    for (var depth2 in d1Items) {
                        var d2MenuId = d1Items[depth2].menuId;
                        if (d2MenuId == menuId) {
                            this.offeringData = d1Items[depth2];
                            this.drawGnb();
                            break;
                        }
                    }
                }
            }
        }
    };
 
    _proto.getHomeUrl = function() {
        return typeof indexURL !== 'undefined' ? indexURL : '/' + langSet[_this.lang].countryCode + '/index.html';
    };
 
    //220922 rnb User JSON 호출
    /*
    _proto.getUser = function(){
        return JSON.parse(sessionStorage.getItem('user'));
    }
    */
 
    _proto.drawGnb = function() {
        //console.log("drawGnb:: "+this.gnbType);
        /* gnb code */
        var $cnt = $('<div class="hd-cnt"></div>');
        $cnt.append('<p class="logo"><a href="' + _this.getHomeUrl() + '" aria-label="SAMSUNG SDS"></a></p>'); // Modify | 2020-08-20 | M00_A | h1.logo → p.logo 변경
        var $gnsb;
        var lang = $('html').attr('lang') || 'en'; //210408 | 웹접근성 | title 메뉴열림 추가
 
        const country = this.country === 'kr' || this.country === 'en' ? this.country : '';
        const path = `/${country}/gnb/g${country}01/`; // 파일의 위치를 품질의 경로와 동일하게 수정되었습니다. (기존 '/module_src/data_ajax/'에서 '/kr/gnb/gkr01/'로 변경)
 
        // gsnb title의 items 영역을 리뉴얼된 방식으로 표현하고 싶다면 menuId를 추가해 주세요.
        const exclude = [{
            menuId: `g${country}127`,
            file: 'cloud_products.html',
        }, ];
 
        for (var group in this.menuData) {
            var menuGroup = this.menuData[group];
            var $menuUl = $('<ul class="menu ' + String(group).camelToDash() + '">');
 
            for (var depth1 in menuGroup) {
                var gnbHtmlUrl = menuGroup[depth1].gnbHtml; //20240717 ajax url

                var d1Title = menuGroup[depth1].title;
                var d1GnbTitle = menuGroup[depth1].gnb_title;
                var d1featureIdId = menuGroup[depth1].featureId;
                var d1PanelType = menuGroup[depth1].panelType;
                var panelStyle = menuGroup[depth1].style;
                var d1Items = menuGroup[depth1].items || null;
                var d1Url = menuGroup[depth1].url || 'javascript:void(0)';
                var d1Target = menuGroup[depth1].target || null;
                var $menuItem_d1 = $('<li' + (!d1Items ? ' class="no-child"' : '') + '><div class="title"><a href="' + d1Url + '" ' + (d1Target ? 'target="' + d1Target + '"' : '') + '>' + (d1GnbTitle ? d1GnbTitle : d1Title) + '</a></div></li>');
                var $menuPanel_d1;
                var $menuPanel_d2;
                var $menuPanel_d3;

                // 20241011 수정된 클라우드 gnb 클래스
                var CheckId = ['gkr1', 'gen1'];
                if (CheckId.includes(d1featureIdId)) {
                    $($menuItem_d1).addClass('renewal_menu_depth');
                }
                                
                // gnb html 파일로 적용할 패널 20240816
                if (d1PanelType == "offering") {
                    $menuPanel_d1 = $('<div class="childpanel ' + panelStyle + '"></div>');

                    if (panelStyle && gnbHtmlUrl) {
                        $menuItem_d1.append($menuPanel_d1);
                        $menuPanel_d1.append(this.getHtmlContent(gnbHtmlUrl));
                    }else {
                        $menuPanel_d1_inner = $('<div class="inner basic"><ul class="items"></ul></div>');
                        $menuPanel_d1.append($menuPanel_d1_inner);
                        $menuItem_d1.append($menuPanel_d1);
                        $menuPanel_d2 = $menuPanel_d1_inner.find('.items').eq(0);
 
                        //d1PanelType 분기 없앰
                        for (var depth2 in d1Items) {
                            var d2Title = d1Items[depth2].title;
                            var d2Url = d1Items[depth2].url || 'javascript:void(0)';
                            var d2Target = d1Items[depth2].target || '_self';
                            var d2Items = null;
 
                            if (d1Items[depth2].type == 'offering_main') {
                                try {
                                    d2Items = !!d1Items[depth2].items && d1Items[depth2].items[0].items; // offering cate get
                                } catch (e) {
                                    console.log('error', e);
                                }
                            } else {
                                d2Items = !!d1Items[depth2].items && d1Items[depth2].items;
                            }
                            var $menuItem_d2 = $('<li></li>');
                            var $menuItem_d2_tit = d2Url == 'javascript:void(0)' ? '<span>' + d2Title + '</span>' : '<a href="' + d2Url + '" target="' + d2Target + '">' + d2Title + '</a>';
                            $menuItem_d2.append('<div class="title">' + $menuItem_d2_tit + '</div>');
 
                            if (d2Items) {
                                $menuPanel_d3 = $('<ul class="items"></ul>');
                                $menuItem_d2.append($menuPanel_d3);
                                for (var depth3 in d2Items) {
                                    var d3Title = d2Items[depth3].title;
                                    var d3Url = d2Items[depth3].url || 'javascript:void(0)';
                                    var d3Target = d2Items[depth3].target || '_self';
                                    var $menuItem_d3 = $('<li><div class="title"><a href="' + d3Url + '" target="' + d3Target + '">' + d3Title + '</a></div></li>');
                                    
                                    var d3Items = d2Items[depth3].items || null;
                                    if (d3Items && d3Items.length > 0) {
                                        var $menuPanel_d4 = $('<ul class="items depth4"></ul>');
                                        $menuItem_d3.append($menuPanel_d4);
                                        for (var depth4 in d3Items) {
                                            var d4Title = d3Items[depth4].title;
                                            var d4Url = d3Items[depth4].url || 'javascript:void(0)';
                                            var d4Target = d3Items[depth4].target || '_self';
                                            var $menuItem_d4 = $('<li><div class="title"><a href="' + d4Url + '" target="' + d4Target + '">' + d4Title + '</a></div></li>');
                                            
                                            var d4Items = d3Items[depth4].items || null;
                                            if (d4Items && d4Items.length > 0) {
                                                var $menuPanel_d5 = $('<ul class="items depth5"></ul>');
                                                $menuItem_d4.append($menuPanel_d5);
                                                for (var depth5 in d4Items) {
                                                    var d5Title = d4Items[depth5].title;
                                                    var d5Url = d4Items[depth5].url || 'javascript:void(0)';
                                                    var d5Target = d4Items[depth5].target || '_self';
                                                    var $menuItem_d5 = $('<li><div class="title"><a href="' + d5Url + '" target="' + d5Target + '">' + d5Title + '</a></div></li>');
                                                    if (d4Items[depth5].hidden !== true) {
                                                        $menuPanel_d5.append($menuItem_d5);
                                                    }
                                                }
                                            }
                                            if (d3Items[depth4].hidden !== true) {
                                                $menuPanel_d4.append($menuItem_d4);
                                            }
                                        }
                                    }
                                    
                                    if (d2Items[depth3].hidden !== true && d2Items[depth3].onlySUB !== true) {
                                        $menuPanel_d3.append($menuItem_d3);
                                    }
                                }
                            } else {
                                $menuItem_d2.addClass('no-child');
                            }
 
                            if (d1Items[depth2].onlyRNB !== true && d1Items[depth2].hidden !== true && d1Items[depth2].onlySUB !== true) {
                                this.checkMainGnbInOfferingItem(d2Title, $menuPanel_d3); // 20210209 추가
                                $menuPanel_d2.append($menuItem_d2);
                            }
                        }
                    }
                    // feature 그려줘야함
                    var $feature = $(this.featureData).find('#' + d1featureIdId + '>.feature');
                    if ($feature.length) {
                        $menuPanel_d1.find('.inner').append($feature);
                    }
 
                    $menuUl.attr('role', 'tablist');
                    $menuItem_d1
                        .find('>.title > a')
                        .attr('role', 'tab')
                        .attr('id', 'tab_' + panelStyle)
                        .attr('aria-selected', 'false')
                        .attr('aria-controls', 'panel_' + panelStyle);
 
                    $menuItem_d1
                        .find('.childpanel')
                        .attr('role', 'tabpanel')
                        .attr('id', 'panel_' + panelStyle)
                        .attr('aria-labelledby', 'tab_' + panelStyle);
                }
 
                if (d1PanelType == 'normal' && d1Items) {
                    $menuPanel_d1 = $('<div class="childpanel ' + panelStyle + '"><div class="inner"><ul class="items"></ul></div></div>');
                    $menuItem_d1.append($menuPanel_d1);
                    $menuPanel_d2 = $menuPanel_d1.find('.items').eq(0);
 
                    //d1PanelType 분기 없앰
                    if (panelStyle == 'about') {
                        d1Items = d1Items[0].items;
                        for (var depth2 in d1Items) {
                            var d2Title = d1Items[depth2].title;
                            var d2Url = d1Items[depth2].url || 'javascript:void(0)';
                            var d2Target = d1Items[depth2].target || '_self';
                            // 1depth오퍼링 하위인 경우 3depth 오퍼링 내용을 표시함
                            var d2Items = (d1Items[depth2].type == 'normal_main' ? d1Items[depth2].items[0].items : d1Items[depth2].items) || null;
                            var $menuItem_d2 = $('<li></li>');
                            var $menuItem_d2_tit = d2Url == 'javascript:void(0)' ? '<span>' + d2Title + '</span>' : '<a href="' + d2Url + '" target="' + d2Target + '">' + d2Title + '</a>';
                            $menuItem_d2.append('<div class="title">' + $menuItem_d2_tit + '</div>');
 
                            if (d2Items) {
                                $menuPanel_d3 = $('<ul class="items"></ul>');
                                $menuItem_d2.append($menuPanel_d3);
                                for (var depth3 in d2Items) {
                                    var d3Title = d2Items[depth3].title;
                                    var d3Url = d2Items[depth3].url || 'javascript:void(0)';
                                    var d3Target = d2Items[depth3].target || '_self';
                                    var $menuItem_d3 = $('<li><div class="title"><a href="' + d3Url + '" target="' + d3Target + '">' + d3Title + '</a></div></li>');
                                    if (d2Items[depth3].hidden !== true) {
                                        $menuPanel_d3.append($menuItem_d3);
                                    }
                                }
                            } else {
                                $menuItem_d2.addClass('no-child');
                            }
 
                            if (d1Items[depth2].hidden !== true) {
                                this.checkMainGnbInAboutItem(d2Title, $menuPanel_d3); // 20210604 추가
                                $menuPanel_d2.append($menuItem_d2);
                            }
                        }
                    } else {
                        for (var depth2 in d1Items) {
                            var d2Title = d1Items[depth2].title;
                            var d2Url = d1Items[depth2].url || 'javascript:void(0)';
                            var d2Target = d1Items[depth2].target || '_self';
                            // 1depth오퍼링 하위인 경우 3depth 오퍼링 내용을 표시함
                            var d2Items = d1Items[depth2].items || null;
 
                            if (d2Items) {
                                for (var depth3 in d2Items) {
                                    var d3Title = d2Items[depth3].title;
                                    var d3Url = d2Items[depth3].url || 'javascript:void(0)';
                                    var d3Target = d2Items[depth3].target || '_self';
                                    var $menuItem_d3 = $('<li><div class="title"><a href="' + d3Url + '" target="' + d3Target + '">' + d3Title + '</a></div></li>');
                                    if (d2Items[depth3].hidden !== true) {
                                        $menuPanel_d2.append($menuItem_d3);
                                    }
                                }
                            } else {
                                //$menuItem_d2.addClass("no-child");
                            }
                            //$menuPanel_d2.append($menuItem_d2);
                        }
                    }
 
                    // feature 그려줘야함
                    var $feature = $(this.featureData).find('#' + d1featureIdId + '>.feature');
                    if ($feature.length) {
                        $menuPanel_d1.find('.inner').append($feature);
                    }
                    $menuUl.attr('role', 'tablist');
                    $menuItem_d1
                        .find('>.title > a')
                        .attr('role', 'tab')
                        .attr('id', 'tab_' + panelStyle)
                        .attr('aria-selected', 'false')
                        .attr('aria-controls', 'panel_' + panelStyle);
 
                    $menuItem_d1
                        .find('.childpanel')
                        .attr('role', 'tabpanel')
                        .attr('id', 'panel_' + panelStyle)
                        .attr('aria-labelledby', 'tab_' + panelStyle);
                }
                if (menuGroup[depth1].hidden !== true && menuGroup[depth1].onlyRNB !== true) {
                    $menuUl.append($menuItem_d1);
                }
            } //for end depth1
            // static page group
            if (group !== 'menuGroup4' && group !== 'menuGroup5') {
                $cnt.append($menuUl);
            }
        } // for end group
 
        if (this.gnbType == 'offering' || this.gnbType == 'normal') {
            //if (_this.isMobile){
            /* 210412 | 접근성 | aria-expanded 속성 추가 */
            $gsnbMobile = $(
                '<div class="gsnb mobile ' +
                (this.gnbType == 'normal' ? 'normal' : '') +
                '"><div class="inner"><div class="title"><a href="javascript:void(0)" aria-expanded="false">' +
                this.offeringData.title +
                '</a></div></div></div>'
            );
            /* //210412 | 접근성 | aria-expanded 속성 추가 */
            $innerMobile = $gsnbMobile.find('>.inner');
 
            var makedObj = _this.makeMobileGsnb({ path, exclude });
            var $owlContainer = $('<div class="owl-carousel"><div></div></div>');
            $owlContainer.find('>div').eq(0).append(makedObj);
            $innerMobile.append($owlContainer);
 
            $gsnb = $('<div class="gsnb desktop' + (this.gnbType == 'normal' ? 'normal' : '') + '"><div class="inner"><ul></ul></div></div>');
            $inner = $gsnb.find('>.inner>ul');
 
            if (this.offeringData.url) {
                $inner.append(
                    '<li class="offering-cate"><div class="title"><a href="' +
                    this.offeringData.url +
                    '" target="' +
                    (this.offeringData.target || '_self') +
                    '">' +
                    this.offeringData.title +
                    '</a></div></li>'
                );
            } else {
                $inner.append('<li class="offering-cate no-link"><div class="title"><a href="javascript:void(0)">' + this.offeringData.title + '</a></div></li>');
            }
 
            for (var i = 0; i < this.offeringData.items.length; i++) {
                var cate = this.offeringData.items[i];
                var $cate = $('<li><div class="title"><a href="' + (cate.url || 'javascript:void(0)') + '" target="' + (cate.target || '_self') + '">' + cate.title + '</a></div></li>');
                var $menuPanel_d2;
                var isCurrentWithin = false; // 현재 페이지가 해당 그룹에 포함되었는지 확인
                if (cate.items) {
                    $menuPanel_d2 = $('<ul class="items"></ul>');
 
                    for (var ii = 0; ii < cate.items.length; ii++) {
                        var sub = cate.items[ii];
 
                        if (_this.data.current == sub.menuId) isCurrentWithin = true;
 
                        var $sub = $('<li><div class="title"><a href="' + (sub.url || 'javascript:void(0)') + '" target="' + (sub.target || '_self') + '">' + sub.title + '</a></div></li>');
                        let _excludeIndex = exclude.findIndex((element) => element.menuId === cate.menuId);
 
                        if (_excludeIndex > -1) {
                            // exclude[n].menuId에 존재할 경우 실행합니다.
                            $menuPanel_d2 = $('<div class="items"></div>');
                            // cate.menuId 값이 exclude 배열에 존재하기 때문에 태그를 생성하지 않습니다.
                            // exclude[n].file에 할당된 html 파일을 읽어들입니다.
                            $($menuPanel_d2).addClass('renewal cstm_scrl');
                            $.get(path + exclude[_excludeIndex].file, function(data) {
                                $($menuPanel_d2).html(data);
                                // callback complete
                                resizeGsnbDropdownMenu();
                            });
                        } else {
                            var $menuPanel_d3;
                            if (sub.items) {
                                // hidden 항목만 들어있는지 확인
                                var isItemsHasOnlyHiddenItem = (function(items) {
                                    var result = true;
                                    items.map(function(obj, index, items) {
                                        if (!!obj.hidden == false) result = false;
                                    });
                                    return result;
                                })(sub.items);
 
                                if (isItemsHasOnlyHiddenItem == false) {
                                    $sub.addClass('offering-list-sub');
                                }
                                $menuPanel_d3 = $('<ul class="items"></ul>');
                                $sub.append($menuPanel_d3);
                                for (var iii = 0; iii < sub.items.length; iii++) {
                                    var item = sub.items[iii];
 
                                    if (_this.data.current == item.menuId) isCurrentWithin = true;
 
                                    var $item = $(
                                        '<li><div class="title"><a href="' + (item.url || 'javascript:void(0)') + '" target="' + (item.target || '_self') + '">' + item.title + '</a></div></li>'
                                    );
 
                                    if (item.hidden !== true) {
                                        $menuPanel_d3.append($item);
                                    }
                                }
                            }
 
                            if (sub.hidden !== true && sub.onlyMainShow !== true) {
                                $menuPanel_d2.append($sub);
                            }
                        }
                    }
                    // hidden 항목만 들어있는지 확인
                    var isItemsHasOnlyHiddenItem = (function(items) {
                        var result = true;
                        items.map(function(obj, index, items) {
                            if (!!obj.hidden == false) result = false;
                        });
                        return result;
                    })(cate.items);
 
                    if (isItemsHasOnlyHiddenItem == false) {
                        //220331 | 접근성 | GSNB title 제거
                        $cate.addClass('offering-list');
                        //.find("> .title > a").attr("title", langSet[_this.lang].menuState.activeStr);
                        $cate.append($menuPanel_d2);
                    }
 
                    if (isCurrentWithin || this.data.current == cate.menuId) {
                        $cate.addClass('selected');
                    }
                } else {
                    if (this.data.current == cate.menuId) {
                        $cate.addClass('selected');
                    }
                }
 
                if (cate.hidden !== true) {
                    $inner.append($cate);
                }
            }
 
            // 20240705 서브페이지 LNB 서브 메뉴, lnb_yn 조건 있으면 T, 없으면 F 으로 div class=gsnb desktop 생성
            if(this.offeringData.lnb_yn != "F" || !this.offeringData.lnb_yn) {
                this.$el.find('>.inner').append($gsnb);
                this.$el.find('>.inner').append($gsnbMobile);
            }
        }
 
        this.$el.find(".gnb").prepend($cnt);
        
        /** *********************************** drawGnb내 rnb code *********************************** */
        /* rnb code */
        var $head = $(
            '<div class="head"><p class="logo"><a href="' + _this.getHomeUrl() +'" aria-label="SAMSUNG SDS"></a></p><a href="javascript:void(0)" class="btn-close">닫기</a></div>'
        ); // Modify | 2020-08-20 | M00_A | h1.logo → p.logo 변경
        var $cnt2 = $('<div class="container"></div>');
        var $depthMain = $('<div class="depth-main"></div>');
        /* 210514 | 접근성 | rnb 구조변경 */
        var $depthBg = $('<div class="depth-sub-bg"></div>');
        $cnt2.append($head, $depthMain, $depthBg);
 
        for (var group in this.menuData) {
            var menuGroup = this.menuData[group];
            var $groupUl = $('<ul class="' + String(group).camelToDash() + ' depth1_ul">');
            for (var depth1 in menuGroup) {
                var rnb_html = menuGroup[depth1].rnbHtml; //20240626 "rnbHtml" 속성값 여부로 .html 하드코딩 마크업 불러올지의 체크 추가
                var d1Title = menuGroup[depth1].title;
                var d1PanelType = menuGroup[depth1].panelType;
                var featureId = menuGroup[depth1].featureId;
                var panelStyle = menuGroup[depth1].style;
                var d1GnbTitle = menuGroup[depth1].gnb_title;
                var d1Items = menuGroup[depth1].items || null;
                var d1LoginChk = menuGroup[depth1].loginChk;
                var d1Url = menuGroup[depth1].url || 'javascript:void(0)';
                var d1Target = menuGroup[depth1].target || null;
                var $menuItem_d1 = $('<li' + ((!d1Items && !rnb_html) ? ' class="no-child' + (d1LoginChk ? ' dep_login' : '') + '"' : '') + '></li>');
                var $menuItem_d1_tit = $('<div class="title dep1"><a href="' + d1Url + '" ' + (d1Target && d1Url !== "#" ? 'target="' + d1Target + '"' : '') + (featureId ? ' class="' + featureId + '"' : '') + ((!d1Items && !rnb_html) ? ' ' : ' role="button" aria-expanded="false"') + '>' + (d1GnbTitle ? d1GnbTitle : d1Title) + '</a></div>'); //20240626 "rnbHtml" 속성값 여부로 .html 하드코딩 마크업 불러올지의 체크 추가 && class 조건 기존 d1Items, 하위 데이터 체크에서 featureId 아이디가 있는지 체크로 수정
                var $menuPanel_d1 = $('<div class="depth-sub"><div class="depth_inner ' + d1PanelType + ' ' + featureId + '" data-id="' + featureId + '"></div></div>');
                var $menuPanel_d2;
                var $menuPanel_d3;
                var $menuPanel_d1_inner = $menuPanel_d1.find('.depth_inner');
 
                $menuItem_d1.append($menuItem_d1_tit); //, $depthSub
 
                if (d1Items || rnb_html) { //20240626 "rnbHtml" 속성값 여부로 .html 하드코딩 마크업 불러올지의 체크 추가
                    var $menuPanel_d2 = $('<ul class="items depth2"></ul>');

                    if (panelStyle && rnb_html) {
                        $menuPanel_d1_inner.append(this.getHtmlContent(rnb_html));
                    }else {
                        $menuPanel_d1_inner.append($menuPanel_d2);
                        for (var depth2 in d1Items) {
                            var d2Title = d1Items[depth2].title;
                            var d1FlagNew = d1Items[depth2].flag_new;
                            var d1FlagUpdate = d1Items[depth2].flag_update;
                            var d2Url = d1Items[depth2].url || 'javascript:void(0)';
                            var d2Target = d1Items[depth2].target || '_self';
                            // 1depth오퍼링 하위인 경우 3depth 오퍼링 내용을 표시함
                            var d2Items = null;
 
                            if (d1Items[depth2].type == 'offering_main') {
                                try {
                                    d2Items = !!d1Items[depth2].items && d1Items[depth2].items[0].items; // offering cate get
                                } catch (e) {
                                    console.log('error', e);
                                }
                            } else {
                                d2Items = !!d1Items[depth2].items && d1Items[depth2].items;
                            }
 
                            var $menuItem_d2;
                            // hidden 항목만 들어있는지 확인
                            var isItemsHasOnlyHiddenItem = (function(items) {
                                if (!items) return true;
 
                                var result = true;
                                items.map(function(obj, index, items) {
                                    if (!!obj.hidden == false) result = false;
                                });
                                return result;
                            })(d2Items);
 
                            if (isItemsHasOnlyHiddenItem == false) {
                                if (d1Items[depth2].type == 'offering_main') {
                                    $menuItem_d2 = $(
                                        '<li><div class="title"><a href="javascript:void(0)" aria-expanded="false">' +
                                        d2Title +
                                        '</a></div></li>'
                                    );
                                    //RNB는 2depth url에 해당하는 3depth 개요 생성이 있음..
                                    $menuPanel_d3 = $('<ul class="items"></ul>');
                                    if (d2Url != 'javascript:void(0)')
                                        $menuPanel_d3.append(
                                            '<li><a href="' + d2Url + '" target="' + d2Target + '">' + d2Title + ' ' + langSet[_this.lang].words.summary.toString() + '</a></li>'
                                        );
                                    $menuItem_d2.append($menuPanel_d3);
                                    for (var depth3 in d2Items) {
                                        var d3Title = d2Items[depth3].title;
                                        var d3Url = d2Items[depth3].url || 'javascript:void(0)';
                                        var d3Target = d2Items[depth3].target || '_self';
                                        var $menuItem_d3 = $('<li><a href="' + d3Url + '" target="' + d3Target + '">' + d3Title + '</a></li>');
 
                                        var d3Items = d2Items[depth3].items || null;
                                        if (d3Items && d3Items.length > 0) {
                                            $menuItem_d3.find('a').attr('role', 'button').attr('aria-expanded', 'false');
                                            var $menuPanel_d4 = $('<ul class="items depth4"></ul>');
                                            for (var depth4 in d3Items) {
                                                var d4Title = d3Items[depth4].title;
                                                var d4Url = d3Items[depth4].url || 'javascript:void(0)';
                                                var d4Target = d3Items[depth4].target || '_self';
                                                var $menuItem_d4 = $('<li><a href="' + d4Url + '" target="' + d4Target + '">' + d4Title + '</a></li>');
 
                                                var d4Items = d3Items[depth4].items || null;
                                                if (d4Items && d4Items.length > 0) {
                                                    $menuItem_d4.find('a').attr('role', 'button').attr('aria-expanded', 'false');
                                                    var $menuPanel_d5 = $('<ul class="items depth5"></ul>');
                                                    for (var depth5 in d4Items) {
                                                        var d5Title = d4Items[depth5].title;
                                                        var d5Url = d4Items[depth5].url || 'javascript:void(0)';
                                                        var d5Target = d4Items[depth5].target || '_self';
                                                        var $menuItem_d5 = $('<li><a href="' + d5Url + '" target="' + d5Target + '">' + d5Title + '</a></li>');
                                                        if (d4Items[depth5].hidden !== true && d4Items[depth5].onlyMainShow !== true && d4Items[depth5].onlySUB !== true) {
                                                            $menuPanel_d5.append($menuItem_d5);
                                                        }
                                                    }
                                                    $menuItem_d4.append($menuPanel_d5);
                                                }
 
                                                if (d3Items[depth4].hidden !== true && d3Items[depth4].onlyMainShow !== true && d3Items[depth4].onlySUB !== true) {
                                                    $menuPanel_d4.append($menuItem_d4);
                                                }
                                            }
                                            $menuItem_d3.append($menuPanel_d4);
                                        }
 
                                        if (d2Items[depth3].hidden !== true && d2Items[depth3].onlyMainShow !== true && d2Items[depth3].onlySUB !== true) {
                                            $menuPanel_d3.append($menuItem_d3);
                                        }
                                    }
                                    if (d1Items[depth2].hidden !== true && d1Items[depth2].onlyMainShow !== true && d1Items[depth2].onlySUB !== true) {
                                        $menuPanel_d2.append($menuItem_d2);
                                    }
                                } else {
                                    for (var depth3 in d2Items) {
                                        $menuItem_d2 = $('<li></li>');
                                        var d3Items = !!d2Items[depth3].items && d2Items[depth3].items;
                                        // hidden 항목만 들어있는지 확인
                                        var isItemsHasOnlyHiddenItem = (function(items) {
                                            if (!items) return true;
 
                                            var result = true;
                                            items.map(function(obj, index, items) {
                                                if (!!obj.hidden == false) result = false;
                                            });
                                            return result;
                                        })(d3Items);
 
                                        if (isItemsHasOnlyHiddenItem == false) {
                                            var d2Title = d2Items[depth3].title;
                                            $menuItem_d2.append('<div class="title"><a href="javascript:void(0)" aria-expanded="false">' + d2Title + '</a></div>');
                                            $menuPanel_d3 = $('<ul class="items"></ul>');
                                            for (var depth3 in d3Items) {
                                                var d3Title = d3Items[depth3].title;
                                                var d3Url = d3Items[depth3].url || 'javascript:void(0)';
                                                var d3Target = d3Items[depth3].target || '_self';
                                                var $menuItem_d3 = $('<li><a href="' + d3Url + '" target="' + d3Target + '">' + d3Title + '</a></li>');
 
                                                if (d3Items[depth3].hidden !== true && d3Items[depth3].onlyMainShow !== true && d3Items[depth3].onlySUB !== true) {
                                                    $menuPanel_d3.append($menuItem_d3);
                                                }
                                            }
                                            $menuItem_d2.append($menuPanel_d3);
                                        } else {
                                            var d2Title = d2Items[depth3].title;
                                            var d2Url = d2Items[depth3].url || 'javascript:void(0)';
                                            var d2Target = d2Items[depth3].target || '_self';
                                            $menuItem_d2.append('<a href="' + d2Url + '" target="' + d2Target + '">' + d2Title + '</a>');
                                        }
                                        if (d1Items[depth2].hidden !== true && d1Items[depth2].onlyMainShow !== true && d1Items[depth2].onlySUB !== true) {
                                            $menuPanel_d2.append($menuItem_d2);
                                        }
                                    }
                                }
                            } else {
                                if (d1FlagUpdate === 'T') {
                                    $menuItem_d2 = $('<li><a href="' + d2Url + '" target="' + d2Target + '">' + d2Title + '<span class="flag update">Update</span></a></li>');
                                } else if (d1FlagNew === 'T') {
                                    $menuItem_d2 = $('<li><a href="' + d2Url + '" target="' + d2Target + '">' + d2Title + '<span class="flag new">New</span></a></li>');
                                } else {
                                    $menuItem_d2 = $('<li><a href="' + d2Url + '" target="' + d2Target + '">' + d2Title + '</a></li>');
                                }
 
                                if (d1Items[depth2].hidden !== true && d1Items[depth2].onlyMainShow !== true && d1Items[depth2].onlySUB !== true) {
                                    $menuPanel_d2.append($menuItem_d2);
                                }
                            }
                        }
                    }
                    $menuPanel_d1.append($menuPanel_d1_inner);
                    $menuItem_d1.append($menuPanel_d1);
                    /* //210514 | 접근성 | rnb 구조변경 */
                }
                if (menuGroup[depth1].hidden !== true && menuGroup[depth1].onlyMainShow !== true) {
                    // menuGroup[depth1].onlyMainShow: GNB 노출O / RNB 노출X
                    $groupUl.append($menuItem_d1);
                }
            }
            // static group not append
            if (group !== 'menuGroup4') {
                $depthMain.append($groupUl);
            }
        }
        this.$el.find('.rnb').append($cnt2);
        this.$el.find('.rnb').find('.btn-close').text(langSet[_this.lang].rnb.activeStr.toString()); /* 210412 | 접근성 | 대체텍스트 추가 */
 
        /* check DOM created */
        checkDone['gnb'] = setInterval(function() {
            if ($('.hd-cnt').length && $('.rnb .depth-main').length) {
                clearInterval(checkDone['gnb']);
                _this.addEventListener();
 
                if (_this.isMobile) {
                    _this.setSizeSubmenuMobile();
                } else {
                    //_this.initSubmenuSize();
                    _this.initSubmenuSizeIEFIX();
                }
 
                if (_this.isMobileDevice) {
                    $('body').addClass('hid_sm');
                } else {
                    $('body').removeClass('hid_sm');
                }
 
                // scrollbar 적용
                $('.history .container .pages').scrollbar(); // 20.07.28 JH
                $('.rnb .depth-sub > div > .items').scrollbar();
                $('.rnb .depth-sub > div > .offering_rnb').scrollbar(); //해상도 변화 스크롤 추가 : rnb 스크롤 추가
                $('.rnb .depth-sub > .depth_inner .offering_rnb').scrollbar();
                //$('.rnb .depth-main').scrollbar();
                $('.rnb .depth-main').wrapInner('<div class="box"></div>');
                $('.rnb .depth-main .box').scrollbar();
 
                // set aria attribute
                _this.$el.find('.rnb').attr('role', 'navigation');
            } else {
                console.log('not yet Draw GNB');
            }
        }, 50);
 
        _this.gnbChildpanelStyle('drawGnb');
 
        //20221201 gnb close btn추가
        var gnb_closeCont = $cnt.find('.childpanel');
        var closeGnb_btn = $('<div class="gnb_closeBtn"><button type="button"><span class="blind">menu close</span></button></div>');
 
        gnb_closeCont.append(closeGnb_btn);
    };
    /** //drawGnb */
 
    _proto.gnbChildpanelStyle = function(executionState) {
        if (!$('.gnb .hd-cnt .menu').length) return;
        if (_this.isMobile) return;
 
        var PANEL = {
            MAXWIDTH_LEFT: 1398, // "offering", "business"
            MAXWIDTH_RIGHT: 1568, // "library", "newsroom", "about"
            PADDING: 40,
        };
        var FEATURE = {
            WIDTH: 310,
            PADDING: 26,
            DISTANCEMIN: 75,
            DISTANCEMAX: 120,
        };
 
        var panelWidth = $('.M00_A').width();
        var gnbWidthGap = ($(window).width() - panelWidth) / 2 > 0 ? ($(window).width() - panelWidth) / 2 : 0;
        // "offering", "business"
        var panelWidthGap_LEFT = (panelWidth - PANEL.MAXWIDTH_LEFT) / 2 > 0 ? (panelWidth - PANEL.MAXWIDTH_LEFT) / 2 : 0;
        // "library", "newsroom", "about"
        var panelWidthGap_RIGHT = (panelWidth - PANEL.MAXWIDTH_RIGHT) / 2 > 0 ? (panelWidth - PANEL.MAXWIDTH_RIGHT) / 2 : 0;
 
        $('.gnb .hd-cnt .menu > li').each(function() {
            var $openBtn = $(this).closest('.menu-group3').length === 0 ? $(this).find("> .title a") : $(this).closest('.menu-group3').find('li').eq(0).find("> .title a"); //20240705 이벤트, 인사이트, 뉴스, 회사정보 등등 gnb 우측 메뉴 자동으로 할당되는 width값 분기
            var $childpanel = $(this).find('> .childpanel');
            var $offeringBtn = $('.gnb .hd-cnt .menu #tab_offering');
 
            var openBtnPos_LEFT = $openBtn.offset().left - PANEL.PADDING - gnbWidthGap - panelWidthGap_LEFT;
            var offeringBtnPos_LEFT = $offeringBtn.offset().left - PANEL.PADDING - gnbWidthGap - panelWidthGap_LEFT;
            var openBtnPos_RIGHT = $openBtn.offset().left - PANEL.PADDING - gnbWidthGap - panelWidthGap_RIGHT;
            var offeringBtnPos_RIGHT = $offeringBtn.offset().left - PANEL.PADDING - gnbWidthGap - panelWidthGap_RIGHT;
 
            // "no-child"
            // - Do nothing
            if (!$childpanel.length) {
                return;
            }
 
            // "offering"
            // - Do nothing
            if ($childpanel.hasClass('offering')) {
                return;
            }
 
            // "business"
            // - set items indentation
            if ($childpanel.hasClass('business')) {
                $childpanel.find('.inner > .items').css({
                    'margin-left': openBtnPos_LEFT > 0 ? openBtnPos_LEFT : 0,
                });
                return;
            }
 
            // "library", "newsroom", "about"
            // - set feature indentation
            var featureWidth = 0;
            var featureLength = $childpanel.find('.feature li').length;
 
            var featureDistance = panelWidthGap_RIGHT > 0 && $childpanel.hasClass('about') ? FEATURE.DISTANCEMAX : FEATURE.DISTANCEMIN;
            var featureIndentation = panelWidthGap_RIGHT > 0 && offeringBtnPos_LEFT > 0 && gnbWidthGap <= 0 ? offeringBtnPos_LEFT : 0;
 
            if (featureLength) {
                featureWidth += featureLength * FEATURE.WIDTH;
                featureWidth += (featureLength - 1) * FEATURE.PADDING;
                featureWidth += featureIndentation;
                featureWidth += featureDistance;
            }
 
            $childpanel.find('.inner > .feature').css({
                'margin-left': featureIndentation,
                'margin-right': featureDistance,
            });
 
            // "about"
            // - set items width
            if ($childpanel.hasClass('about')) {
                $childpanel.find('.inner > .items').css({
                    width: panelWidth - (featureWidth + PANEL.PADDING * 2 + panelWidthGap_RIGHT * 2),
                });
                return;
            }
 
            // "library", "newsroom"
            // - set items width
            $childpanel.find(".inner > .items").css({
                "width": panelWidth - (openBtnPos_RIGHT + (PANEL.PADDING * 2) + (panelWidthGap_RIGHT * 2))
            });
        });
    };
 
    // 20210209 추가
    // [20210209_1] MAIN GNB 오퍼링 > DT Services 위치 관련 #24
    // 특정 국가에서 특정 사업부 위치 변경을 위해 빈 영역을 추가하기위해 작성됨
    _proto.checkMainGnbInOfferingItem = function(title, subMenu) {
        var emptyBlock = $("<div aria-hidden='true'>&nbsp;</div>");
 
        if (this.country === 'en' && title === 'Digital Accelerator') {
            subMenu.children().last().append(emptyBlock.css('height', 100));
        }
        if (this.country === 'en' && title === 'Digital Finance') {
            subMenu.children().last().append(emptyBlock.css('height', 150)); //210604 | height 120 -> 150 조절
        }
    };
 
    // 20210604 추가
    // [20210604] MAIN GNB 회사소개 > Event 위치 관련 #51
    _proto.checkMainGnbInAboutItem = function(title, subMenu) {
        var emptyBlock = $("<div aria-hidden='true'>&nbsp;</div>");
        if (title === 'Sustainability' || title === '지속가능경영') {
            subMenu.children().last().append(emptyBlock.css('height', 100));
        }
    };
 
    _proto.setSizeSubmenuMobile = function() {
        var containerHeight = $(window).height() - $('.M00_A .inner').height();
        if (this.gnbType != 'main') {
            $('#header').css({
                height: $('.M00_A .inner').height() + 'px',
            });
        }
        //$('.M00_A .gsnb.mobile .owl-carousel').css({'height' : containerHeight + 'px'});
    };
 
    _proto.makeMobileGsnb = function(payload) {
        const path = typeof payload !== 'undefined' && !!payload.path ? payload.path : '/';
        const exclude = typeof payload !== 'undefined' && !!payload.exclude ? payload.exclude : '[]';
 
        var $inner = $('<ul class="items"></ul>');
 
        if (this.offeringData.url) {
            $inner.append(
                '<li class="menulist no-child" ><div class="title"><a href="' +
                (this.offeringData.url || 'javascript:void(0)') +
                '" target="' +
                (this.offeringData.target || '_self') +
                '">' +
                this.offeringData.title +
                ' ' +
                langSet[_this.lang].words.summary.toString() +
                '</a></div></li>'
            );
        }
        for (var offerCate in this.offeringData.items) {
            var cate = this.offeringData.items[offerCate];
            /* 210412 | 접근성 | aria-expanded 속성 추가 */
            var $cate = $(
                '<li class="menulist" ><div class="title"><a href="' +
                (cate.url || 'javascript:void(0)') +
                '" target="' +
                (cate.target || '_self') +
                '" aria-expanded="false">' +
                cate.title +
                '</a></div></li>'
            );
            /* //210412 | 접근성 | aria-expanded 속성 추가 */
            var $menuPanel_d2;
 
            let _excludeIndex = exclude.findIndex((element) => element.menuId === cate.menuId);
 
            if (_excludeIndex > -1) {
                // exclude[n].menuId에 존재할 경우 실행합니다.
                $menuPanel_d2 = $('<div class="items"></div>');
 
                // cate.menuId 값이 exclude 배열에 존재하기 때문에 태그를 생성하지 않습니다.
                // exclude[n].file에 할당된 html 파일을 읽어들입니다.
 
                $($menuPanel_d2).addClass('renewal');
                $.get(path + exclude[_excludeIndex].file, function(data) {
                    $($menuPanel_d2).html(data);
                    // callback complete
                });
 
                $cate.append($menuPanel_d2);
            } else {
                if (cate.items) {
                    $menuPanel_d2 = $('<ul class="items"></ul>');
                    for (var offerSub in cate.items) {
                        var sub = cate.items[offerSub];
                        var $sub = $('<li class="menulist-sub"><div class="title"><a href="javascript:void(0)">' + sub.title + '</a></div></li>');
                        var $menuPanel_d3;
                        // hidden 항목만 들어있는지 확인
                        var isItemsHasOnlyHiddenItem = !!sub.items &&
                            (function(items) {
                                var result = true;
                                items.map(function(obj, index, items) {
                                    if (!!obj.hidden == false) result = false;
                                });
                                return result;
                            })(sub.items);
                        if (sub.items && isItemsHasOnlyHiddenItem == false) {
                            $sub = $('<li class="menulist-sub"><div class="title"><a href="javascript:void(0)">' + sub.title + '</a></div></li>');
                            $menuPanel_d3 = $('<ul class="items"></ul>');
                            // move back link
                            $menuPanel_d3.append('<li><div class="title"><a href="javascript:void(0)">' + sub.title + '</a></div></li>');
                            // summary link
                            if (sub.url) {
                                $menuPanel_d3.append(
                                    '<li><div class="title"><a href="' +
                                    (sub.url || 'javascript:void(0)') +
                                    '" target="' +
                                    (sub.target || '_self') +
                                    '">' +
                                    sub.title +
                                    ' ' +
                                    langSet[_this.lang].words.summary.toString() +
                                    '</a></div></li>'
                                );
                            }
                            $sub.append($menuPanel_d3);
                            for (var offerItem in sub.items) {
                                var item = sub.items[offerItem];
                                var $item = $(
                                    '<li><div class="title"><a href="' + (item.url || 'javascript:void(0)') + '" target="' + (item.target || '_self') + '">' + item.title + '</a></div></li>'
                                );
                                if (item.hidden !== true) {
                                    $menuPanel_d3.append($item);
                                }
                            }
                        } else {
                            $sub = $(
                                '<li class="menulist-sub"><div class="title"><a href="' +
                                (sub.url || 'javascript:void(0)') +
                                '" target="' +
                                (sub.target || '_self') +
                                '">' +
                                sub.title +
                                '</a></div></li>'
                            );
                            $sub.addClass('no-child');
                        }
                        if (sub.hidden !== true && sub.onlyMainShow !== true) {
                            $menuPanel_d2.append($sub);
                        }
                    }
 
                    // hidden 항목만 들어있는지 확인
                    var isItemsHasOnlyHiddenItem = (function(items) {
                        var result = true;
                        items.map(function(obj, index, items) {
                            if (!!obj.hidden == false) result = false;
                        });
                        return result;
                    })(cate.items);
 
                    if (isItemsHasOnlyHiddenItem) {
                        $cate.addClass('no-child');
                    }
                    $cate.append($menuPanel_d2);
                } else {
                    /*
                              if ( this.data.current == cate.menuId ) {
                                  $cate.addClass('on');
                              }
                              */
                    $cate.addClass('no-child');
                }
            }
            if (cate.hidden !== true) {
                $inner.append($cate);
            }
        }
        return $inner;
    };
    // IE11 flex bug fix
    _proto.initSubmenuSizeIEFIX = function() {
        if (this.gnbType == 'normal') {
            $('.offering-list > ul.items').each(function(i, el) {
                var $ul = $(this);
                var itemCount = $ul.find('li').length;
                var colCount = Math.ceil(itemCount / 5);
 
                $ul.css({
                    width: colCount * 300 + 'px',
                });
 
                $ul.css({
                    'column-count': colCount.toString(),
                    'column-fill': 'auto', // TODO :: FIREFOX BUG check
                    //'column-fill' : 'balance', // TODO :: FIREFOX BUG check
                    //'width' : 'auto',
                    //'display' : 'block',
                    // 'height' : '310px' //20221201 뎁스 알수없는 높이 고정값 삭제
                });
            });
        } else {
            //$(".offering-list > ul.items").css("width", "calc(100% - "+($inner.find(".offering-cate").width() + 10)+"px)");
            $('.offering-list > ul.items').css('width', '100%');
 
            // height 값 체크후 large class 추가
            $('.offering-list > ul.items').each(function(i, el) {
                var fixwidth = 280;
                var $ul = $(this);
                $ul.css({
                    visibility: 'hidden',
                    display: 'block',
                });
                // height check
                var cateHeight = 0;
                $ul.find('.offering-list-sub').each(function(i, el) {
                    cateHeight += $(this).height();
                });
                if ($ul.find('.offering-list-sub').length == 1) {
                    //20221201 뎁스 알수없는 높이 고정값 삭제
                    // $ul.css({
                    //     'max-height' : (cateHeight + 80 + 16) + 'px'
                    // });
                } else if (cateHeight >= 320) {
                    $ul.addClass('large');
                } else {
                    //20221201 뎁스 알수없는 높이 고정값 삭제
                    // $ul.css({
                    //     'max-height' : '325px'
                    // });
                }
                // offset check
                $ul.css({
                    display: 'flex',
                    'flex-direction': 'column',
                    'flex-wrap': 'wrap',
                });
                //alert($ul.css('max-height'));
 
                // IE11 fix
                //20221201 뎁스 알수없는 높이 고정값 삭제
                // $ul.css({
                //     'height' : $ul.css('max-height')
                // });
 
                function getUniqueOffset() {
                    var offsetArray = [];
                    var offsetTopArray = [];
                    $ul.find('>li').each(function() {
                        offsetArray.push($(this).offset().left);
                        offsetTopArray.push({
                            top: $(this).offset().top,
                            el: $(this),
                        });
                    });
 
                    // 중복제거하여 col 갯수 확인
                    var uniqueOffsetLeft = [];
                    $.each(offsetArray, function(i, el) {
                        if ($.inArray(el, uniqueOffsetLeft) === -1) uniqueOffsetLeft.push(el);
                    });
 
                    var uniqueOffsetTop = [];
                    $.each(offsetTopArray, function(i, el) {
                        if ($.inArray(el, uniqueOffsetTop) === -1) uniqueOffsetTop.push(el);
                    });
 
                    return {
                        uniqueOffsetLeft: uniqueOffsetLeft,
                        uniqueOffsetTop: uniqueOffsetTop,
                    };
                }
 
                var offset = getUniqueOffset();
                var uniqueOffsetLeft = offset.uniqueOffsetLeft;
                var uniqueOffsetTop = offset.uniqueOffsetTop;
                var productMaxNum = uniqueOffsetLeft.length >= 9 ? 5 : uniqueOffsetLeft.length; //20240108 kr외의 상품 리스트 9개를 넘어갔을시 리스트 깨지는 이슈
                // var max = offsetArray.slice(0).sort(function(a,b){a<b})[0];
                var ulWidth = $ul.width();
                var liWidth;
                if (fixwidth * uniqueOffsetLeft.length > ulWidth) {
                    // 계산된 width 값이 너무커서 벗어날경우
                    liWidth = ulWidth / uniqueOffsetLeft.length - 40 - 10;
 
                    $ul.children('li').css({
                        //20221201 뎁스 알수없는 높이 고정값 삭제
                        // 'width' : liWidth + 'px'
                        //20221201 뎁스 css추가
                        width: 'auto',
                        'break-inside': 'avoid',
                    });
                    $ul.css({
                        visibility: '',
                        display: '',
                        //20221201 뎁스 css추가
                        width: 'auto',
                    });
                } else {
                    ulWidth = fixwidth * uniqueOffsetLeft.length;
                    $ul.children('li').css({
                        //'width' : '265px',
                        width: 'auto',
                        'break-inside': 'avoid',
                    });
 
                    $ul.css({
                        width: fixwidth * uniqueOffsetLeft.length + 40 + 'px',
                        visibility: '',
                        display: '',
                        height: '',
                        'max-height': '',
                    });
                    // IE11 fix
                    /*
                              if (uniqueOffsetLeft.length > 1){
                                  $ul.css({
                                      'height' : $ul.css('max-height')
                                  });
                              }
                              */
                }
 
                $ul
                    .css({
                        //'column-count': uniqueOffsetLeft.length.toString(),
                        'column-count': productMaxNum.toString(), //20240108 kr외의 상품 리스트 9개를 넘어갔을시 리스트 깨지는 이슈
                        //'column-fill' : 'auto', // TODO :: FIREFOX bug check
                        'column-fill': 'balance',
                        width: 'auto',
                        visibility: '',
                        //'display' : 'block',
                        height: 'auto',
                        'max-height': 'auto',
                    })
                    .removeClass('large');
 
                if (cateHeight < 320 && $ul.find('.offering-list-sub').length == 0) {
                    if ($ul.children('li').length > 4) {
                        $ul.css({
                            'column-fill': 'auto',
                            height: 'auto', //20221201 310px 뎁스 알수없는 높이 고정값 삭제
                        });
                    }
                }
                // 일반메뉴 그룹메뉴 혼합일때
                if ($ul.find('> li.offering-list-sub').length > 0 && $ul.find('> li:not(.offering-list-sub)').length > 0) {
                    $ul.css({
                        visibility: 'hidden',
                        display: 'block',
                        // 'max-height' : (cateHeight + 90) + 'px', //20221201 뎁스 알수없는 높이 고정값 삭제
                    });
                    var currentOffset = getUniqueOffset();
                    var currentUniqueOffsetLeft = currentOffset.uniqueOffsetLeft;
                    $ul.css({
                        visibility: '',
                        display: '',
                        'column-count': currentUniqueOffsetLeft.length.toString(),
                    });
                    $ul.find('> li:not(.offering-list-sub)').addClass('offering-list-sub').addClass('fake');
                }
            });
        }
    };
 
    _proto.initSubmenuSize = function() {
        if (this.gnbType == 'normal') {
            $('.offering-list > ul.items').each(function(i, el) {
                var $ul = $(this);
                var itemCount = $ul.find('li').length;
                var colCount = Math.ceil(itemCount / 5);
                $ul.css({
                    width: colCount * 260 + 'px',
                });
            });
        } else {
            //$(".offering-list > ul.items").css("width", "calc(100% - "+($inner.find(".offering-cate").width() + 10)+"px)");
            $('.offering-list > ul.items').css('width', '100%');
 
            // height 값 체크후 large class 추가
            $('.offering-list > ul.items').each(function(i, el) {
                var fixwidth = 300;
                var offsetArray = [];
                var offsetTopArray = [];
                var $ul = $(this);
                $ul.css({
                    visibility: 'hidden',
                    display: 'block',
                });
                // height check
                var cateHeight = 0;
                $ul.find('.offering-list-sub').each(function(i, el) {
                    cateHeight += $(this).height();
                });
                //console.log("cateHeight::"+ cateHeight);
                if ($ul.find('.offering-list-sub').length == 1) {
                    $ul.css({
                        'max-height': cateHeight + 80 + 16 + 'px',
                    });
                } else if (cateHeight >= 320) {
                    $ul.addClass('large');
                }
                // offset check
                $ul.css({ display: 'flex' });
                //alert($ul.css('max-height'));
 
                // IE11 fix
                $ul.css({
                    height: $ul.css('max-height'),
                });
 
                function getUniqueOffset() {
                    $ul.find('>li').each(function() {
                        offsetArray.push($(this).offset().left);
                        offsetTopArray.push($(this).offset().top);
                    });
 
                    // 중복제거하여 col 갯수 확인
                    var uniqueOffsetLeft = [];
                    $.each(offsetArray, function(i, el) {
                        if ($.inArray(el, uniqueOffsetLeft) === -1) uniqueOffsetLeft.push(el);
                    });
 
                    var uniqueOffsetTop = [];
                    $.each(offsetTopArray, function(i, el) {
                        if ($.inArray(el, uniqueOffsetTop) === -1) uniqueOffsetTop.push(el);
                    });
 
                    return {
                        uniqueOffsetLeft: uniqueOffsetLeft,
                        uniqueOffsetTop: uniqueOffsetTop,
                    };
                }
 
                var offset = getUniqueOffset();
                var uniqueOffsetLeft = offset.uniqueOffsetLeft;
                var uniqueOffsetTop = offset.uniqueOffsetTop;
                // var max = offsetArray.slice(0).sort(function(a,b){a<b})[0];
                var ulWidth = $ul.width();
                var liWidth;
 
                if (fixwidth * uniqueOffsetLeft.length > ulWidth) {
                    // 계산된 width 값이 너무커서 벗어날경우
                    liWidth = ulWidth / uniqueOffsetLeft.length - 40 - 10;
 
                    $ul.children('li').css({
                        width: liWidth + 'px',
                    });
                    $ul.css({
                        visibility: '',
                        display: '',
                    });
                } else {
                    ulWidth = fixwidth * uniqueOffsetLeft.length;
                    $ul.children('li').css({
                        width: '260px',
                    });
                    $ul.css({
                        width: fixwidth * uniqueOffsetLeft.length + 40 + 'px',
                        visibility: '',
                        display: '',
                        height: '',
                    });
                    // IE11 fix
                    /*
                              if (uniqueOffsetLeft.length > 1){
                                  $ul.css({
                                      'height' : $ul.css('max-height')
                                  });
                              }
                              */
                }
            });
        }
    };
 
    _proto.addEventListener = function() {
        /** 202304-01 웹접근 언어선택 변수 */
        var $nav_languageBtn = _this.$hd_iconNavigator_area.find('li a.btn-language'),
            $nav_languageDropCont = _this.$hd_iconNavigator_area.find('.dropCont_language'),
            $nav_languageDropContDL = $nav_languageDropCont.find('dl'),
            $nav_languageDropCont_listBtn = $nav_languageDropContDL.find('dd'),
            $nav_languageDropCont_closeBtn = $nav_languageDropCont.find('.dropCont_mo_language_close button'),
            $nav_languageUrl = location.href;
 
        /** 202304-01 웹접근 검색창 변수 */
        var $nav_search_btn = _this.$hd_iconNavigator_area.find('.btn-search'),
            $nav_search_area = $nav_search_btn.parent('li'),
            $nav_search_boxWrap = $nav_search_area.find('.search_box'),
            $nav_search_cont = $nav_search_boxWrap.find('.container'),
            $nav_search_box_closeBtn = $nav_search_boxWrap.find('a.btn-close'),
            $nav_search_boxOBJ = $nav_search_boxWrap.find("button, input:not([type='hidden']), select, iframe, textarea, [href]:visible, [tabindex]:not([tabindex='-1'])"),
            $search_boxOBJ_first = $nav_search_boxOBJ && $nav_search_boxOBJ.first(),
            $search_boxOBJ_last = $nav_search_boxOBJ && $nav_search_boxOBJ.last(),
            $nav_search_form = $nav_search_cont.find('form'),
            $nav_search_formDropDown = $nav_search_form.find('.form.sch_box'),
            $nav_search_form_txtInput = $nav_search_formDropDown.find('.in input#total_keyword'),
            $nav_search_formColoseBtn = $nav_search_formDropDown.find('.src_closeBtn #service_close_title'),
            $nav_search_linkArea = $nav_search_cont.find('.link_box'),
            $nav_search_linkBtn = $nav_search_linkArea.find('.links a').first();
 
        /** 202304-01 웹접근 RNB햄버거버튼 변수 */
        var $nav_rnb_btn = _this.$hd_iconNavigator_area.find('.btn_hamburger');
        var tabDisablel;
 
        _this.gnbTopLinks = $('.gnb > .hd-cnt > .logo > a ,.gnb .hd-cnt .menu > li > .title a, .gnb .hd-etc .util > li > a');
 
        // main gnb mouseover
        var $gnb = $('.M00_A');
        //var $wrap = $('#wrap.main');
        var $wrap = $('#wrap');
        if (this.gnbType == 'main') {
            $gnb
                .find('> *')
                .on('mouseover', function() {
                    gnbMainTransparentTimer.stop();
                    $gnb.addClass('mc_chk');
                })
                .on('mouseleave', function(e) {
                    if ($('body').hasClass('hid_s')) return;
                    if (_this.isFocus) return;
                    gnbMainTransparentTimer.start();
                });
            $gnb
                .find('a')
                .on('focus', function() {
                    gnbMainTransparentTimer.stop();
                    _this.isFocus = true;
                    $gnb.addClass('mc_chk');
                })
                .on('focusout', function() {
                    _this.isFocus = false;
                    if ($('body').hasClass('hid_s')) return;
                });
        } else if (this.gnbType == 'offering') {
            if (this.offeringData.menuId == $(currentPage).text()) {
                $gnb.addClass('offering_main');
            } else {
                $gnb.addClass('offering');
            }
        }
 
        //gnbSwiperBanner tabControl
        $(window).on('load', function() {
            var $panelDataWrap = $('.gnb .childpanel.offering');
            var $panelSecondDataWrap = $('.gnb .childpanel.smart');
            var $panelDataWrap_sol = $(".gnb .childpanel.solution");
            var $panelDataSlideLength = $('.gnb .childpanel.offering .swiper-wrapper .swiper-slide').length;
            var $panelSecondSlideLength = $('.gnb .childpanel.smart .swiper-wrapper .swiper-slide').length;
            var $panelSlideLength_sol = $(".gnb .childpanel.solution .swiper-wrapper .swiper-slide").length;
 
            if ($panelDataSlideLength > 5 || $(window).width() <= 1340) {
                $panelDataWrap.find('.tab_control').addClass('act');
            }
 
            if ($panelSecondSlideLength > 5 || $(window).width() <= 1340) {
                $panelSecondDataWrap.find('.tab_control').addClass('act');
            }
            
            if ($panelSlideLength_sol > 5 || $(window).width() <= 1340) {
                $panelDataWrap_sol.find(".tab_control").addClass("act");
            }
        });
 
        // gnb
        var $gnbMenuDropCont = $('.gnb .hd-cnt .menu > li > .childpanel');
        // 20230522 메인과 동일한 기능 변수 : 서브페이지 GNB 호버했을시 gnb 스크롤 기능 X
        var sunGnbWrap = $('#wrap');
        var subGnb_mouseHover = $('html,body,#wrap,#container');
        var sub_wheelHandler = false;

        var $gnb_nav_name_distributionBtn = $('.hd-cnt .menu-group1 a#tab_smart'),
            $gnb_nav_name_distributionBtn_dropCont = $('.hd-cnt .menu-group1 .childpanel.smart, .hd-cnt .menu-group1 .childpanel.genAi'),
            $distribution_dropCont_youtubeBtn = $gnb_nav_name_distributionBtn_dropCont.find('#youtubeBtn, .play_btn'),
            $distribution_dropCont_youtubeIframe = $gnb_nav_name_distributionBtn_dropCont.find('#gnbYoutube');
 
        $(".gnb .hd-cnt .menu > li > .title > a").on("mouseenter focus", function(e){ 
            e.preventDefault();
            e.stopPropagation(); 
            menuCloseTimer.stop();
            $(".gnb .hd-cnt .menu > li:not('.no-child')").removeClass('on cloudMenuOpen').find('> .title > a').attr('aria-selected', 'false');
            $(this).closest(".menu > li:not('.no-child')").addClass('on').find('> .title > a').attr('aria-selected', 'true');
 
            _this.rnbMenuClose();
            _this.searchBoxClose();
            _this.historyMenuClose();
 
            if (!$(this).closest('li').hasClass('no-child')) {
                $('body').addClass('hid_s');
 
                // 닷컴 요청 사항 GNB Mouse event일때 scrollbar 사라지면서 생기는 여백 수정
                $('.M01_A')
                    .find('.md_visual')
                    .trigger('configuration', {
                        width: $(window).width(),
                        items: {
                            width: $(window).width(),
                        },
                    });
 
                $('.M01_A').find('.md_visual').trigger('updateSizes');
            }
            $('.gnb .hd-cnt .menu.menu-group1 > li').removeClass('on').find('> .title > a').attr('aria-selected', 'false');
            $(this).closest('.menu.menu-group1 > li').addClass('on').find('> .title > a').attr('aria-selected', 'true');
            _this.setOfferingGnbMh();
 
            if (!$(this).closest('li').find('.childpanel .tab_control .btn_prev').hasClass('disabled')) {
                // 초기값 설정 : prev 버튼 비활성화
                $(this).closest('li').find('.childpanel .tab_control .btn_prev').addClass('disabled').attr('disabled', 'disabled');
                $(this).closest('li').find('.childpanel .tab_control .btn_next').removeClass('disabled').removeAttr('disabled', 'disabled');
            }
 
            /* ajax 못불러왔을때 다시 호출 : 20240822 삭제 */

             if($(this).closest('li').hasClass("renewal_menu_depth")) {
                $(this).closest('li').addClass("cloudMenuOpen");
                // 클라우드 메뉴 호버시, 첫번째 메뉴에 강제로 호버
                $(selectorDepth.first.link).eq(0).add($(selectorDepth.second.link).eq(0)).trigger("mouseenter");
            }
            
            _this.gnbItemScrollStyle(e.type, $(this).closest('li')); //e.type, .find("> .title a")

            /** 20250131 gnb내 동영상, 다른 매뉴로 접근시 플레이 정지 - 251203 유튜브 수정중 */
            // var $thisActive = $(this).closest('ul.menu').find('li.on');
            // if(!$thisActive.find('.video_wrap iframe').length){
            //     $('.video_wrap iframe').each(function(){
            //         $(this).attr("src", $(this).attr("src").replace("?autoplay=1&mute=1", ""));
            //     })
            // }
            stopAllPlayers();
            
        })
        .on('mouseleave blur', function(e) {
            //202304-01 웹접근 : blur 추가
            sub_wheelHandler = false; //20230522 서브페이지 GNB 호버했을시 gnb 스크롤 기능 X
            menuCloseTimer.start();
            _this.gnbItemScrollStyle(e.type, $(this).closest('li')); //e.type, .find("> .title a")
 
            // $(".gnb .hd-cnt .menu.menu-group1 > li").removeClass("on").find('> .title > a').attr('aria-selected','false');
            $('.gnb .hd-cnt .menu').removeClass('on').find('> .title > a').attr('aria-selected', 'false');
            $('.gnb .hd-cnt .menu > li').removeClass('cloudMenuOpen');
            $('body').removeClass('hid_s');
        });
 
        //gnb drop contents
        $gnbMenuDropCont.hover(function(){
            $('body').addClass('hid_s');
        });
        $gnbMenuDropCont.on('mouseleave blur', function(e) {
            menuCloseTimer.start();
            _this.gnbItemScrollStyle(e.type, $(this).closest('li'));

            stopAllPlayers();
            /** 20250131 gnb내 동영상, 다른 매뉴로 접근시 플레이 정지 - 251203 유튜브 수정중 */
            // if($(this).find('.video_wrap iframe').length){
            //     var youtubeSRC_pram_remove = $(this).find('.video_wrap iframe').attr("src").split("?")[0];
            //     $(this).find('.video_wrap iframe').attr("src", youtubeSRC_pram_remove);
            //     return false;
            // };
 
            // $('.gnb .hd-cnt .menu').removeClass('on').find('> .title > a').attr('aria-selected', 'false');
            // $('body').removeClass('hid_s');
            // sub_wheelHandler = false; /* 2023-10-05 rnb 수정 */

        });
 
        // 리얼서밋 2024 임시 메뉴 기능 분기 - 삭제예정
        // let $summit2024 = $('.MP_real_summit_2024');
        // if($summit2024.length){
        //     let hdOuter = $('.M00_A').outerHeight();
        //     let $scrollAgenda = $('.scroll_agenda');
        //     let $scrollKeynote = $('.scroll_keynote');
        //     let offsetAgenda = $summit2024.find('.M125_A').offset().top - hdOuter; //해당 위치 반환
        //     let offsetKeynote = $summit2024.find('.M120_B').offset().top - hdOuter; //해당 위치 반환
        //     $scrollAgenda.on('click', function(e){
        //         e.preventDefault();
        //         $("html, body").stop().animate({scrollTop: offsetAgenda},500);
        //         _this.menuClose();
        //     })
        //     $scrollKeynote.on('click', function(e){
        //         e.preventDefault();
        //         $("html, body").stop().animate({scrollTop: offsetKeynote},500);
        //         _this.menuClose();
        //     })
        // }

        /* 키보드 접근시 gnb drop메뉴 */
        $('.gnb .hd-cnt .menu > li > .childpanel a').on('mouseover focus', function(e) {
            e.stopPropagation();
            menuCloseTimer.stop(); //키보드 접근시 gnb drop메뉴 닫히는 이슈 메뉴 정지기능 
        });
 
        $('.gnb .hd-cnt .menu > li > .childpanel').on('mouseover', function(e) {
            e.stopPropagation();
            menuCloseTimer.stop();
        });
 
        //20221201 gnb close btn추가
        $('.gnb .hd-cnt .menu > li > .childpanel .gnb_closeBtn button').on('click', function(e) {
            $(this).closest('.menu > li').removeClass('on').find('> .title > a').attr('aria-selected', 'false');
        });
 
        //GNB Youtube Thumbnail - 251203 유튜브 수정중
        // $distribution_dropCont_youtubeBtn.on("click", function() {
        //     $(this).parent('.video_wrap').find('iframe').attr("tabindex", "0");

        //     var gnbYoutubeSrc = $(this).parent('.video_wrap').find('iframe');
        //     var gnbYoutubeSrcSplit = gnbYoutubeSrc.attr("src").split("?")[0];

        //     gnbYoutubeSrc.attr("src", gnbYoutubeSrcSplit + "?autoplay=1&mute=1");

        //     $(this).closest($gnb_nav_name_distributionBtn_dropCont).find($distribution_dropCont_youtubeBtn).fadeOut(100);
        //     return false;
        // });

        $distribution_dropCont_youtubeBtn.on("click", function() {
            var $videoWrap = $(this).closest('.video_wrap');
            var iframeId = $videoWrap.find('iframe').attr('id');
            var $btn = $(this);

            // 모든 플레이어 정지
            stopAllPlayers();

            // 플레이어 준비 확인 및 재생 함수
            function tryPlayPlayer(retries = 10) {
                if (gnbYtPlayersReady[iframeId] && gnbYtPlayers[iframeId]?.playVideo instanceof Function) {
                    gnbYtPlayers[iframeId].mute();
                    gnbYtPlayers[iframeId].playVideo();
                    
                    $btn.fadeOut(100);
                    $btn.closest($gnb_nav_name_distributionBtn_dropCont).find($distribution_dropCont_youtubeBtn).fadeOut(100);
                } else if (retries > 0) {
                    setTimeout(() => tryPlayPlayer(retries - 1), 100);
                } else {
                    console.warn('Player not ready after retries:', iframeId);
                }
            }

            tryPlayPlayer();

            return false;
        });
 
        /* mainoffering accodion */
        $('.gnb .childpanel .items .acc_item').on({
            'mouseenter focusin': function(e) {
                var $btn = $(e.currentTarget).find('> .title a');
 
                $(this)
                    .find('> .items')
                    .stop()
                    .slideDown('fast', function() {
                        if ($(this).is(':visible')) {
                            //220331 | 접근성 | GNB title 제거
                            $btn.addClass('on'); //.attr({"title": (langSet[_this.lang].menuState.inactiveStr).toString(), "aria-expanded":"true"})
                            //_this.gnbItemAccScrollStyle(e.type, $(this));
                        } else {
                            $btn.removeClass('on'); //.attr({"title": (langSet[_this.lang].menuState.activeStr).toString(), "aria-expanded":"false"})
                        }
                    });
                e.preventDefault();
            },
            'mouseleave focusout': function(e) {
                var $thisAll = $('.gnb .childpanel .items .acc_item');
 
                $thisAll
                    .find('> .items')
                    .stop()
                    .slideUp('fast', function() {
                        $(this).css('height', 'auto');
                        //_this.gnbItemAccScrollStyle(e.type, $(this));
                    });
                //220331 | 접근성 | GNB title 제거
                $thisAll.find('> .title a').removeClass('on'); //.attr({"title": (langSet[_this.lang].menuState.activeStr).toString(), "aria-expanded":"false"})
                e.preventDefault();
            },
        });
        /* //mainoffering accodion */
 
        // sub gnb
        $(".gsnb:not('.mobile') .inner > ul > li.offering-list")
            .on('mouseenter', function(e) {
                //220331 | 접근성 | GSNB title 제거
                $(this).addClass('on');
                //.find("> .title > a").attr("title", langSet[_this.lang].menuState.inactiveStr);
 
                // .offering-list의 .items.renewal이 노출됐을 때 body를 잠급니다.
                if ($(this).find('.items').filter('.renewal')) {
                    $('body').addClass('hid_s');
                }
            })
            .on('mouseleave', function(e) {
                //220331 | 접근성 | GSNB title 제거
                $(this).removeClass('on');
                //.find("> .title > a").attr("title", langSet[_this.lang].menuState.activeStr);
 
                // .offering-list의 .items.renewal이 노출됐을 때 body를 풉니다.
                if ($(this).find('.items').filter('.renewal')) {
                    $('body').removeClass('hid_s');
                }
            });
 
        $(".gsnb:not('.mobile') .inner > ul > li.offering-list > .title > a").on('focus', function(e) {
            _this.inFocus = true;
            //220331 | 접근성 | GSNB title 제거
            $(".gsnb:not('.mobile') .inner > ul > li.offering-list").removeClass('on');
            //.find("> .title > a").attr("title", langSet[_this.lang].menuState.activeStr);
            $(this).closest('li').addClass('on');
            //.find("> .title > a").attr("title", langSet[_this.lang].menuState.inactiveStr);
        });
 
        $(".gsnb:not('.mobile') .inner > ul > li.offering-list .items a")
            .on('focus', function() {
                _this.inFocus = true;
            })
            .on('focusout', function() {
                _this.inFocus = false;
                subMenuCloseTimer.start();
            });
 
        $(".gsnb:not('.mobile') .inner > ul > li:not('.offering-list') > .title > a")
            .on('focus', function(e) {
                _this.inFocus = true;
                //220331 | 접근성 | GSNB title 제거
                $(".gsnb:not('.mobile') .inner > ul > li.offering-list").removeClass('on');
                //.find("> .title > a").attr("title", langSet[_this.lang].menuState.activeStr);
            })
            .on('focusout', function(e) {
                _this.inFocus = false;
            });
 
        // history
        $('.btn-history').click(function(e) {
            if ($(this).hasClass('on')) return false;
 
            _this.closeMobileGsnb();
            _this.rnbMenuClose();
            _this.searchBoxClose();
            _this.setHeightRightContainer();
 
            $('body').addClass('hid_s');
 
            if (_this.isIos()) {
                $('html').addClass('ios');
            }
            /*
                  if ( $('#wrap').hasClass('scroll_chk') ){
                      _this.$el.css({
                          'transition' : 'none'
                      });
                      _this.$el.css({                    
                          'top' : $('#header').offset().top + 'px',
                          'position' : 'fixed'
                      });
                  }
                  */
 
            /* 210603 | 접근성 | history,search aria add */
            var ariahidden;
            if (_this.isMobile == false) {
                ariahidden = $('footer, #container, #skip_navi');
            } else {
                ariahidden = $(
                    'footer, #container, #skip_navi, header .gnb > div:not(.hd-etc), header .gnb .hd-etc .util > li:not(li:nth-child(2)), header .gsnb, .gnb .btn-history'
                );
            }
 
            ariahidden.attr({
                tabindex: '-1',
                'aria-hidden': true,
            });
            /* //210603 | 접근성 | history,search aria add */
 
            $(this).addClass('on');
            $('.history')
                .addClass('on')
                .css({ display: 'block' })
                .find('.container')
                .stop()
                .css({ right: -1 * $('.history').width() })
                .animate({
                        right: 0,
                    },
                    500,
                    'easeOutQuint',
                    function() {
                        //alert( "all done" );
                        $('.history .btn-close').focus();
                    }
                );
 
            e.preventDefault();
        });
        $('.history .btn-close').click(function(e) {
            $('.btn-history').removeClass('on').focus(); //210603 | 접근성 | history focus
 
            /* 210603 | 접근성 | history,search aria add */
            var ariahidden = $('footer, #container, #skip_navi, header .gnb > div:not(.hd-etc), header .gnb .hd-etc .util > li, header .gsnb, .gnb .btn-history');
            ariahidden.removeAttr('tabindex');
            ariahidden.removeAttr('aria-hidden');
            /* //210603 | 접근성 | history,search aria add */
            $('.history')
                .removeClass('on')
                .find('.container')
                .stop()
                .animate({
                        right: -1 * $('.history').width(),
                        opacity: 1,
                    },
                    500,
                    'easeOutQuint',
                    function() {
                        $('.history').css('display', 'none');
                        $('body').removeClass('hid_s');
                        if (_this.isIos()) {
                            $('html').removeClass('ios');
                        }
                        /*
                  //if ( _this.isMobile == false ){
                      if ( $('#wrap').hasClass('scroll_chk') ){                        
                          _this.$el.css({
                              'top' : '0px',
                              'position' : 'absolute'
                          });
    
                          _this.$el.css({
                              'transition' : 'top 0.2s'
                          });
                      }
                  //}
                  */
                    }
                );
            e.preventDefault();
        });
        // History clear button
        $('.history .btn-clear').click(function(e) {
            _this.clearHistory();
        });
 
        /** 202304-01 웹접근 언어선택 버튼 */
        /* 20220506 GNB 언어 선택 drop,down 기능 추가 */
        $nav_languageDropCont_listBtn.removeClass('on');
        $nav_languageDropCont_closeBtn.find('span').text('Close language selection');
        switch (true) {
            // kr
            case $nav_languageUrl.indexOf('/kr/') != -1:
                // $nav_languageDropCont_listBtn.eq(0).addClass('on');
                $nav_languageDropCont_closeBtn.find('span').text('언어선택 닫기');
                $nav_languageDropContDL.find('.lan_kr').addClass('on');
                break;
 
                // cn
            case $nav_languageUrl.indexOf('/cn/') != -1:
                $nav_languageDropContDL.find('.lan_cn').addClass('on');
 
                $nav_languageDropContDL.find('.lan_kr').insertAfter('.lan_in');
                break;
 
                // eu
            case $nav_languageUrl.indexOf('/eu/') != -1:
                $nav_languageDropContDL.find('.lan_eu').addClass('on');
                $nav_languageDropContDL.find('.lan_kr').before($nav_languageDropContDL.find('.lan_eu'));
 
                $nav_languageDropContDL.find('.lan_kr').insertAfter('.lan_in'); //1번 국문이 lan_in 자리로 올라가기 : 공통
                break;
 
                // en
            case $nav_languageUrl.indexOf('/en/') != -1:
                $nav_languageDropContDL.find('.lan_en').addClass('on');
                $nav_languageDropContDL.find('.lan_kr').before($nav_languageDropContDL.find('.lan_en'));
 
                $nav_languageDropContDL.find('.lan_kr').insertAfter('.lan_in'); //1번 국문이 lan_in 자리로 올라가기 : 공통
                break;
 
                // in
            case $nav_languageUrl.indexOf('/in/') != -1:
                $nav_languageDropContDL.find('.lan_in').addClass('on');
                $nav_languageDropContDL.find('.lan_kr').before($nav_languageDropContDL.find('.lan_in'));
 
                $nav_languageDropContDL.find('.lan_kr').insertAfter('.lan_en'); //1번 국문이 lan_en 자리로 올라가기
                break;
 
                // la
            case $nav_languageUrl.indexOf('/la/') != -1:
                $nav_languageDropContDL.find('.lan_la').addClass('on');
                $nav_languageDropContDL.find('.lan_kr').before($nav_languageDropContDL.find('.lan_la'));
 
                $nav_languageDropContDL.find('.lan_kr').insertAfter('.lan_in'); //1번 국문이 lan_in 자리로 올라가기 : 공통
                break;
 
                // vn
            case $nav_languageUrl.indexOf('/vn/') != -1:
                $nav_languageDropContDL.find('.lan_vn').addClass('on');
                $nav_languageDropContDL.find('.lan_kr').before($nav_languageDropContDL.find('.lan_vn'));
 
                $nav_languageDropContDL.find('.lan_kr').insertAfter('.lan_la'); //1번 국문이 lan_in 자리로 올라가기 : 공통
                break;
 
                // us
            case $nav_languageUrl.indexOf('/us/') != -1:
                $nav_languageDropContDL.find('.lan_us').addClass('on');
                $nav_languageDropContDL.find('.lan_kr').before($nav_languageDropContDL.find('.lan_us'));
 
                $nav_languageDropContDL.find('.lan_kr').insertAfter('.lan_in'); //1번 국문이 lan_in 자리로 올라가기 : 공통
                break;
            default:
                break;
        }
 
        //언어선택 : 마우스 접근
		$nav_languageBtn.on(_this.isMobile ? 'click' : 'mouseover focus', function (e) {
            _this.menuClose();
            _this.searchBoxClose();
            if(ariahidden || '') {
                ariahidden.removeAttr("tabindex aria-hidden");
            }
            e.stopPropagation();
            $(this).closest('li').addClass('language_on');
            
			LanguageBtnCloseFocus = $(this);
        });
        $nav_languageDropCont.on('mouseover', function(e) {
            $(this).closest('li').addClass('language_on');
        });
        $nav_languageDropCont.on('mouseleave blur', function(e) {
            $(this).closest('li').removeClass('language_on');
        });
 
        //언어선택 : 키보드 접근
        $nav_languageBtn.on('mouseleave', function(e) {
            $(this).closest('li').removeClass('language_on');
        });
        $nav_languageBtn.on('keydown blur', function(e) {
            if (e.shiftKey && e.keyCode === 9) {
                $(this).closest('li').removeClass('language_on');
                // return false;
            } else if (e.keyCode === 9) {
                var $dropContDl = $(this).next('.dropCont_language'),
                    $dropContDl_btn = $dropContDl.find('dl dd');
 
                $dropContDl_btn.first().find('a').focus();
            }
        });
 
        $nav_languageDropCont_closeBtn.on('click', function(e) {
            $(this).closest('li').removeClass('language_on');
            
			LanguageBtnCloseFocus.focus();
        });
        /* //20220506 GNB 언어 선택 drop,down 기능 추가 */
        /** //202304-01 웹접근 언어선택 */
 
        /** gnb 검색 버튼 */
        var ariahidden;
        //20230623 click 이벤트에서 -> mousevoer 이벤트 수정
        $nav_search_btn.on(_this.isMobile ? 'click' : 'mouseover focus', function(e) {
            if (_this.isMobile) {
                e.preventDefault(); // 기본 동작 방지
            }
            _this.closeMobileGsnb();
            _this.rnbMenuClose();
            _this.historyMenuClose();
            $nav_languageDropCont.parent().removeClass('language_on');
 
            /* 210603 | 접근성 | history,search aria add | nth-child(3) - 운영기, 로컬 li 갯수다름 추후 수정해야함 */
            if (_this.isMobile == false) {
                ariahidden = $('footer, #container, #skip_navi');
            } else {
                //202304-01 웹접근 class 추가
                ariahidden = $(
                    'footer, #container, #skip_navi, header .gnb > div:not(.hd-etc), header .gsnb, .gnb .btn-search, .tail_bnr a, .cont, .cont a, .cont input, .cont button, .blind form, .slidePopup, .md_share_area, .floating-re, #corpCountry, .util > li:first-child, .util > li:last-child'
                );
            }
            ariahidden.attr({ tabindex: '-1', 'aria-hidden': true });
            
            //키보드 접근 : 검색버튼의 마지막 버튼의 기능
            $nav_search_box_closeBtn.on('keydown', function(event) {
                if (!event.shiftKey && (event.keyCode || event.which) === 9) {
                    // Tab키 : 초점 받을 수 있는 마지막 요소에서 첫번째 요소으로 초점 이동
                    event.preventDefault();
                    if(_this.isMobile) {
                        $search_boxOBJ_first.focus();
                    } else {
                        ariahidden.removeAttr("tabindex aria-hidden");
                        // $nav_rnb_btn.focus(); //pc에선 rnb메뉴로 이동 //20240814 pc에서 rnb메뉴가 없어졌기 때문에 검색창 닫기로 이동
                        _this.searchBoxClose();
                    }
                }
            });
 
            $(this).closest('li').append('<div class="search_dim"></div>');
 
            $('.search_dim').on('click', function() {
                _this.searchBoxClose();
            });
 
            $('body').addClass('hid_s');
            if (_this.isIos()) {
                $('html').addClass('ios');
            }
            $(this).addClass('on');
 
            if (_this.isMobile) {
                $('.search_box')
                    .css({
                        left: $('.search_box').width() + 'px',
                    })
                    .show()
                    .animate({ left: '0px' }, 500, 'easeOutQuint');
                      // $(".search_box .btn-close").focus(); //202304-01 웹접근 : 삭제
                    $search_boxOBJ_first.focus();
            } else {
                $('.search_box').show();
            }
            
			SearchBtnCloseFocus = $(this);
        });

        $nav_search_btn.on('focus', function () {
            $nav_languageBtn.parent().removeClass('language_on');
        });
 
        $nav_search_boxWrap.on('mouseleave', function() {
            ariahidden.removeAttr("tabindex aria-hidden");
            _this.searchBoxClose();
        });
 
        $('.search_box form .input').on('keyup', function(e) {
            if ($(this).val().length > 0) {
                $('.search_box form .delete').show();
            } else {
                $('.search_box form .delete').hide();
            }
        });
 
        $('.search_box form .delete').on('click', function() {
            $(this).hide();
            $('.search_box form .input').val('').focus();
        });
 
        //202304-01 웹접근 추가 : gnb검색 키보드 접근
        $nav_search_formColoseBtn.on('keydown', function(e) {
            $nav_search_formDropDown.removeClass('on');
        });
 
        $('.search_box .btn-close').on('click', function() {
            /* 20230623 click 이벤트에서 -> mousevoer 이벤트 수정 */
            // $('.hd-etc .btn-search').removeClass('on').focus(); //원본
            $('.hd-etc .btn-search').removeClass('on');
            /* //20230623 click 이벤트에서 -> mousevoer 이벤트 수정 */
 
            $('.search_dim').remove();
 
            /* 210603 | 접근성 | history,search aria add */
            /* 202304-01 웹접근 class 추가 */
            var ariahidden = $(
                'footer, #container, #skip_navi, header .gnb > div:not(.hd-etc), header .gnb .hd-etc .util > li, header .gsnb, .gnb .btn-search, .tail_bnr a, .tail_bnr a, .cont, .cont a, .cont input, .cont button, .slidePopup, .md_share_area, .floating-re, #corpCountry, .util > li:first-child, .util > li:last-child'
            );
            ariahidden.removeAttr('tabindex aria-hidden');
            /* //210603 | 접근성 | history,search aria add */
 
            if (_this.isMobile) {
                $('.search_box').animate({
                        left: $('.search_box').width() + 'px',
                    },
                    500,
                    'easeOutQuint',
                    function() {
                        $('.search_box').hide();
                        $('body').removeClass('hid_s');
                        if (_this.isIos()) {
                            $('html').removeClass('ios');
                        }
                        $('.search_box form .input').val('');
                        $('.search_box form .delete').hide();
                    }
                );
            } else {
                $('.search_box').hide();
                $('body').removeClass('hid_s');
                $('.search_box form .input').val('');
                $('.search_box form .delete').hide();
            }
            
			SearchBtnCloseFocus.focus();
        });
        /** //gnb 검색 버튼 */
 
        //202304-01 웹접근 추가 : rnb 햄버거 버튼
        //키보드 접근시 햄버거 메뉴로 접근했을때
        $nav_rnb_btn.on('mouseover focus', function(e) {
            if(ariahidden || '') {
                ariahidden.removeAttr("tabindex aria-hidden");
            }
            _this.searchBoxClose();
        });
 
        //리뉴얼 메인section2 컨텐츠 서치 부분
        $('.mainSection2-search_container form .input').on('keyup', function(e) {
            if ($(this).val().length > 0) {
                $('.mainSection2-search_container form .delete').show();
            } else {
                $('.mainSection2-search_container form .delete').hide();
            }
        });
 
        $('.mainSection2-search_container form .delete').on('click', function() {
            $(this).hide();
            $('.mainSection2-search_container form .input').val('').focus();
        });
 
        // rnb
        $('.btn_hamburger').find('.blind').text(langSet[_this.lang].rnb.activeStr.toString()); /* 210412 | 접근성 | 대체텍스트 추가 */
        $('.btn_hamburger').click(function(e) {
            if ($(this).attr('disabled')) return false;
            _this.closeMobileGsnb();
            _this.searchBoxClose();
            _this.historyMenuClose();
            _this.setHeightRightContainer();
 
            //$(".history .btn-close").trigger('click');
            var $nav = $('.rnb > .container').eq(0);
            var $this = $(this);
            var $span = $this.find('.blind');
            var $rnbBtnClose = $('.rnb .btn-close'); /* 210412 | 접근성 | 대체텍스트 추가 */
            /* 210527 | 접근성 | rnb aria범위수정 */
            var ariahidden; /* 210514 | 접근성 | rnb 구조변경 */
            if (_this.isMobile == false) {
                ariahidden = $('footer, #container, #skip_navi');
            } else {
                ariahidden = $(
                    'footer, #container, #skip_navi, header .gnb > div:not(.hd-etc), header .gnb .hd-etc .util > li:not(li:last-child), header .gsnb, .btn_hamburger, .blind form, .slidePopup, .md_share_area, .floating-re, #corpCountry'
                );
            }
            /* //210527 | 접근성 | rnb aria범위수정 */
 
            if ($(this).hasClass('active')) {
                $nav.stop().animate({
                        right: -1 * $nav.width(),
                    },
                    500,
                    'easeOutQuint',
                    function() {
                        $this.removeClass('active').removeAttr('disabled');
                        $('.rnb').css('display', 'none');
                        _this.setDefaultRnb();
                        $('.btn_hamburger').focus(); /* 210429 | 접근성 | 포커스 수정 */
 
                        $('body').removeClass('hid_s');
 
                        if (_this.isIos()) {
                            $('html').removeClass('ios');
                        }
                        /* 210514 | 접근성 | rnb 구조변경 */
                        ariahidden = $(
                            'footer, #container, #skip_navi, header .gnb > div:not(.hd-etc), header .gnb .hd-etc .util > li:not(li:last-child), header .gsnb, .btn_hamburger, .blind form, .slidePopup, .md_share_area, .floating-re, #corpCountry'
                        ); /* 210527 | 접근성 | rnb aria범위수정 */
                        ariahidden.removeAttr('tabindex');
                        ariahidden.removeAttr('aria-hidden');
                        /* //210514 | 접근성 | rnb 구조변경 */
                        //if ( _this.isMobile == false ){
                        /*
                      if ( $('#wrap').hasClass('scroll_chk') ){
                          _this.$el.css({
                              'top' : '0px',
                              'position' : 'absolute'
                          });
    
                          _this.$el.css({
                              'transition' : 'top 0.2s'
                          });
                      }
                      */
                        //}
                    }
                );
                $span.text(langSet[_this.lang].rnb.activeStr.toString());
                $this.attr('disabled', 'disabled');
                $rnbBtnClose.text(langSet[_this.lang].rnb.activeStr.toString()); /* 210412 | 접근성 | 대체텍스트 추가 */
                //$this.html((langSet[_this.lang].rnb.activeStr).toString()+'<i class="line"></i>').attr("disabled", "disabled");
            } else {
                $('body').addClass('hid_s');
 
                if (_this.isIos()) {
                    $('html').addClass('ios');
                }
 
                //if ( _this.isMobile == false ){
                /*
                        if ( $('#wrap').hasClass('scroll_chk') ){
                            _this.$el.css({
                                'transition' : 'none'
                            });
                            _this.$el.css({
                                'top' : $('#header').offset().top + 'px',
                                'position' : 'fixed'
                            });
                        }
                        */
                //}
 
                $('.rnb').css('display', 'block');
                $nav
                    .stop()
                    .css({ right: -1 * $nav.width() })
                    .animate({
                            right: 0,
                        },
                        200,
                        'easeOutQuint',
                        function() {
                            $this.addClass('active').removeAttr('disabled');
                        }
                    );
                /* 210514 | 접근성 | rnb 구조변경 */
                ariahidden.attr({
                    tabindex: '-1',
                    'aria-hidden': true,
                });
                /* //210514 | 접근성 | rnb 구조변경 */
                $span.text(langSet[_this.lang].rnb.inactiveStr.toString());
                $rnbBtnClose.text(langSet[_this.lang].rnb.inactiveStr.toString()); /* 210412 | 접근성 | 대체텍스트 추가 */
                $this.attr('disabled', 'disabled');
                $('.rnb li:first .title > a:first').focus(); /* 210525 | 접근성 | 포커스 회귀 추가 */
                //$this.html((langSet[_this.lang].rnb.inactiveStr).toString()+'<i class="line"></i>').attr("disabled", "disabled");
            }
            e.preventDefault();
        });
 
        var isOpeningRnb = false;
        /* 210514 | 접근성 | rnb 구조변경 */
        $('.rnb .depth-main .title.dep1 a')
            .click(function(e) {
                if (isOpeningRnb) return;
 
                if (!$(this).closest('li').hasClass('no-child') && !$(this).closest('li').hasClass('on')) {
                    isOpeningRnb = true;
                    _this.setRnb(this.className || 'none', function() {
                        isOpeningRnb = false;
                    });
                    e.preventDefault();
                }
            })
            .eq(0)
            .trigger('click');
 
        //202304-01 웹접근 : RNB 메뉴 최초 시작시 닫힘 타이틀
        if (_this.isMobile) {
            // 22년03 접근성 심사때 pc에선 title,aria-expanded 따로 삭제해서 모바일에서만 적용되게 수정
            $('.rnb .depth-sub .items.depth2 > li > .title a').attr({'aria-expanded': 'false' });
        }
 
        $('.rnb .depth-sub .items.depth2 > li > .title a').on('click', function(e) {
            /* 2023-10-20 rnb 2depth 기능 수정 시작 */
            /* 원본 */
            // e.preventDefault();
            // if (!_this.isMobile) return;
 
            if (_this.isMobile) {
                e.preventDefault();
            } else {
                if (!$(this).closest('.depth_inner').hasClass('gkrk')) e.preventDefault(); // 물류 X
 
                return;
            }
            /* // 2023-10-20 rnb 2depth 기능 수정 끝 */
 
            var $btn = $(e.currentTarget);
            // 애니메이션 : $btn.toggleClass("on");
            $(this)
                .parent('.title')
                .next('.items')
                .slideToggle('fast', function() {
                    if ($(this).is(':visible')) {
                        $btn.attr({ 'aria-expanded': 'true' }).addClass('on');
                    } else {
                        $btn.attr({ 'aria-expanded': 'false' }).removeClass('on');
                    }
                });
        });
        $('.rnb .depth-sub .items.depth2 > li').on({
            'mouseenter focusin': function(e) {
                if (_this.isMobile) return;
                var $btn = $(e.currentTarget).find('> .title a');
                // 애니메이션 : $btn.toggleClass("on");
                $(this)
                    .find('> .items')
                    .stop()
                    .slideDown('fast', function(e) {
                        //220331 | 접근성 | RNB title 제거
                        $btn.addClass('on'); //.attr({"title": (langSet[_this.lang].menuState.inactiveStr).toString(), "aria-expanded":"true"})
                    });
                e.preventDefault();
            },
            'mouseleave focusout': function(e) {
                if (_this.isMobile) return;
                var $thisAll = $('.rnb .depth-sub .items.depth2 > li');
                // 애니메이션 : $btn.toggleClass("on");
                $thisAll
                    .find('> .items')
                    .stop()
                    .slideUp('fast', function() {
                        $(this).css('height', 'auto');
                    });
                //220331 | 접근성 | RNB title 제거
                $thisAll.find('> .title a').removeClass('on'); //.attr({"title": (langSet[_this.lang].menuState.activeStr).toString(), "aria-expanded":"false"})
                e.preventDefault();
            },
        });
        /* //210514 | 접근성 | rnb 구조변경 */
 
        $('.rnb .head .btn-close').on('click', function() {
            $('.btn_hamburger').trigger('click');
            _this.$el.find('.rnb').find('.btn-close').text(langSet[_this.lang].rnb.inactiveStr.toString()); /* 210412 | 접근성 | 대체텍스트 추가*/
        });
        /* 210514 | 접근성 | rnb 구조변경 */
        // rnb tab 접근성
        var $rnbLeftLinks = $('.rnb .depth-main ul li .title > a');
        $rnbLeftLinks.on('keydown', function(e) {
            if (e.which == 9 && !e.shiftKey) {
                // 마지막일때
                if ($rnbLeftLinks.index(this) == $rnbLeftLinks.length - 1) {
                    e.preventDefault();
                    var ariahidden = $(
                        'footer, #container, #skip_navi, header .gnb > div:not(.hd-etc), header .gnb .hd-etc .util > li:not(li:last-child), header .gsnb, .btn_hamburger'
                    ); /* 210527 | 접근성 | rnb aria범위수정 */
                    $('.hd-etc .btn_hamburger').trigger('click'); /* 210429 | 접근성 | 마지막메뉴 후 rnb 닫힘 */
                    ariahidden.removeAttr('tabindex');
                    ariahidden.removeAttr('aria-hidden');
                    $('#container').find('a:visible').eq(0).focus();
                }
            }
        });
 
        /* //210514 | 접근성 | rnb 구조변경 */
 
        // gsnb Mobile 3depth slider
        _this.subContainers = $('.gsnb.mobile .inner .owl-carousel > div');
        _this.carouselItemStatus = null;
        _this.$subMenuCarousel = $('.gsnb.mobile .inner .owl-carousel')
            .owlCarousel({
                items: 1,
                mouseDrag: false,
                touchDrag: false,
                pullDrag: false,
                dots: false,
                loop: false,
            })
            .on('changed.owl.carousel', function(e) {
                _this.carouselItemStatus = e;
            });
 
        $('.gsnb.mobile .inner .owl-carousel .owl-item > div > .items').eq(0).scrollbar({
            autoScrollSize: false,
        });
 
        // gsnb event 1depth
        $('.gsnb.mobile .inner > .title > a').on('click', function() {
            var self = $(this);
            var gnbTop = Number($('.M00_A').css('top').replace('px', ''));
            var gnbHeight = $('.M00_A .inner').height();
            var containerHeight = $(window).innerHeight() - (gnbHeight + gnbTop);
            //var containerHeight = screen.height - 112;
            if (self.hasClass('on')) {
                $('.gsnb.mobile .inner .owl-carousel')
                    .stop()
                    .slideUp(300, function() {
                        _this.subContainers.eq(0).find('.scroll-wrapper .menulist .title a').removeClass('on');
                        // _this.subContainers.eq(0).find(".scroll-wrapper .menulist ul.items").hide();
                        _this.subContainers.eq(0).find('.scroll-wrapper .menulist ul.items, .scroll-wrapper .menulist .items.renewal').hide();
                        _this.subContainers.eq(0).find('.scroll-wrapper .menulist .title a').attr('aria-expanded', 'false');
                        self.attr('aria-expanded', 'false'); //210412 | 접근성 | aria-expanded 속성 추가
 
                        if (_this.carouselItemStatus.item.count > 1) {
                            _this.$subMenuCarousel.trigger('to.owl.carousel', 0).trigger('remove.owl.carousel', 1).trigger('refresh.owl.carousel');
                        }
                        $('body').removeClass('hid_s');
                    });
                self.removeClass('on');
                self.attr('aria-expanded', 'false'); //210412 | 접근성 | aria-expanded 속성 추가
 
                if (_this.isIos()) {
                    $('html').removeClass('ios');
                }
            } else {
                $('body').addClass('hid_s');
 
                if (_this.isIos()) {
                    //alert('IOS TEST');
                    $('.gsnb.mobile .inner .owl-carousel').css({
                        top: gnbHeight + gnbTop + 'px',
                        //'height' : 'calc(100vh - '+ ( gnbHeight + gnbTop ) +'px)'
                        height: containerHeight + 'px',
                    });
                    $('html').addClass('ios');
                } else {
                    $('.gsnb.mobile .inner .owl-carousel').css({
                        top: gnbHeight + gnbTop + 'px',
                        height: 'calc(100vh - ' + (gnbHeight + gnbTop) + 'px)',
                    });
                }
 
                _this.subContainers.eq(0).find('.scroll-wrapper > ul.items').show();
 
                $('.gsnb.mobile .inner .owl-carousel')
                    .stop()
                    .slideDown('fast', function() {
                        /*
                                if (_this.isIos()){
                                    $('.gsnb.mobile .inner .owl-carousel .items.scroll-content').scrollTop(0);
                                    $('.gsnb.mobile .inner .owl-carousel .items.scroll-content .scroll-element.scroll-y').scrollTop(0);
                                }
                                */
                    });
                self.addClass('on');
                self.attr('aria-expanded', 'true'); //210412 | 접근성 | aria-expanded 속성 추가
            }
        });
        // gsnb event 2depth
        $('.gsnb.mobile .owl-carousel .menulist > .title > a').on('click', function() {
            var self = $(this);
 
            $(this)
                .parent('.title')
                .next('.items')
                .slideToggle('fast', function() {
                    if ($(this).is(':visible')) {
                        self.addClass('on');
                        self.attr('aria-expanded', 'true'); //210412 | 접근성 | aria-expanded 속성 추가
                    } else {
                        self.removeClass('on');
                        self.attr('aria-expanded', 'false'); //210412 | 접근성 | aria-expanded 속성 추가
                    }
                });
        });
        // gsnb event 3depth
        $('.gsnb.mobile .owl-carousel .menulist-sub:not(.no-child) > .title > a').attr('aria-expanded', 'false'); //210412 | 접근성 | aria-expanded 속성 추가
        $('.gsnb.mobile .owl-carousel .menulist-sub:not(.no-child) > .title > a').on('click', function() {
            // 3depth click!!!
            handleMoveThirdDepth({
                $that: $(this),
                $clone: $(this).parent().next().clone(),
                thirdDepthTitleSelector: 'li a',
                _this: _this,
                callback: (payload) => {
                    const { _this, self, $clone } = payload;
                    $clone
                        .addClass('menulist-sub')
                        .find('li')
                        .eq(0)
                        .off('click')
                        .on('click', function(e) {
                            // 3depth back!!!
                            var prevResult = _this.$subMenuCarousel.trigger('prev.owl.carousel', 200);
 
                            _this.$subMenuCarousel.trigger('remove.owl.carousel', 1).trigger('refresh.owl.carousel');
                            self.removeClass('on').attr('aria-expanded', 'false'); // 210412 | 접근성 접근성 | aria-expanded 속성 추가
                        });
                },
                autoScrollSizeSelector: '.inner .owl-carousel .owl-item > .items',
            });
        });
 
        $(document).on('click', '.gsnb.mobile .item_dropdownMenu:not(.no-child) .link_dropdownMenu', function(event) {
            // 3depth click
            event.preventDefault();
            handleMoveThirdDepth({
                $that: $(this),
                $clone: $(this).siblings('.grp_dropdownChildren').clone(),
                thirdDepthTitleSelector: '.link_comm',
                _this: _this,
                callback: (payload) => {
                    const { _this, self, $clone, thirdDepthTitleSelector } = payload;
 
                    $clone
                        .find(thirdDepthTitleSelector)
                        .off('click')
                        .on('click', function() {
                            // 2depth back
 
                            _this.$subMenuCarousel.trigger('prev.owl.carousel', 200);
                            _this.$subMenuCarousel.trigger('remove.owl.carousel', 1).trigger('refresh.owl.carousel');
                            self.removeClass('on').attr('aria-expanded', 'false'); // 210412 | 접근성 접근성 | aria-expanded 속성 추가
                        });
                },
                autoScrollSizeSelector: '.grp_dropdownChildren',
            });
        });
 
        function handleMoveThirdDepth(payload) {
            const { $that, $clone, thirdDepthTitleSelector, _this, autoScrollSizeSelector } = payload;
            const self = $that;
 
            self.attr('aria-expanded', 'true');
            payload.callback({ self, $clone, thirdDepthTitleSelector, _this });
            $clone.find(thirdDepthTitleSelector).eq(0).attr('aria-expanded', 'true'); // 210412 | 접근성 접근성 | aria-expanded 속성 추가
            _this.$subMenuCarousel.trigger('add.owl.carousel', [$clone.show()]).trigger('refresh.owl.carousel');
            _this.$subMenuCarousel.trigger('next.owl.carousel', 200);
 
            $('.gsnb.mobile').find(autoScrollSizeSelector).scrollbar({
                autoScrollSize: false,
            });
        }
 
        // window scroll
        var position = $(window).scrollTop();
        var isAnimating = false;
        var headerHeight = $('.gnb').height() + 1;
        var $rnbContainer = $('.rnb > .container').eq(0);
        var scollchkTimeout = null;
 
        const $gnbNew = $gnb.find('.gnb.new');
        const $gsnb = $gnb.find(".gsnb:not('.mobile')");
        const $gsnbMobile = $gnb.find('.gsnb.mobile');
 
        $(window).on('scroll.gnb', function(e) {
            if (e.target !== document) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
 
            if ($('body').hasClass('hid_s')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
 
            if (_this.gnbType == 'main' || _this.gnbType == 'static') {
                //_this.menuClose();
            } else {
                if (!$gsnb.find('li.offering-list').hasClass('on')) {
                    _this.subMenuClose();
                }
            }
 
            //_this.gnbTopLinks.trigger('blur');
 
            var scroll = $(window).scrollTop();
            var hasTailBox = $('body').hasClass('tail_chk');
            var tailHeight = 0;
 
            if (_this.isMobile) hasTailBox = false;
            if (hasTailBox) {
                tailHeight = $('.tail_wrap').height();
            }
 
            if (scroll == position) return;
 
            if (scroll > position) {
                $('body').addClass('sc_down');
                $gnb.find(".gsnb:not('.mobile') li.offering-list .items.renewal").css({
                    position: 'fixed',
                    top: $gsnb.outerHeight() - 1,
                });
 
                $gsnbMobile.find('.inner .owl-carousel').css({
                    top: $gsnbMobile.outerHeight() - 1,
                    height: $(window).outerHeight() - $gsnbMobile.outerHeight() + 1,
                });
 
                if (scroll > $('#header').offset().top) {
                    if (hasTailBox) {
                        $gnb.css({
                            transition: 'top 0.2s',
                            top: '-' + ($('.gnb').height() + 1 + tailHeight) + 'px',
                            position: 'fixed',
                        });
                    } else {
                        if (scroll > 60) {
                             $gnb.css({
                                transition: '',
                                top: '-' + ($('.gnb').height() + 1) + 'px',
                                position: 'fixed',
                            });
                        }
                    }
                } else {
                    if (hasTailBox) {
                        $gnb.css({
                            transition: 'none',
                            top: $('#header').offset().top - scroll - tailHeight + 'px',
                        });
                    } else {
                        if (scroll > 60) {
                            $gnb.css({
                                transition: '',
                                top: $('#header').offset().top - scroll + 'px',
                            });
                        }
                    }
                }
                if (_this.gnbType == 'main' && scroll > 100) {
                    gnbMainTransparentTimer.stop();
                }

                fixedTab(); //20241119 fixed_tab : 공통 서브페이지 fixed탭
            } else {
                $('body').removeClass('sc_down');
 
                $gnb.find(".gsnb:not('.mobile') li.offering-list .items.renewal").css({
                    position: 'fixed',
                    top: $gnbNew.outerHeight() + $gsnb.outerHeight() - 1,
                });
 
                $gsnbMobile.find('.inner .owl-carousel').css({
                    top: $gnbNew.outerHeight() + $gsnbMobile.outerHeight(),
                    height: $(window).outerHeight() - $gnbNew.outerHeight() - $gsnbMobile.outerHeight() + 1,
                });
 
                if (scroll > $('#header').offset().top) {
                    if (hasTailBox) {
                        $gnb.css({
                            transition: 'top 0.2s',
                            top: '-' + tailHeight + 'px',
                        });
                    } else {
                        $gnb.css({ top: '0px' });
                    }
                } else {
                    if (hasTailBox) {
                        $gnb.css({
                            transition: 'none',
                            top: $('#header').offset().top - scroll - tailHeight + 'px',
                        });
                    } else {
                        $gnb.css({
                            top: '0px',
                        });
                    }
                }
                if (_this.gnbType == 'main' && scroll < 101) {
                    if (_this.isFocus == false) {
                        gnbMainTransparentTimer.start();
                    }
                }

                fixedTab(); //20241119 fixed_tab : 공통 서브페이지 fixed탭
            }
            position = scroll;
 
            window.clearTimeout(scollchkTimeout);
            scollchkTimeout = setTimeout(function() {
                //isAnimating = false;
                if ($(window).scrollTop() > 0) {
                    $wrap.removeClass('scroll_chk');
                } else {
                    $wrap.addClass('scroll_chk');
                }
            }, 50);
        });
 
        // window Resize
        $(window).on('resize', function() {
            gnbResizeTimer.start();
        });
 
        _this.$el.find(".rnb").css("right", getContainerRight() + "px");
        _this.$el.find(".history").css("right", getContainerRight() + "px");



        //리뉴얼 gnb 기능
        $('[class *= "link_offering_depth"]').on('mouseover focus', function () {
            $('.cstm_scrl').removeClass('running1 running2 running3').prev().removeClass('scrShadow');; //20231103 gnb : scrShadow 추가

            const $itemOfferingDepth = $(this).parent('li');
            const $innerOfferingDepth = $(this).closest('[class *= "inner_offering_depth"]');
            const $cstmScrl = $(this).closest('[class *= "cstm_scrl"]');

            //20231103 gnb : 스크롤 있는지 없는지 여부 확인
            function scroll_existence() {
                $.fn.hasVerticalScrollBar = function() {
                    return this.get(0) ? this.get(0).scrollHeight > this.innerHeight() : false;
                }
                if($('.cstm_scrl.running3').hasVerticalScrollBar()){
                    $cstmScrl.prev().addClass('scrShadow');
                } else {
                    $cstmScrl.prev().removeClass('scrShadow');
                }
            }

            if ($itemOfferingDepth.hasClass('item_offering_depth1')) $cstmScrl.addClass('running1');
            if ($innerOfferingDepth.hasClass('inner_offering_depth2')) $cstmScrl.addClass('running2'), scroll_existence(); //20231103 gnb : 스크롤 생성시 라인
            if ($innerOfferingDepth.hasClass('inner_offering_depth3')) $cstmScrl.addClass('running3'), scroll_existence(); //20231103 gnb : 스크롤 생성시 라인
        });

		// 리뉴얼 클라우드 gnb : 마우스와 키보드 이벤트를 분리 (Tab 접근성 로직 통합)
		$('[class *= "group_offering_depth"] a, .dep2_floating_menu a').on('keydown', function (e) {
			const $this = $(this);
			const keyCode = e.keyCode || e.which;
			const isShift = e.shiftKey;

			// 현재 위치 정보 파악
			const $group = $this.closest('[class *= "group_offering_depth"]');
			const depth = $group.data('offeringDepth') || 2; // floating_menu는 depth2 그룹 영역으로 간주

			// 1. 방향키 로직 (좌/우)
			if (keyCode == 39) { // 오른쪽 방향키
				let k_right_cont = $('[class *= "group_offering_depth"]').filter(`[data-offering-depth = ${depth + 1}]`);
				let k_right_3depthCont = k_right_cont.find('>div.active').find('.inner_offering_depth3.active');
				let k_right_2depth_buttonCont = k_right_cont.find('.dep2_floating_menu');

				if (depth === 1) {
					// 현재 메뉴가 특수 메뉴(cloudMenuSeleck)라면 플로팅 메뉴로, 아니면 일반 리스트로
					k_right_cont.find('.inner_offering_depth2.cloudMenuSeleck').hasClass('active')
						? k_right_2depth_buttonCont.find('a').eq(0).focus()
						: k_right_cont.find('.inner_offering_depth2.active').find('a').eq(0).focus();
				} else if (depth === 2) {
					k_right_3depthCont.find('a').eq(0).focus();
				}
				return; 
			} else if (keyCode == 37) { // 왼쪽 방향키
				let k_left_cont = $('[class *= "group_offering_depth"]').filter(`[data-offering-depth = ${depth - 1}]`).find('[class *= "item_offering_depth"].current');
				k_left_cont.find('a').focus();
				return;
			}

			// 2. Tab 키 접근성 로직
			if (keyCode === 9) {
				const $floatingMenu = $('.dep2_floating_menu');
				const isFloatingVisible = $floatingMenu.length && $floatingMenu.is(':visible');

				// --- 정방향 Tab (Next) ---
				if (!isShift) {
					// [CASE 1] 1depth에서 Tab -> 2depth 진입 판단
					if (depth === 1) {
						const idx = $this.closest(selectorDepth.first.item).index();
						const $targetInner2 = $(selectorDepth.second.group).find(selectorDepth.second.inner).eq(idx);
						
						const hasListLinks = $targetInner2.find('a').length > 0;
						const isSpecialMenu = $targetInner2.hasClass('cloudMenuSeleck');

						if (isSpecialMenu && isFloatingVisible) {
							e.preventDefault();
							$floatingMenu.find('a').first().focus();
						} else if (hasListLinks) {
							e.preventDefault();
							$targetInner2.find('a').first().focus();
						}
						// 링크가 없는 빈 div인 경우 preventDefault가 실행되지 않아 다음 1depth로 자연스럽게 이동함
					}
					// [CASE 2] 2depth에서 Tab
					else if (depth === 2) {
						const $inFloating = $this.closest('.dep2_floating_menu');
						
						// 플로팅 메뉴 마지막 요소인 경우
						if ($inFloating.length && $this.is($inFloating.find('a').last())) {
							const $activeList2 = $(selectorDepth.second.group).find(selectorDepth.second.inner + '.active');
							if ($activeList2.find('a').length > 0) {
								e.preventDefault();
								$activeList2.find('a').first().focus();
							} else {
								// 하위 리스트가 없으면 다음 1depth로
								const $next1 = $(selectorDepth.first.group).find(selectorDepth.first.item + '.current').next().find('a');
								if($next1.length) { e.preventDefault(); $next1.focus(); }
							}
						} 
						// 일반 2depth 리스트 항목인 경우
						else if (!$inFloating.length) {
							const $item2 = $this.closest(selectorDepth.second.item);
							if ($item2.length) {
								const item2Idx = $item2.index();
								const $targetInner3 = $(selectorDepth.third.group).find(selectorDepth.third.outer + '.active ' + selectorDepth.third.inner).eq(item2Idx);

								// 하위 3depth가 있으면 이동
								if ($targetInner3.length && $targetInner3.is(':visible') && $targetInner3.find('a').length > 0) {
									e.preventDefault();
									$targetInner3.find('a').first().focus();
								} 
								// 2depth 마지막 항목이고 3depth도 없다면 다음 1depth로
								else if ($item2.is(':last-child')) {
									const $next1 = $(selectorDepth.first.group).find(selectorDepth.first.item + '.current').next().find('a');
									if($next1.length) { e.preventDefault(); $next1.focus(); }
								}
							}
						}
					}
					// [CASE 3] 3depth 마지막 항목에서 Tab -> 2depth 다음 항목으로
					else if (depth === 3) {
						const $allLinksIn3 = $this.closest(selectorDepth.third.inner).find('a');
						if ($this.is($allLinksIn3.last())) {
							e.preventDefault();
							const current2Idx = $this.closest(selectorDepth.third.inner).index();
							const $nextItem2 = $(selectorDepth.second.group).find(selectorDepth.second.inner + '.active ' + selectorDepth.second.item).eq(current2Idx + 1);

							if ($nextItem2.length) {
								$nextItem2.find('a').focus();
							} else {
								// 2depth에도 다음 항목이 없으면 다음 1depth로
								const $next1 = $(selectorDepth.first.group).find(selectorDepth.first.item + '.current').next().find('a');
								if($next1.length) $next1.focus();
							}
						}
					}
				}
				// --- 역방향 Tab (Shift + Tab) ---
				else {
					// [CASE 4] 3depth 첫 항목 -> 해당 2depth 리스트 항목으로
					if (depth === 3) {
						const $allLinksIn3 = $this.closest(selectorDepth.third.inner).find('a');
						if ($this.is($allLinksIn3.first())) {
							e.preventDefault();
							const current2Idx = $this.closest(selectorDepth.third.inner).index();
							$(selectorDepth.second.group).find(selectorDepth.second.inner + '.active ' + selectorDepth.second.item).eq(current2Idx).find('a').focus();
						}
					}
					// [CASE 5] 2depth 항목에서 역방향
					else if (depth === 2) {
						const $inFloating = $this.closest('.dep2_floating_menu');
						
						// 플로팅 메뉴 첫 요소에서 역방향 -> 현재 활성화된 1depth 메뉴로
						if ($inFloating.length && $this.is($inFloating.find('a').first())) {
							e.preventDefault();
							$(selectorDepth.first.group).find(selectorDepth.first.item + '.current a').focus();
						}
						// 리스트 첫 요소에서 역방향
						else if (!$inFloating.length) {
							const $allLinksIn2 = $this.closest(selectorDepth.second.inner).find('a');
							if ($this.is($allLinksIn2.first())) {
								e.preventDefault();
								const $activeInner2 = $(selectorDepth.second.group).find(selectorDepth.second.inner + '.active');
								
								// 현재 메뉴가 특수 메뉴(플로팅 바가 있는 메뉴)라면 플로팅 마지막 요소로, 아니면 1depth로
								if ($activeInner2.hasClass('cloudMenuSeleck') && isFloatingVisible) {
									$floatingMenu.find('a').last().focus();
								} else {
									$(selectorDepth.first.group).find(selectorDepth.first.item + '.current a').focus();
								}
							}
						}
					}
				}
			}
		});

        const renewalOffering = '.renewal_offering';
        const selectorDepth = {
            active: 'active',
            current: 'current',
            first: {
                group: '.group_offering_depth1',
                outer: null,
                inner: null,
                list: null,
                item: '.item_offering_depth1',
                link: '.link_offering_depth1'
            },
            second: {
                group: '.group_offering_depth2',
                outer: null,
                inner: '.inner_offering_depth2',
                list: '.list_offering_depth2',
                item: '.item_offering_depth2',
                link: '.link_offering_depth2'
            },
            third: {
                group: '.group_offering_depth3',
                outer: '.outer_offering_depth3',
                inner: '.inner_offering_depth3',
                list: null,
                item: '.item_offering_depth2',
                link: '.link_offering_depth2'
            }
        };

        let depthIndexes = [0, 0];

        // 첫 번째 영역에 마우스, 키보드 이벤트 발생 시 활성화될 메뉴명을 선택
        $(selectorDepth.first.group)
            .find(selectorDepth.first.link)
            .on('mouseenter focus', function (event) {
                event.stopPropagation();
                depthIndexes[0] = $(this).closest(selectorDepth.first.item).index();

                // 첫 번째 메뉴명 활성화
                $(this).closest(selectorDepth.first.item).siblings().removeClass(selectorDepth.current);
                $(this).closest(selectorDepth.first.item).addClass(selectorDepth.current);

                // 두 번째 영역의 내부 영역 전체 비활성화 및 두 번째 영역의 내부 아이템 전체 비활성화, 두 번째 영역의 내부 영역의 첫 번째 영역 활성화 및 첫 번째 내부 아이템 활성화
                $(this).closest(renewalOffering).find(selectorDepth.second.group).find(selectorDepth.second.inner).removeClass(selectorDepth.active);
                $(this).closest(renewalOffering).find(selectorDepth.second.group).find(selectorDepth.second.inner).find(selectorDepth.second.item).removeClass(`${selectorDepth.current}`);
                $(this).closest(renewalOffering).find(selectorDepth.second.group).find(selectorDepth.second.inner).eq(depthIndexes[0]).addClass(selectorDepth.active);

                // 세 번째 영역 전체 비활성화 및 세 번째 영역의 내부 영역, 내부 아이템 전체 비활성화, 세 번째 영역에서 활성화된 영역 내부 영역과 첫 번째 아이템 활성화
                $(this).closest(renewalOffering).find(selectorDepth.third.group).find(selectorDepth.third.outer).removeClass(selectorDepth.active);


                /** 
                 * 20241011
                 * 선택된 1뎁스 메뉴중 3뎁스 메뉴가 없으면 3뎁스 영영 display:none 
                 * ul class="list_offering_depth2" 로 있는지 여부 체크
                * */
                if($(this).closest('.cloudMenuOpen').length){
                    $('.dep2_floating_menu').show();

                    $(this).closest(renewalOffering).find(selectorDepth.second.group).find(selectorDepth.second.inner).removeClass(selectorDepth.active); //cloudMenuOpen 클래스가 있을때는 순차적 배열 active 삭제
                    $(this).closest(renewalOffering).find(selectorDepth.second.group).find(selectorDepth.second.inner).eq(0).addClass('active');
                    // 3뎁스 자체가 없어지기에 마크업에서 삭제 처리
                    $(this).closest(renewalOffering).find(selectorDepth.third.group).show()
                    $(this).closest(renewalOffering).find(selectorDepth.second.link).eq(0).trigger("mouseenter")
                } else {
                    $('.dep2_floating_menu').hide();

                    $(this).closest(renewalOffering).find(selectorDepth.second.group).find(selectorDepth.second.inner).eq(0).removeClass('active');
                    // 3뎁스 자체가 없어지기에 마크업에서 삭제 처리
                    $(this).closest(renewalOffering).find(selectorDepth.third.group).hide()
                }
            });

        // 두 번째 영역에 마우스, 키보드 이벤트 발생 시 활성화될 메뉴명을 선택
        $(selectorDepth.second.group)
            .find(selectorDepth.second.link)
            .on('mouseenter focus', function (event) {
                event.stopPropagation();
                depthIndexes[1] = $(this).closest(selectorDepth.second.item).index();
                // 두 번째 메뉴명 활성화
                $(this).closest(selectorDepth.second.item).siblings().removeClass(selectorDepth.current);
                $(this).closest(selectorDepth.second.item).addClass(selectorDepth.current);

                // 세 번째 영역 전체 비활성화 및 세 번째 영역의 첫 번째 영역 활성화
                $(this).closest(renewalOffering).find(selectorDepth.third.group).find(selectorDepth.third.outer).removeClass(selectorDepth.active);
                $(this).closest(renewalOffering).find(selectorDepth.third.group).find(selectorDepth.third.outer).eq(depthIndexes[0]).addClass(selectorDepth.active);

                // 활성화된 세 번째 영역의 내부 영역 전체 비활성화 및 선택된 세 번째 내부 영역 활성화, 선택된 세 번째 내부 영역의 첫 번째 아이템 활성화
                $(this).closest(renewalOffering).find(selectorDepth.third.group).find(selectorDepth.third.outer).filter(`.${selectorDepth.active}`).find(selectorDepth.third.inner).removeClass(selectorDepth.active);
                $(this).closest(renewalOffering).find(selectorDepth.third.group).find(selectorDepth.third.outer).filter(`.${selectorDepth.active}`).find(selectorDepth.third.inner).eq(depthIndexes[1]).addClass(selectorDepth.active);

                $(this).closest(renewalOffering).find(selectorDepth.third.group).find(selectorDepth.third.outer).filter(`.${selectorDepth.active}`).find(selectorDepth.third.inner).filter(`.${selectorDepth.active}`).find(selectorDepth.second.item).eq(0).addClass(selectorDepth.active);

                if($(this).closest(selectorDepth.second.inner).hasClass('cloudMenuSeleck')){
                    $(this).closest(renewalOffering).find(selectorDepth.third.group).find(selectorDepth.third.outer).eq(0).addClass(selectorDepth.active).filter(`.${selectorDepth.active}`).find(selectorDepth.third.inner).removeClass(selectorDepth.active);
                    $(this).closest(renewalOffering).find(selectorDepth.third.group).find(selectorDepth.third.outer).eq(0).addClass(selectorDepth.active).filter(`.${selectorDepth.active}`).find(selectorDepth.third.inner).eq(depthIndexes[1]).addClass(selectorDepth.active);
                }
            });

        // 세 번째 영역에 마우스, 키보드 이벤트 발생 시 활성화될 메뉴명을 선택
        $(selectorDepth.third.outer)
            .find(selectorDepth.third.link)
            .on('mouseenter focus', function (event) {
                event.stopPropagation();
                // 세 번째 메뉴명을 전체 비활성화하고 선택된 메뉴명을 활성화
                $(this).closest(selectorDepth.third.item).siblings().removeClass(selectorDepth.current);
                $(this).closest(selectorDepth.third.item).addClass(selectorDepth.current);
            })
            .on('mouseleave blur', function () {
                // 세 번째 메뉴명 비활성화
                $(this).closest(selectorDepth.second.list).find(selectorDepth.second.item).removeClass(selectorDepth.current);
            });

        // 두 번째 영역 대 제목에 마우스 이벤트 발생 시 두 번째 영역의 내부 영역, 세 번째 영역 전체 비활성화
        $(selectorDepth.second.inner)
            .find('.tit_offering_depth')
            .on('mouseenter focus', function (event) {
                event.stopPropagation();
                $(this).closest(renewalOffering).find(selectorDepth.second.item).removeClass('current');
                $(this).closest(renewalOffering).find(selectorDepth.third.outer).add(selectorDepth.third.inner).removeClass('active');
            });
    };
 
    _proto.resizeHandler = function() {
        _this.setGnbHeight();
        _this.rnbMenuClose();
        _this.$el.find('.rnb').css('right', getContainerRight() + 'px');
        _this.$el.find('.history').css('right', getContainerRight() + 'px');
        _this.setDefaultSearchBox();
        _this.setHeightRightContainer();
        _this.gnbChildpanelStyle('windowResize');
        _this.gnbItemScrollStyle('windowResize', $('.gnb .hd-cnt .menu > li').find('> .title a'));
 
        if (_this.isMobile) {
            // 모바일로 리사이징될 때 .offering-list에서 .on을 삭제합니다.
            const $wrap = $('.M00_A');
            const $gsnb = $wrap.find(".gsnb:not('.mobile')");
            const $gsnbOfferingMenu = $gsnb.find('li.offering-list');
 
            $gsnbOfferingMenu.removeClass('on');
            _this.setSizeSubmenuMobile();
        } else {
            _this.setSticky();
            _this.closeMobileGsnb();
        }
 
        // detect mobile device
        if (_this.isMobileDevice) {
            $('body').addClass('hid_sm');
        } else {
            $('body').removeClass('hid_sm');
        }
        resizeGsnbDropdownMenu();
    };
 
    /* 210514 | 접근성 | rnb 구조변경 */
    _proto.setRnb = function(id, callback) {
        $('.rnb .depth-main li:not(.no-child) .title.dep1 a').attr('aria-expanded', 'false');
        $('.rnb .depth-main li')
            .removeClass('on')
            .find('.' + id)
            .attr('aria-expanded', 'true')
            .closest('li')
            .addClass('on');
 
        var $current = $('.rnb .depth-main li .depth-sub > *.on'); // *.on
        var $target = $('.rnb .depth-main li.on .depth-sub > *.' + id); // > *. +id
 
        // animate ver
        $current
            .stop()
            .css({ display: 'block', position: 'absolute' })
            .transition({
                    x: $('.depth-sub').outerWidth() + 20 + 'px',
                },
                400,
                'easeInOutQuint',
                function() {
                    $(this).css('display', 'none').removeClass('on');
                    // current 메뉴 초기화
                    $current.find('ul.items li').each(function() {
                        $(this).find('> .title > a').removeClass('on').attr('aria-expanded', 'false');
                        $(this).find('> ul.items').hide();
                    });
                    $current.closest('.depth-sub').css('display', 'none');
                }
            );
 
        $target.closest('.depth-sub').css('display', 'block');
        $target
            .stop()
            .delay(400)
            .css({ display: 'block', position: 'absolute' })
            .transition({
                    x: 0 + 'px',
                },
                400,
                'easeOutQuint',
                function() {
                    $(this).css('position', 'relative').addClass('on').attr('aria-expanded', 'true');
                    if (callback) callback();
                }
            );
 
        /* no animate ver
            $(".rnb .depth-sub > *").each(function(i, el){
                if($(this).hasClass(id)){
                    $(this).css("display", "block");
                }else{
                    $(this).css("display", "none");
                }
            });*/
    };
    /* //210514 | 접근성 | rnb 구조변경 */

    _proto.setHeightRightContainer = function() {
        var etcContainerOffset = $('#header').offset();
        var $historyContainer = $('.gnb .util .history');
        var $rnbContainer = $('.gnb .util .rnb');
        var height;
        if (_this.isMobile) {
            if (_this.isIos()) {
                height = $(window).innerHeight();
 
                $historyContainer.css({
                    height: height + 'px',
                });
 
                $rnbContainer.css({
                    height: height + 'px',
                });
            } else {
                $historyContainer.css({
                    height: '',
                });
 
                $rnbContainer.css({
                    height: '',
                });
            }
        } else {
            var offTop = null;
            if (_this.gnbType == 'main' || _this.gnbType == 'static') {
                offTop = etcContainerOffset.top + _this.$el.height() - 1;
            } else {
                offTop = etcContainerOffset.top + _this.$el.height() - 1 - $('.gsnb:not(.mobile)').height();
            }
 
            if ($('body').hasClass('tail_chk')) {
                offTop = $('.M00_A .gnb').offset().top - $(window).scrollTop() + _this.$el.height();
            }
            $historyContainer.css({
                height: 'calc(100vh - ' + offTop + 'px)',
            });
 
            $rnbContainer.css({
                height: 'calc(100vh - ' + offTop + 'px)',
            });
        }
    };

    _proto.menuClose = function() {
        $(".gnb .hd-cnt .menu > li").removeClass("on cloudMenuOpen").find('> .title > a').attr('aria-selected', 'false');
    };
 
    _proto.subMenuClose = function() {
        if (_this.inFocus) return;
        //220331 | 접근성 | GSNB title 제거
        $('.gsnb li.offering-list').removeClass('on');
        //.find("> .title > a").attr("title", langSet[_this.lang].menuState.activeStr);
    };

    _proto.searchBoxClose = function() {
        if (_this.isMobile) {
            $('.search_box')
                .stop()
                .css({
                    left: $('.search_box').width() + 'px',
                })
                .hide();
        } else {
            $('.search_box')
                .stop()
                .css({
                    left: '0px',
                })
                .hide();
        }
        $('body').removeClass('hid_s');
        $('.hd-etc .btn-search').removeClass('on');
        $('.search_dim').remove();
        $('.search_box form .input').val('');
    };
 
    /* 210514 | 접근성 | rnb 구조변경 */
    _proto.rnbMenuClose = function() {
        var ariahidden = $(
            'footer, #container, #skip_navi, header .gnb > div:not(.hd-etc), header .gnb .hd-etc .util > li:not(li:last-child), header .gsnb, .btn_hamburger'
        ); /* 210527 | 접근성 | rnb aria범위수정 */
        $('.btn_hamburger').removeClass('active').removeAttr('disabled');
        $('.rnb').css('display', 'none');
        $('.rnb > .container')
            .eq(0)
            .stop()
            .css({ right: '-' + $('.rnb > .container').eq(0).width() + 'px' });
        $('body').removeClass('hid_s');
        ariahidden.removeAttr('tabindex');
        ariahidden.removeAttr('aria-hidden');
        _this.setDefaultRnb();
        //220331 | 접근성 | RNB attr 수정
        if (!_this.isMobile) {
            $('.rnb .depth-sub .items.depth2 > li > .title a').removeAttr('title aria-expanded').removeClass('on');
        }
    };
    /* //210514 | 접근성 | rnb 구조변경 */

    _proto.historyMenuClose = function() {
        $('.btn-history').removeClass('on');
        $('.history')
            .removeClass('on')
            .find('.container')
            .stop()
            .css({
                right: -1 * $('.history').width(),
                opacity: 1,
            });
        $('.history').css('display', 'none');
        $('body').removeClass('hid_s');
    };

    /* 210514 | 접근성 | rnb 구조변경 */
    // rnb 초기화
    _proto.setDefaultRnb = function(id) {
        $('.rnb .depth-main li').removeClass('on').eq(0).addClass('on').attr('aria-expanded', 'true');
        $('.rnb .depth-main li').eq(0).find('.depth-sub').css('display', 'block');
 
        var $current = $('.rnb .depth-main li .depth-sub > *.on'); // *.on
        var $target = $('.rnb .depth-main li.on .depth-sub > *').eq(0); // > *. +id
 
        // animate ver
        $current
            .stop()
            .css({ display: 'block', position: 'absolute' })
            .transition({
                    x: $('.depth-sub').outerWidth() + 20 + 'px',
                },
                0,
                'easeInOutQuint',
                function() {
                    $(this).css('display', 'none').removeClass('on');
                    // current 메뉴 초기화
                    $current.find('ul.items li').each(function() {
                        $(this).find('> .title > a').removeClass('on').attr('aria-expanded', 'false');
                        $(this).find('> ul.items').hide();
                    });
                    $current.closest('.depth-sub').css('display', 'none');
                }
            );
        //$('.box').transition({ x: '40px' });
 
        $target.closest('.depth-sub').css('display', 'block');
        $target
            .stop()
            .css({ display: 'block', position: 'absolute' })
            .transition({
                    x: 0 + 'px',
                },
                0,
                'easeOutQuint',
                function() {
                    $(this).css('position', 'relative').addClass('on').attr('aria-expanded', 'true');
                }
            );
    };
    /* //210514 | 접근성 | rnb 구조변경 */

    _proto.closeMobileGsnb = function() {
        $('.gsnb.mobile .inner .owl-carousel').stop().hide();
        _this.subContainers.eq(0).find('.scroll-wrapper .menulist .title a').removeClass('on');
        _this.subContainers.eq(0).find('.scroll-wrapper .menulist ul.items, .scroll-wrapper .menulist .items.renewal').hide();
 
        if (!!_this.carouselItemStatus && _this.carouselItemStatus.item.count > 1) {
            _this.$subMenuCarousel.trigger('to.owl.carousel', 0).trigger('remove.owl.carousel', 1).trigger('refresh.owl.carousel');
        }
 
        $('body').removeClass('hid_s');
        $('.gsnb.mobile .inner > .title > a').removeClass('on');
    };

    _proto.gnbItemScrollStyle = function(eventType, $menuBtn) {
        var $menuWrap = $menuBtn.closest('li');
        var $childpanel = $menuWrap.find('> .childpanel');
        var maxHeight = $(window).height();
        var distance = $('.M00_A .gnb').height();
        var country = $('html').data('country');
        if ($('body').hasClass('tail_chk') && $(window).scrollTop() === 0) {
            distance += $('.tail_wrap').height();
        }
 
        // sds 사업부 전달 높이값
        var sdsMaxHeight = {
            offering: 765,
        };
 
        switch (eventType) {
            case 'windowResize':
                $childpanel = $childpanel.filter('.offering, .smart'); // 오퍼링 메뉴에만 적용(기타 메뉴도 적용시, 해당 라인 삭제)
                maxHeight = $(window).height();
                
 
                if (window.innerWidth <= 1023) return;
                /*
                if(distance + $childpanel.innerHeight() <= maxHeight){
                    $childpanel.data({
                        "hasScroll": false
                    }).css({
                        "height": "inherit",
                        "max-height": $childpanel.innerHeight() + 1,
                        "overflow-y": "none"
                    })
                    break;
                }
                */
                $childpanel
                    .data({
                        hasScroll: true,
                    })
                    .css({
                        height: 'inherit',
                        'max-height': maxHeight - distance,
                        'overflow-y': 'auto',
                    });
                break;
            case 'mouseleave':
            case 'mouseout':
            case 'focusout':
                if (!$childpanel.hasClass('offering') && !$childpanel.hasClass('smart')) break; // 오퍼링 메뉴에만 적용(기타 메뉴도 적용시, 해당 라인 삭제)
 
                if (!$childpanel.length) break; // $childpanel 없는 경우

 
                $childpanel
                    .data({
                        hasScroll: false,
                    })
                    .css({
                        height: 'inherit',
                        'max-height': 'inherit',
                        'overflow-y': 'auto',
                    });
 
                if (!$menuBtn.is(':hover') && !$menuBtn.is(':focus')) break; // $menuBtn 포커스 or 마우스오버가 아닌경우: 이벤트 버블링, 캡쳐 관련
 
                $childpanel
                    .data({
                        hasScroll: false,
                    })
                    .css({
                        height: 'inherit',
                        'max-height': 'inherit',
                        'overflow-y': 'none',
                    });
                break;
            case 'mouseenter':
            case 'mouseover':
            case 'focus':
                if (!$childpanel.hasClass('offering') && !$childpanel.hasClass('smart')) break; // 오퍼링 메뉴에만 적용(기타 메뉴도 적용시, 해당 라인 삭제)
 
                if (!$childpanel.length) break; // $childpanel 없는 경우
                if (!$menuBtn.is(':hover') && !$menuBtn.is(':focus')) break; // $menuBtn 포커스 or 마우스오버가 아닌경우: 이벤트 버블링, 캡쳐 관련
 
                if ($childpanel.data('hasScroll')) break; // 이미 스크롤이 있는경우 mouseover했을때마다로 변경하면서 주석
                
 
                var distance = $('.M00_A .gnb').height();
                if ($('body').hasClass('tail_chk') && $(window).scrollTop() === 0) {
                    distance += $('.tail_wrap').height();
                }
 
                maxHeight = $(window).height(); //< sdsMaxHeight.offering ? $(window).height() : sdsMaxHeight.offering
 
                if (distance + $childpanel.innerHeight() <= maxHeight) {
                    $childpanel
                        .data({
                            hasScroll: false,
                        })
                        .css({
                            height: 'inherit',
                            'max-height': $childpanel.innerHeight() + 1,
                            'overflow-y': 'none',
                        });
                    break;
                }
 
                $childpanel
                    .data({
                        hasScroll: true,
                    })
                    .css({
                        height: maxHeight - distance,
                        'max-height': maxHeight - distance,
                        'overflow-y': 'auto',
                    });
                break;
            default:
                // console.log("plase check event tpye", eventType)
                break;
        }
    };

    _proto.setDefaultSearchBox = function() {
        if (_this.isMobile) {
            /*
            $('.search_box').stop().css({
                'left' : $('.search_box').width() + 'px'
            });
            */
        } else {
            $('.search_box').stop().css({
                left: '0px',
            });
        }
    };

    _proto.setTextByCountry = function() {
        var currentLangSet = langSet[_this.lang];
        // history
        _this.$el.find('.btn-history .blind').text(currentLangSet.history.activeStr);
        _this.$el.find('.hd-etc .history .header .btn-close .blind').text(currentLangSet.history.close);
        _this.$el.find('.hd-etc .history .header > p').text(currentLangSet.history.title);
        _this.$el.find('.hd-etc .history .header > span').text(currentLangSet.history.desc);
        _this.$el.find('.hd-etc .history .header .btn-clear').text(currentLangSet.history.clearall);
 
        // search
        _this.$el.find('.btn-search .blind').text(currentLangSet.search.activeStr);
        _this.$el.find('.hd-etc .search_box .btn-close .blind').text(currentLangSet.search.close);
        _this.$el.find('.hd-etc .search_box form > legend').text(currentLangSet.search.search);
        _this.$el.find('.hd-etc .search_box form label.blind').text(currentLangSet.search.search);
        _this.$el.find('.hd-etc .search_box form .in .input').attr('placeholder', currentLangSet.search.placeholder).attr('title', currentLangSet.search.placeholder);
        _this.$el.find('.hd-etc .search_box form .in .delete .blind').text(currentLangSet.search.clear);
        _this.$el.find('.hd-etc .search_box form .in .sch .blind').text(currentLangSet.search.search);
    };

    _proto.scrollLock = function() {
        $('body').addClass('hid_s');
    };

    _proto.scrollUnlock = function() {
        $('body').removeClass('hid_s');
    };

    _proto.getUrlParams = function() {
        var params = {};
        window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) {
            params[key] = value;
        });
        return params;
    };

    function getContainerRight() {
        var right = Math.floor(($(window).width() - _this.$el.find('> .inner').width()) / 2);
        return right;
    }

    function getCurrentWidth() {
        return window.innerWidth >= $(document).width() ? window.innerWidth : $(document).width();
    }

    function resizeGsnbDropdownMenu(payload) {
        const $window = $(window);
        const $wrap = $('.M00_A');
        const $gnb = $wrap.find('.gnb');
        const $gsnb = $wrap.find(".gsnb:not('.mobile')");
        const $gsnbDropdownMenuWrapper = $gsnb.find('li.offering-list .items.renewal');
        const $gsnbMobile = $wrap.find('.gsnb');
        const $gsnbMobileDropdownMenuWrapper = $gsnbMobile.find('.inner .owl-carousel');
        const positionValue = typeof payload !== 'undefined' && !!payload.position ? payload.position : 'fixed';
        const topValue = typeof payload !== 'undefined' ? payload.top : $gsnb.outerHeight();
 
        // Desktop
        if ($gsnbDropdownMenuWrapper.outerHeight() >= $window.outerHeight() - ($gnb.outerHeight() + $gsnb.outerHeight())) {
            $gsnb.find('li.offering-list .items.renewal').css({
                position: positionValue, // 'fixed'
                top: $gnb.outerHeight() + topValue - 1, // topValue: $gsnb.outerHeight()
                bottom: 0,
            });
        } else {
            $gsnb
                .find('li.offering-list .items.renewal')
                .removeAttr('style')
                .css({
                    top: topValue - 1, // topValue: _$gsnb.outerHeight()
                });
        }
 
        // Mobile
        $gsnbMobileDropdownMenuWrapper.css({
            height: 'calc(100vh - ' + parseInt($wrap.css('top')) + 'px)',
        });
    }

    /** 20241119 fixed_tab : 공통 서브페이지 fixed탭 */
    function fixedTab(){
        let M00_A_head = _this.$el,
            M00_A_innerGnb = M00_A_head.find('.gnb'),
            M00_A_innerGSNB = M00_A_head.find('.gsnb'),
            fixedTabArea = $('.fixed_tab'),
            fixedTabPosition_cont = fixedTabArea.find('.tab_inner');

        if($('body.sc_down').length && fixedTabArea.hasClass('fixed')){
            fixedTabPosition_cont.css("top", (M00_A_head.height() - M00_A_innerGnb.outerHeight())-1)
        } else {
            fixedTabPosition_cont.css("top", M00_A_head.height())
        }
    }
    /** //20241119 fixed_tab : 공통 서브페이지 fixed탭 */

    _proto.getHtmlContent = function(url) {
        var content = '';
        $.ajax({
            url: url,
            method: 'get',
            dataType: 'html',
            async: false,
            success: function(data) {
                content = data;
            },
            error: function(error) {
                console.log('error: ', error);
            }
        });
        return content;
    };
    this.init();
}
//fo.addPlugin(M00_A);


