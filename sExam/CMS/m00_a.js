// ============================================
// GNB 상수 및 설정
// ============================================
const GNB_CONFIG = {
    TIMERS: {
        MENU_CLOSE: 100,
        SUB_MENU_CLOSE: 100,
        RNB_MENU_CLOSE: 100,
        HISTORY_MENU_CLOSE: 100,
        GNB_RESIZE: 100,
        MAIN_TRANSPARENT: 100,
        SCROLL_CHECK: 50
    },
    BREAKPOINTS: {
        MOBILE: 1024,
        TABLET: 768
    },
    PANEL: {
        MAXWIDTH_LEFT: 1398,
        MAXWIDTH_RIGHT: 1568,
        PADDING: 40
    },
    FEATURE: {
        WIDTH: 310,
        PADDING: 26,
        DISTANCE_MIN: 75,
        DISTANCE_MAX: 120
    },
    ANIMATION: {
        DURATION_FAST: 200,
        DURATION_NORMAL: 300,
        DURATION_SLOW: 500,
        EASING: 'easeOutQuint'
    }
};

// ============================================
// 유틸리티 함수
// ============================================
class GnbUtils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static async loadScript(url, attrs = {}) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            Object.entries(attrs).forEach(([key, value]) => {
                script.setAttribute(key, value);
            });
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    static isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    static isIOS() {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    }

    static getCurrentWidth() {
        return Math.max(window.innerWidth, document.documentElement.clientWidth);
    }

    static getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        return Object.fromEntries(params.entries());
    }
}

// ============================================
// API 서비스
// ============================================
class GnbApiService {
    static async fetchData(url, options = {}) {
        try {
            const response = await fetch(url, {
                method: options.method || 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('GNB API Error:', error);
            throw error;
        }
    }

    static async fetchHTML(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            console.error('GNB HTML Fetch Error:', error);
            throw error;
        }
    }
}

// ============================================
// 타이머 관리
// ============================================
class TimerManager {
    constructor() {
        this.timers = new Map();
    }

    create(name, callback, delay) {
        const timer = {
            callback,
            delay,
            timeout: null,
            start: () => {
                this.stop(name);
                timer.timeout = setTimeout(callback, delay);
            },
            stop: () => {
                if (timer.timeout) {
                    clearTimeout(timer.timeout);
                    timer.timeout = null;
                }
            }
        };
        this.timers.set(name, timer);
        return timer;
    }

    start(name) {
        this.timers.get(name)?.start();
    }

    stop(name) {
        this.timers.get(name)?.stop();
    }

    stopAll() {
        this.timers.forEach(timer => timer.stop());
    }

    destroy() {
        this.stopAll();
        this.timers.clear();
    }
}

// ============================================
// YouTube 플레이어 관리
// ============================================
class YouTubePlayerManager {
    constructor() {
        this.players = new Map();
        this.readyStates = new Map();
        this.playerIds = ['gnbYoutube', 'gnbGenYoutube'];
    }

    async init() {
        if (window.YT) {
            this.initializePlayers();
        } else {
            window.onYouTubeIframeAPIReady = () => this.initializePlayers();
            await this.loadAPI();
        }
    }

    async loadAPI() {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    initializePlayers() {
        this.playerIds.forEach(id => {
            const element = document.getElementById(id);
            if (!element) return;

            this.readyStates.set(id, false);
            this.players.set(id, new YT.Player(id, {
                events: {
                    'onReady': () => this.readyStates.set(id, true)
                }
            }));
        });
    }

    stopAll() {
        this.players.forEach((player, id) => {
            if (this.readyStates.get(id) && typeof player.stopVideo === 'function') {
                player.stopVideo();
            }
        });
    }

    stopPlayer(id) {
        const player = this.players.get(id);
        if (this.readyStates.get(id) && player && typeof player.stopVideo === 'function') {
            player.stopVideo();
        }
    }
}

// ============================================
// 메인 GNB 클래스
// ============================================
class GNBController {
    constructor(element) {
        this.$el = $(element);
        this.initializeProperties();
        this.timerManager = new TimerManager();
        this.youtubeManager = new YouTubePlayerManager();
        this.init();
    }

