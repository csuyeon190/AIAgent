// ============================================
// 추적 스크립트 통합 관리
// ============================================

(function() {
  'use strict';

  // 유틸리티 함수들
  const utils = {
    // 쿼리스트링 파싱
    getQueryParams: function() {
      const params = new URLSearchParams(window.location.search);
      return Object.fromEntries(params.entries());
    },

    // 스크립트 동적 로드 (Promise 기반)
    loadScript: function(src, attrs = {}) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        
        Object.entries(attrs).forEach(([key, value]) => {
          script.setAttribute(key, value);
        });
        
        script.onload = resolve;
        script.onerror = reject;
        
        document.head.appendChild(script);
      });
    },

    // 인라인 스크립트 생성
    createInlineScript: function(content, id = null) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      if (id) script.id = id;
      script.textContent = content;
      document.head.appendChild(script);
    }
  };

  // ============================================
  // 1. Google Tag Manager (중복 제거 및 통합)
  // ============================================
  const GTM_IDS = [
    'GTM-MQTQVFG',
    'GTM-MNV3JTM',
    'GTM-MZ477XW',
    'GTM-WZHFPVB',
    'GTM-PVPN5KJ',
    'GTM-M3VLVQVW'  // 캠페인셀용
  ];

  function initGTM() {
    window.dataLayer = window.dataLayer || [];
    
    GTM_IDS.forEach(id => {
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
      });
      
      utils.loadScript(
        `https://www.googletagmanager.com/gtm.js?id=${id}`,
        { async: true }
      ).catch(err => console.warn(`GTM ${id} 로드 실패:`, err));
    });
  }

  // ============================================
  // 2. Google Ads
  // ============================================
  function initGoogleAds() {
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', 'AW-347263598');
    
    utils.loadScript('https://www.googletagmanager.com/gtag/js?id=AW-347263598')
      .catch(err => console.warn('Google Ads 로드 실패:', err));
  }

  // ============================================
  // 3. Eloqua 추적
  // ============================================
  function initEloqua() {
    window._elqQ = window._elqQ || [];
    _elqQ.push(['elqSetSiteId', '73756918']);
    _elqQ.push(['elqUseFirstPartyCookie', 'tracking.mkt-email.samsungsds.com']);
    _elqQ.push(['elqTrackPageView']);
    _elqQ.push(['elqTrackPageView', window.location.href]);

    utils.loadScript('//img07.en25.com/i/elqCfg.min.js')
      .catch(err => console.warn('Eloqua 로드 실패:', err));
  }

  // ============================================
  // 4. Facebook SDK & Pixel
  // ============================================
  function initFacebook() {
    // SDK 초기화
    window.fbAsyncInit = function() {
      FB.init({
        appId: '590465677825056',
        xfbml: true,
        version: 'v2.8'
      });
    };

    utils.loadScript('//connect.facebook.net/en_US/sdk.js', { id: 'facebook-jssdk' })
      .catch(err => console.warn('Facebook SDK 로드 실패:', err));

    // Meta Pixel
    !function(f,b,e,v,n,t,s) {
      if(f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments);
      };
      if(!f._fbq) f._fbq = n;
      n.push = n; n.loaded = true; n.version = '2.0';
      n.queue = [];
      t = b.createElement(e); t.async = true;
      t.src = v; s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    
    fbq('init', '2280020175855929');
    fbq('track', 'PageView');
  }

  // ============================================
  // 5. Naver 전환 추적 (jQuery 의존성 제거)
  // ============================================
  function initNaver() {
    utils.loadScript('//wcs.naver.net/wcslog.js')
      .then(() => {
        const _nasa = {};
        const currentUrl = window.location.href;

        // 전환 설정
        if (currentUrl.indexOf('#utm_source=scp_event') !== -1) {
          if (window.wcs) {
            _nasa['cnv'] = window.wcs.cnv('1', '10');
          }
        } else if (currentUrl.indexOf('/kr/etc/complete/thank/thankyou.html') !== -1) {
          if (window.wcs) {
            _nasa['cnv'] = window.wcs.cnv('4', '0');
            
            window.wcs_add = { wa: 's_2e8562c63416' };
            const _conv = { type: 'lead' };
            wcs.trans(_conv);
          }
        }

        // GFA 스크립트 설정
        window.wcs_add = window.wcs_add || {};
        window.wcs_add['wa'] = 's_2e8562c63416';

        if (window.wcs) {
          wcs.inflow('samsungsds.com/kr/');
          wcs_do(_nasa);
        }
      })
      .catch(err => console.warn('Naver 추적 로드 실패:', err));
  }

  // ============================================
  // 6. VWO (A/B 테스팅)
  // ============================================
  function initVWO() {
    const linkVwo = document.createElement('link');
    linkVwo.rel = 'preconnect';
    linkVwo.href = 'https://dev.visualwebsiteoptimizer.com';
    document.head.appendChild(linkVwo);

    const vwoCode = `
      window._vwo_code || (function() {
        var account_id=851228,version=2.0,settings_tolerance=2000,
        hide_element='body',hide_element_style='opacity:0 !important;filter:alpha(opacity=0) !important;background:none !important',
        f=false,w=window,d=document,v=d.querySelector('#vwoCode'),cK='_vwo_'+account_id+'_settings',cc={};
        try{var c=JSON.parse(localStorage.getItem('_vwo_'+account_id+'_config'));cc=c&&typeof c==='object'?c:{}}catch(e){}
        var stT=cc.stT==='session'?w.sessionStorage:w.localStorage;
        code={use_existing_jquery:function(){return typeof use_existing_jquery!=='undefined'?use_existing_jquery:undefined},
        library_tolerance:function(){return typeof library_tolerance!=='undefined'?library_tolerance:undefined},
        settings_tolerance:function(){return cc.sT||settings_tolerance},
        hide_element_style:function(){return'{'+(cc.hES||hide_element_style)+'}'},
        hide_element:function(){return typeof cc.hE==='string'?cc.hE:hide_element},
        getVersion:function(){return version},
        finish:function(){if(!f){f=true;var e=d.getElementById('_vis_opt_path_hides');if(e)e.parentNode.removeChild(e)}},
        finished:function(){return f},
        load:function(e){var t=this.getSettings(),n=d.createElement('script'),i=this;if(t){n.textContent=t;d.getElementsByTagName('head')[0].appendChild(n);
        if(!w.VWO||VWO.caE){stT.removeItem(cK);i.load(e)}}else{n.fetchPriority='high';n.src=e;n.type='text/javascript';
        n.onerror=function(){_vwo_code.finish()};d.getElementsByTagName('head')[0].appendChild(n)}},
        getSettings:function(){try{var e=stT.getItem(cK);if(!e){return}e=JSON.parse(e);if(Date.now()>e.e){stT.removeItem(cK);return}return e.s}catch(e){return}},
        init:function(){if(d.URL.indexOf('__vwo_disable__')>-1)return;var e=this.settings_tolerance();
        w._vwo_settings_timer=setTimeout(function(){_vwo_code.finish();stT.removeItem(cK)},e);
        var t=d.currentScript,n=d.createElement('style'),i=this.hide_element(),r=t&&!t.async&&i?i+this.hide_element_style():'',c=d.getElementsByTagName('head')[0];
        n.setAttribute('id','_vis_opt_path_hides');v&&n.setAttribute('nonce',v.nonce);n.setAttribute('type','text/css');
        if(n.styleSheet)n.styleSheet.cssText=r;else n.appendChild(d.createTextNode(r));c.appendChild(n);
        this.load('https://dev.visualwebsiteoptimizer.com/j.php?a='+account_id+'&u='+encodeURIComponent(d.URL)+'&vn='+version)}};
        w._vwo_code=code;code.init();
      })();
    `;
    
    utils.createInlineScript(vwoCode, 'vwoCode');
  }

  // ============================================
  // 7. LinkedIn Insight Tag
  // ============================================
  function initLinkedIn() {
    window._linkedin_partner_id = '6966740';
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push('6966740');

    if (!window.lintrk) {
      window.lintrk = function(a, b) { 
        window.lintrk.q.push([a, b]); 
      };
      window.lintrk.q = [];
    }

    utils.loadScript('https://snap.licdn.com/li.lms-analytics/insight.min.js')
      .catch(err => console.warn('LinkedIn 로드 실패:', err));
  }

  // ============================================
  // 8. Ahrefs Analytics
  // ============================================
  function initAhrefs() {
    utils.loadScript('https://analytics.ahrefs.com/analytics.js', {
      'data-key': 'USlPQ1kjrorORAE4D7vP/w',
      async: true
    }).catch(err => console.warn('Ahrefs 로드 실패:', err));
  }

  // ============================================
  // 초기화 함수 (우선순위별 로딩)
  // ============================================
  function initTracking() {
    // 즉시 실행 (Critical)
    initGTM();
    initGoogleAds();

    // DOM 로드 후 실행 (High Priority)
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        initFacebook();
        initNaver();
        initEloqua();
      });
    } else {
      initFacebook();
      initNaver();
      initEloqua();
    }

    // 지연 로드 (Low Priority - 성능 최적화)
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        initVWO();
        initLinkedIn();
        initAhrefs();
      }, { timeout: 3000 });
    } else {
      setTimeout(() => {
        initVWO();
        initLinkedIn();
        initAhrefs();
      }, 3000);
    }
  }

  // 초기화 실행
  initTracking();

})();