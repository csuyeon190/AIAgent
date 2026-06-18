/**
 * GNB Renderer - gnb.json → HTML GNB 자동 생성
 * Samsung SDS 스타일 메가 드롭다운 GNB
 * (module.js 스타일의 Legacy 프로토타입 & jQuery 버전)
 */

function GNBRenderer(options) {
    _proto = GNBRenderer.prototype;
    _this = this;

    options = options || {};
    this.jsonUrl = options.jsonUrl || '/kr/gnb/gnb.json';
    this.containerId = options.containerId || 'header';
    this.currentMenuId = options.currentMenuId || null;
    this.menuData = null;
    this.overlay = null;

    _proto.init = function() {
        $.ajax({
            url: _this.jsonUrl,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                _this.menuData = data;
                _this.render();
                _this.bindEvents();
            },
            error: function(xhr, status, err) {
                console.error('[GNB] 초기화 실패:', err);
            }
        });
    };

    _proto.render = function() {
        var $container = $('#' + _this.containerId);
        if (!$container.length) return;
        $container.html(_this.buildHeaderHTML());
    };

    _proto.buildHeaderHTML = function() {
        return `
          <nav id="gnb" class="gnb-inner" role="navigation" aria-label="메인 내비게이션">
            <a href="/kr/index.html" class="gnb-logo" aria-label="Samsung SDS 홈">
              <span class="gnb-logo-text">SAMSUNG <span>SDS</span></span>
            </a>
            <ul class="gnb-menu gnb-nav" role="menubar" aria-label="메인 메뉴">
              ${_this.buildMenuItems()}
            </ul>
            <button class="gnb-hamburger" id="gnbHamburger" aria-label="전체 메뉴 열기" aria-expanded="false" aria-controls="gnbMobilePanel">
              <span></span><span></span><span></span>
            </button>
          </nav>
          <div class="gnb-overlay" id="gnbOverlay" aria-hidden="true"></div>
          ${_this.buildMobilePanel()}
        `;
    };

    /* ── DEPTH1 메뉴 아이템 순회 ── */
    _proto.buildMenuItems = function() {
        if (!_this.menuData) return '';
        return Object.values(_this.menuData)
          .flat()
          .map(function(item) {
              return _this.buildDepth1Item(item);
          })
          .join('');
    };

    _proto.buildDepth1Item = function(item) {
        const label = item.gnb_title || item.title;
        const hasChild = item.items && item.items.length > 0;
        const isNoChild = item.panelType === 'no-child' || !hasChild;

        const linkAttrs = isNoChild
          ? `href="${item.url || '#'}" target="${item.target || '_self'}" role="menuitem"`
          : `href="javascript:void(0)" role="menuitem" aria-haspopup="true" aria-expanded="false"`;

        return `
          <li class="gnb-menu-item${isNoChild ? ' no-child' : ''}" data-menu-id="${item.menuId}" role="none">
            <a class="gnb-depth1-link" ${linkAttrs}>${label}</a>
            ${!isNoChild ? _this.buildChildPanel(item) : ''}
          </li>`;
    };

    /* ── CHILDPANEL 분기: offering / normal ── */
    _proto.buildChildPanel = function(item) {
        const style = item.style || '';
        const panelType = item.panelType || '';

        if (panelType === 'offering') {
            return `
              <div class="gnb-childpanel ${style}" role="region" aria-label="${item.title} 하위 메뉴">
                <div class="gnb-childpanel-inner">
                  ${_this.buildOfferingPanel(item)}
                </div>
              </div>`;
        }

        if (panelType === 'normal') {
            return `
              <div class="gnb-childpanel ${style}" role="region" aria-label="${item.title} 하위 메뉴">
                <div class="gnb-childpanel-inner">
                  ${_this.buildNormalPanel(item)}
                </div>
              </div>`;
        }

        return '';
    };

    /* ── offering 패널: 좌측 헤더 + 우측 컬럼 ── */
    _proto.buildOfferingPanel = function(d1Item) {
        const offeringMain = d1Item.items?.[0];
        if (!offeringMain) return '';

        const cates = offeringMain.items || [];

        let cols = '';
        cates.forEach(function(cate) {
          const subs = cate.items || [];
          subs.forEach(function(sub) {
            cols += _this.buildOfferingCol(sub);
          });
        });

        const headerLink = offeringMain.url && offeringMain.url !== 'javascript:void(0)'
          ? `<a href="${offeringMain.url}" class="gnb-offering-header-link" target="${offeringMain.target || '_self'}">전체 보기</a>`
          : '';

        return `
          <div class="gnb-offering-header">
            <div class="gnb-offering-header-title">${offeringMain.title}</div>
            ${headerLink}
          </div>
          <div class="gnb-offering-cols">
            ${cols}
          </div>`;
    };

    _proto.buildOfferingCol = function(sub) {
        const groups = sub.items || [];
        let groupsHTML = '';

        groups.forEach(function(group) {
          const items = group.items || [];
          const itemsHTML = items.map(function(it) {
              return `
                <li role="none">
                  <a href="${it.url || '#'}" class="gnb-item-link" role="menuitem"
                    target="${it.target || '_self'}">${it.title}</a>
                </li>`;
          }).join('');

          groupsHTML += `
            <div class="gnb-item-group">
              <div class="gnb-item-group-title">${group.title}</div>
              <ul class="gnb-item-list" role="menu" aria-label="${group.title}">
                ${itemsHTML}
              </ul>
            </div>`;
        });

        return `
          <div class="gnb-col">
            <div class="gnb-sub-section">
              <div class="gnb-sub-title">${sub.title}</div>
              ${groupsHTML}
            </div>
          </div>`;
    };

    /* ── normal 패널: 카테고리별 링크 목록 ── */
    _proto.buildNormalPanel = function(d1Item) {
        const normalMain = d1Item.items?.[0];
        if (!normalMain) return '';

        const cates = normalMain.items || [];
        return cates.map(function(cate) {
          const items = cate.items || [];
          const itemsHTML = items.map(function(it) {
              return `
                <li role="none">
                  <a href="${it.url || '#'}" class="gnb-normal-link" role="menuitem"
                    target="${it.target || '_self'}">${it.title}</a>
                </li>`;
          }).join('');

          return `
            <div class="gnb-normal-group">
              <div class="gnb-normal-title">${cate.title}</div>
              <ul class="gnb-normal-list" role="menu" aria-label="${cate.title}">
                ${itemsHTML}
              </ul>
            </div>`;
        }).join('');
    };

    /* ── 모바일 패널 ── */
    _proto.buildMobilePanel = function() {
        if (!_this.menuData) return '';
        const items = Object.values(_this.menuData).flat();

        const mobileItems = items.map(function(item) {
          const label = item.gnb_title || item.title;
          const hasChild = item.items && item.items.length > 0;

          if (!hasChild || item.panelType === 'no-child') {
            return `
              <li class="gnb-mobile-item no-child">
                <a href="${item.url || '#'}" class="gnb-mobile-depth1" target="${item.target || '_self'}">${label}</a>
              </li>`;
          }

          const subLinks = _this.getMobileSubLinks(item);
          return `
            <li class="gnb-mobile-item">
              <button class="gnb-mobile-depth1" aria-expanded="false">
                ${label}<span class="arrow">▼</span>
              </button>
              <ul class="gnb-mobile-sub">
                ${subLinks}
              </ul>
            </li>`;
        }).join('');

        return `
          <div class="gnb-mobile-panel" id="gnbMobilePanel" aria-label="모바일 메뉴">
            <ul class="gnb-mobile-menu">
              ${mobileItems}
            </ul>
          </div>`;
    };

    _proto.getMobileSubLinks = function(d1Item) {
        const panelType = d1Item.panelType;
        const links = [];

        if (panelType === 'offering') {
          const offeringMain = d1Item.items?.[0];
          if (offeringMain?.url && offeringMain.url !== 'javascript:void(0)') {
            links.push(`<li><a href="${offeringMain.url}" class="gnb-mobile-sub-link gnb-mobile-overview">${offeringMain.title} 전체보기</a></li>`);
          }
          const cates = offeringMain?.items || [];
          cates.forEach(function(cate) {
            (cate.items || []).forEach(function(sub) {
              (sub.items || []).forEach(function(group) {
                links.push(`<li class="gnb-mobile-group"><div class="gnb-mobile-group-title">${group.title}</div></li>`);
                (group.items || []).forEach(function(it) {
                  links.push(`<li><a href="${it.url || '#'}" class="gnb-mobile-sub-link">${it.title}</a></li>`);
                });
              });
            });
          });
        } else if (panelType === 'normal') {
          const normalMain = d1Item.items?.[0];
          (normalMain?.items || []).forEach(function(cate) {
            (cate.items || []).forEach(function(it) {
              links.push(`<li><a href="${it.url || '#'}" class="gnb-mobile-sub-link">${it.title}</a></li>`);
            });
          });
        }

        return links.join('');
    };

    /* ── 이벤트 바인딩 ── */
    _proto.bindEvents = function() {
        _this.overlay = $('#gnbOverlay');

        /* 데스크톱: hover로 패널 열기 */
        $('.gnb-menu-item:not(.no-child)').on('mouseenter', function() {
            _this.openPanel(this);
        }).on('mouseleave', function() {
            _this.closePanel(this);
        });

        /* 오버레이 닫기 */
        if (_this.overlay.length) {
            _this.overlay.on('click', function() {
                _this.closeAll();
            });
        }

        /* 키보드 접근성 */
        $('.gnb-depth1-link').on('focus', function(e) {
            const $li = $(e.target).closest('.gnb-menu-item');
            if ($li.length && !$li.hasClass('no-child')) {
                _this.closeAllPanels();
                _this.openPanel($li[0]);
            }
        });

        $(document).on('keydown', function(e) {
            if (e.key === 'Escape') _this.closeAll();
        });

        /* 모바일 햄버거 */
        const $hamburger = $('#gnbHamburger');
        const $mobilePanel = $('#gnbMobilePanel');
        if ($hamburger.length && $mobilePanel.length) {
            $hamburger.on('click', function() {
                const isOpen = $mobilePanel.toggleClass('is-open').hasClass('is-open');
                $hamburger.attr('aria-expanded', isOpen);
                $hamburger.toggleClass('is-active', isOpen);
            });
        }

        /* 모바일 아코디언 */
        $('.gnb-mobile-item:not(.no-child) .gnb-mobile-depth1').on('click', function() {
            const $btn = $(this);
            const $li = $btn.closest('.gnb-mobile-item');
            const isOpen = $li.toggleClass('is-open').hasClass('is-open');
            $btn.attr('aria-expanded', isOpen);
        });
    };

    _proto.openPanel = function(li) {
        const $li = $(li);
        $li.addClass('is-open');
        const $link = $li.find('.gnb-depth1-link');
        if ($link.length) $link.attr('aria-expanded', 'true');
        if (_this.overlay && _this.overlay.length) _this.overlay.addClass('is-visible');
    };

    _proto.closePanel = function(li) {
        const $li = $(li);
        $li.removeClass('is-open');
        const $link = $li.find('.gnb-depth1-link');
        if ($link.length) $link.attr('aria-expanded', 'false');
        if (!$('.gnb-menu-item.is-open').length) {
            if (_this.overlay && _this.overlay.length) _this.overlay.removeClass('is-visible');
        }
    };

    _proto.closeAllPanels = function() {
        $('.gnb-menu-item.is-open').each(function() {
            _this.closePanel(this);
        });
    };

    _proto.closeAll = function() {
        _this.closeAllPanels();
        if (_this.overlay && _this.overlay.length) _this.overlay.removeClass('is-visible');
    };
}

/* 외부 공개 */
window.GNBRenderer = GNBRenderer;