    initializeProperties() {
        this.lang = $('html').attr('lang') || 'en';
        this.country = $('html').attr('data-country') || 'en';
        
        this.state = {
            isMobile: GnbUtils.getCurrentWidth() <= GNB_CONFIG.BREAKPOINTS.MOBILE,
            isMobileDevice: GnbUtils.isMobileDevice(),
            isFocus: false,
            inFocus: false,
            isOfferingMain: false
        };

        this.data = {
            history: true,
            ...this.$el.data()
        };

        this.menuData = null;
        this.menuDataXml = null;
        this.breadData = [];
        this.featureData = null;
        this.offeringData = null;
        this.currentPageType = null;
        this.gnbType = 'main';
        
        this.historyMaxCount = 0;
        this.historyStorageKey = `visitHistory_${this.lang}_${this.country}`;
    }

    async init() {
        try {
            // 타이머 초기화
            this.initializeTimers();

            // 데이터 로드
            await this.loadData();

            // UI 초기화
            this.initializeUI();

            // 이벤트 바인딩
            this.bindEvents();

            // YouTube 플레이어 초기화
            await this.youtubeManager.init();

            // GNB 버전 체크
            this.checkGnbVersion();

        } catch (error) {
            console.error('GNB Initialization Error:', error);
        }
    }

    initializeTimers() {
        const { TIMERS } = GNB_CONFIG;
        
        this.timerManager.create('mainTransparent', () => {
            if (!$('body').hasClass('hid_s') && 
                this.$el.find('.gnb ul.menu > li.on').length === 0) {
                $('.M00_A').removeClass('mc_chk');
            }
        }, TIMERS.MAIN_TRANSPARENT);

        this.timerManager.create('menuClose', () => this.menuClose(), TIMERS.MENU_CLOSE);
        this.timerManager.create('subMenuClose', () => this.subMenuClose(), TIMERS.SUB_MENU_CLOSE);
        this.timerManager.create('rnbMenuClose', () => this.rnbMenuClose(), TIMERS.RNB_MENU_CLOSE);
        this.timerManager.create('historyMenuClose', () => this.historyMenuClose(), TIMERS.HISTORY_MENU_CLOSE);
        this.timerManager.create('gnbResize', () => this.handleResize(), TIMERS.GNB_RESIZE);
    }

    async loadData() {
        const { url, urlFeature } = this.data;
        
        try {
            // 메뉴 데이터 로드
            this.menuData = await GnbApiService.fetchData(url);
            this.setupMenuData();

            // Feature 데이터 로드
            this.featureData = await GnbApiService.fetchHTML(urlFeature);
            
            this.setSticky();
            this.setTextByCountry();
            
        } catch (error) {
            console.error('Data Load Error:', error);
        }
    }

    setupMenuData() {
        this.menuDataXml = $.parseXML(
            OBJtoXML({ root: this.menuData }).replace(/&/g, '&amp;')
        );
        
        this.determineGnbType();
        this.setBreadData();
    }

    determineGnbType() {
        const target = this.menuDataXml.getElementsByTagName('menuId');
        
        for (let i = 0; i < target.length; i++) {
            const idNode = target[i];
            if (idNode.textContent === this.data.current) {
                const type = getChildByNodeName(idNode.parentNode, 'type').textContent;
                this.currentPageType = type;
                
                const mainType = type?.split('_')[0];
                this.gnbType = ['static', 'offering', 'normal'].includes(mainType) 
                    ? mainType 
                    : 'main';
                break;
            }
        }
    }

    initializeUI() {
        this.drawGnb();
        this.setGnbHeight();
        this.setOfferingGnbMh();
    }

    bindEvents() {
        this.bindWindowEvents();
        this.bindGnbEvents();
        this.bindSearchEvents();
        this.bindRnbEvents();
        this.bindHistoryEvents();
        this.bindMobileEvents();
    }

    bindWindowEvents() {
        const debouncedResize = GnbUtils.debounce(() => {
            this.state.isMobile = GnbUtils.getCurrentWidth() <= GNB_CONFIG.BREAKPOINTS.MOBILE;
            this.state.isMobileDevice = GnbUtils.isMobileDevice();
            this.timerManager.start('gnbResize');
        }, 200);

        $(window).on('resize', debouncedResize);

        const throttledScroll = GnbUtils.throttle((e) => {
            this.handleScroll(e);
        }, 16); // ~60fps

        $(window).on('scroll.gnb', throttledScroll);

        $(window).on('load', () => {
            this.gnbChildpanelStyle('windowLoad');
        });
    }

    bindGnbEvents() {
        const $gnbMenu = this.$el.find('.gnb .hd-cnt .menu > li > .title > a');
        
        $gnbMenu.on('mouseenter focus', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            this.timerManager.stop('menuClose');
            
            const $menuItem = $(e.currentTarget).closest('.menu > li:not(.no-child)');
            
            this.$el.find('.gnb .hd-cnt .menu > li:not(.no-child)')
                .removeClass('on')
                .find('> .title > a')
                .attr('aria-selected', 'false');
            
            $menuItem.addClass('on')
                .find('> .title > a')
                .attr('aria-selected', 'true');
            
            this.closeAllMenus();
            
            if (!$menuItem.hasClass('no-child')) {
                $('body').addClass('hid_s');
            }
            
            this.youtubeManager.stopAll();
            this.gnbItemScrollStyle(e.type, $menuItem);
        });

        $gnbMenu.on('mouseleave blur', (e) => {
            this.timerManager.start('menuClose');
            this.gnbItemScrollStyle(e.type, $(e.currentTarget).closest('li'));
        });
    }

    bindSearchEvents() {
        const $searchBtn = this.$el.find('.btn-search');
        const $searchBox = this.$el.find('.search_box');
        const $searchClose = $searchBox.find('.btn-close');
        const $searchInput = $searchBox.find('.input');
        const $deleteBtn = $searchBox.find('.delete');

        $searchBtn.on(this.state.isMobile ? 'click' : 'mouseover focus', (e) => {
            if (this.state.isMobile) {
                e.preventDefault();
            }
            this.openSearchBox();
        });

        $searchBox.on('mouseleave', () => {
            if (!this.state.isMobile) {
                this.searchBoxClose();
            }
        });

        $searchClose.on('click', () => {
            this.searchBoxClose();
        });

        $searchInput.on('keyup', (e) => {
            $deleteBtn.toggle($(e.target).val().length > 0);
        });

        $deleteBtn.on('click', () => {
            $searchInput.val('').focus();
            $deleteBtn.hide();
        });
    }

    bindRnbEvents() {
        const $rnbBtn = this.$el.find('.btn_hamburger');
        const $rnbClose = this.$el.find('.rnb .btn-close');

        $rnbBtn.on('click', (e) => {
            e.preventDefault();
            if ($rnbBtn.attr('disabled')) return;
            
            this.toggleRnb($rnbBtn);
        });

        $rnbClose.on('click', () => {
            $rnbBtn.trigger('click');
        });
    }

    bindHistoryEvents() {
        const $historyBtn = this.$el.find('.btn-history');
        const $historyClose = this.$el.find('.history .btn-close');
        const $clearBtn = this.$el.find('.history .btn-clear');

        $historyBtn.on('click', (e) => {
            e.preventDefault();
            this.openHistory();
        });

        $historyClose.on('click', (e) => {
            e.preventDefault();
            this.historyMenuClose();
        });

        $clearBtn.on('click', (e) => {
            this.clearHistory();
        });
    }

    bindMobileEvents() {
        if (!this.state.isMobile) return;

        const $gsnbMobile = this.$el.find('.gsnb.mobile');
        const $gsnbTitle = $gsnbMobile.find('.inner > .title > a');

        $gsnbTitle.on('click', () => {
            this.toggleMobileGsnb($gsnbTitle);
        });
    }

    // ============================================
    // 메뉴 제어 메서드
    // ============================================
    
    menuClose() {
        this.$el.find('.gnb .hd-cnt .menu > li')
            .removeClass('on')
            .find('> .title > a')
            .attr('aria-selected', 'false');
    }

    subMenuClose() {
        if (this.state.inFocus) return;
        this.$el.find('.gsnb li.offering-list').removeClass('on');
    }

    searchBoxClose() {
        const $searchBox = this.$el.find('.search_box');
        const { DURATION_SLOW } = GNB_CONFIG.ANIMATION;

        if (this.state.isMobile) {
            $searchBox.animate(
                { left: $searchBox.width() },
                DURATION_SLOW,
                'easeOutQuint',
                () => {
                    $searchBox.hide();
                    this.cleanupSearchBox();
                }
            );
        } else {
            $searchBox.hide();
            this.cleanupSearchBox();
        }

        this.$el.find('.btn-search').removeClass('on');
        this.$el.find('.search_dim').remove();
    }

    cleanupSearchBox() {
        $('body').removeClass('hid_s');
        this.$el.find('.search_box form .input').val('');
        this.$el.find('.search_box form .delete').hide();
    }

    rnbMenuClose() {
        this.$el.find('.btn_hamburger')
            .removeClass('active')
            .removeAttr('disabled');
        
        this.$el.find('.rnb').css('display', 'none');
        this.$el.find('.rnb > .container')
            .css({ right: `-${this.$el.find('.rnb > .container').width()}px` });
        
        $('body').removeClass('hid_s');
        this.setDefaultRnb();
    }

    historyMenuClose() {
        this.$el.find('.btn-history').removeClass('on');
        this.$el.find('.history')
            .removeClass('on')
            .find('.container')
            .css({
                right: -this.$el.find('.history').width(),
                opacity: 1
            });
        this.$el.find('.history').css('display', 'none');
        $('body').removeClass('hid_s');
    }

    closeAllMenus() {
        this.rnbMenuClose();
        this.searchBoxClose();
        this.historyMenuClose();
    }

    // ============================================
    // 스크롤 핸들러
    // ============================================
    
    handleScroll(e) {
        if (e.target !== document || $('body').hasClass('hid_s')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        this.updateScrollState();
        this.updateGnbPosition();
    }

    updateScrollState() {
        const scroll = $(window).scrollTop();
        const $wrap = $('#wrap');

        if (scroll > 0) {
            $wrap.removeClass('scroll_chk');
        } else {
            $wrap.addClass('scroll_chk');
        }
    }

    updateGnbPosition() {
        const scroll = $(window).scrollTop();
        const $gnb = this.$el;
        const hasTailBox = $('body').hasClass('tail_chk') && !this.state.isMobile;
        const tailHeight = hasTailBox ? $('.tail_wrap').height() : 0;

        const offset = scroll > $('#header').offset().top 
            ? (scroll > 60 ? -($('.gnb').height() + 1 + tailHeight) : 0)
            : $('#header').offset().top - scroll - tailHeight;

        $gnb.css({
            transition: hasTailBox ? 'top 0.2s' : '',
            top: `${offset}px`,
            position: 'fixed'
        });
    }

    // ============================================
    // 리사이즈 핸들러
    // ============================================
    
    handleResize() {
        this.setGnbHeight();
        this.rnbMenuClose();
        this.setDefaultSearchBox();
        this.setHeightRightContainer();
        this.gnbChildpanelStyle('windowResize');

        if (this.state.isMobile) {
            this.setSizeSubmenuMobile();
            this.$el.find('.gsnb:not(.mobile) li.offering-list').removeClass('on');
        } else {
            this.setSticky();
            this.closeMobileGsnb();
        }

        $('body').toggleClass('hid_sm', this.state.isMobileDevice);
    }

    // ============================================
    // 유틸리티 메서드
    // ============================================
    
    setGnbHeight() {
        let height;
        
        switch (this.gnbType) {
            case 'offering':
                height = this.state.isOfferingMain 
                    ? this.$el.height()
                    : this.$el.height() + ($('.brandcolor').is(':visible') ? $('.brandcolor').height() : 0);
                break;
            case 'normal':
            case 'static':
                height = this.$el.height();
                break;
        }

        if (this.gnbType !== 'main' && height) {
            $('#header').css({ height: `${height}px` });
        }

        height = height || $('#header').height();
        document.documentElement.style.setProperty('--headerH', `${height}px`);
    }

    setSticky() {
        this.setGnbHeight();

        this.$el.css({
            position: 'fixed',
            width: '100%',
            'z-index': '7000'
        });

        this.updateGnbPosition();
        this.updateScrollState();
    }

    checkGnbVersion() {
        const reUrl = window.location.href;
        const portNums = [':7000/', ':8001/', ':8002/'];
        const mainUrl = 'samsungsds.com/';
        const excludeCountrys = ['cn'];

        const matchUrl = portNums.some(portNum => reUrl.includes(portNum));
        const isExcludedCountry = excludeCountrys.some(country => 
            reUrl.includes(mainUrl + country)
        );

        if (matchUrl || !isExcludedCountry) {
            $('.gnb').addClass('gnb_ver2024 ver2024_2');
        }
    }

    // ============================================
    // 정리
    // ============================================
    
    destroy() {
        this.timerManager.destroy();
        $(window).off('resize scroll.gnb load');
        this.$el.off();
    }
}

// ============================================
// 초기화
// ============================================
$(document).ready(() => {
    const $gnbElement = $('.M00_A');
    if ($gnbElement.length) {
        window.gnbController = new GNBController($gnbElement);
    }
});