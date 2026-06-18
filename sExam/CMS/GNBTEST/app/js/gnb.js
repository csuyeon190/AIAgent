/**
 * GNB Renderer - gnb.json → HTML GNB 자동 생성
 * Samsung SDS 스타일 메가 드롭다운 GNB
 */

class GNBRenderer {
  constructor(options = {}) {
    this.jsonUrl = options.jsonUrl || '/kr/gnb/gnb.json';
    this.containerId = options.containerId || 'header';
    this.currentMenuId = options.currentMenuId || null;
    this.menuData = null;
    this.overlay = null;
  }

  async init() {
    try {
      const res = await fetch(this.jsonUrl);
      if (!res.ok) throw new Error(`GNB JSON fetch failed: ${res.status}`);
      this.menuData = await res.json();
      this.render();
      this.bindEvents();
    } catch (e) {
      console.error('[GNB] 초기화 실패:', e);
    }
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;
    container.innerHTML = this.buildHeaderHTML();
  }

  buildHeaderHTML() {
    return `
      <nav id="gnb" class="gnb-inner" role="navigation" aria-label="메인 내비게이션">
        <a href="/kr/index.html" class="gnb-logo" aria-label="Samsung SDS 홈">
          <span class="gnb-logo-text">SAMSUNG <span>SDS</span></span>
        </a>
        <ul class="gnb-menu gnb-nav" role="menubar" aria-label="메인 메뉴">
          ${this.buildMenuItems()}
        </ul>
        <button class="gnb-hamburger" id="gnbHamburger" aria-label="전체 메뉴 열기" aria-expanded="false" aria-controls="gnbMobilePanel">
          <span></span><span></span><span></span>
        </button>
      </nav>
      <div class="gnb-overlay" id="gnbOverlay" aria-hidden="true"></div>
      ${this.buildMobilePanel()}
    `;
  }

  /* ── DEPTH1 메뉴 아이템 순회 ── */
  buildMenuItems() {
    if (!this.menuData) return '';
    return Object.values(this.menuData)
      .flat()
      .map(item => this.buildDepth1Item(item))
      .join('');
  }

  buildDepth1Item(item) {
    const label = item.gnb_title || item.title;
    const hasChild = item.items && item.items.length > 0;
    const isNoChild = item.panelType === 'no-child' || !hasChild;

    const linkAttrs = isNoChild
      ? `href="${item.url || '#'}" target="${item.target || '_self'}" role="menuitem"`
      : `href="javascript:void(0)" role="menuitem" aria-haspopup="true" aria-expanded="false"`;

    return `
      <li class="gnb-menu-item${isNoChild ? ' no-child' : ''}" data-menu-id="${item.menuId}" role="none">
        <a class="gnb-depth1-link" ${linkAttrs}>${label}</a>
        ${!isNoChild ? this.buildChildPanel(item) : ''}
      </li>`;
  }

  /* ── CHILDPANEL 분기: offering / normal ── */
  buildChildPanel(item) {
    const style = item.style || '';
    const panelType = item.panelType || '';

    if (panelType === 'offering') {
      return `
        <div class="gnb-childpanel ${style}" role="region" aria-label="${item.title} 하위 메뉴">
          <div class="gnb-childpanel-inner">
            ${this.buildOfferingPanel(item)}
          </div>
        </div>`;
    }

    if (panelType === 'normal') {
      return `
        <div class="gnb-childpanel ${style}" role="region" aria-label="${item.title} 하위 메뉴">
          <div class="gnb-childpanel-inner">
            ${this.buildNormalPanel(item)}
          </div>
        </div>`;
    }

    return '';
  }

  /* ── offering 패널: 좌측 헤더 + 우측 컬럼 ── */
  buildOfferingPanel(d1Item) {
    const offeringMain = d1Item.items?.[0];
    if (!offeringMain) return '';

    const cates = offeringMain.items || [];

    let cols = '';
    cates.forEach(cate => {
      const subs = cate.items || [];
      subs.forEach(sub => {
        cols += this.buildOfferingCol(sub);
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
  }

  buildOfferingCol(sub) {
    const groups = sub.items || [];
    let groupsHTML = '';

    groups.forEach(group => {
      const items = group.items || [];
      const itemsHTML = items.map(it => `
        <li role="none">
          <a href="${it.url || '#'}" class="gnb-item-link" role="menuitem"
            target="${it.target || '_self'}">${it.title}</a>
        </li>`).join('');

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
  }

  /* ── normal 패널: 카테고리별 링크 목록 ── */
  buildNormalPanel(d1Item) {
    const normalMain = d1Item.items?.[0];
    if (!normalMain) return '';

    const cates = normalMain.items || [];
    return cates.map(cate => {
      const items = cate.items || [];
      const itemsHTML = items.map(it => `
        <li role="none">
          <a href="${it.url || '#'}" class="gnb-normal-link" role="menuitem"
            target="${it.target || '_self'}">${it.title}</a>
        </li>`).join('');

      return `
        <div class="gnb-normal-group">
          <div class="gnb-normal-title">${cate.title}</div>
          <ul class="gnb-normal-list" role="menu" aria-label="${cate.title}">
            ${itemsHTML}
          </ul>
        </div>`;
    }).join('');
  }

  /* ── 모바일 패널 ── */
  buildMobilePanel() {
    if (!this.menuData) return '';
    const items = Object.values(this.menuData).flat();

    const mobileItems = items.map(item => {
      const label = item.gnb_title || item.title;
      const hasChild = item.items && item.items.length > 0;

      if (!hasChild || item.panelType === 'no-child') {
        return `
          <li class="gnb-mobile-item no-child">
            <a href="${item.url || '#'}" class="gnb-mobile-depth1" target="${item.target || '_self'}">${label}</a>
          </li>`;
      }

      const subLinks = this.getMobileSubLinks(item);
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
  }

  getMobileSubLinks(d1Item) {
    const panelType = d1Item.panelType;
    const links = [];

    if (panelType === 'offering') {
      const offeringMain = d1Item.items?.[0];
      if (offeringMain?.url && offeringMain.url !== 'javascript:void(0)') {
        links.push(`<li><a href="${offeringMain.url}" class="gnb-mobile-sub-link gnb-mobile-overview">${offeringMain.title} 전체보기</a></li>`);
      }
      const cates = offeringMain?.items || [];
      cates.forEach(cate => {
        (cate.items || []).forEach(sub => {
          (sub.items || []).forEach(group => {
            links.push(`<li class="gnb-mobile-group"><div class="gnb-mobile-group-title">${group.title}</div></li>`);
            (group.items || []).forEach(it => {
              links.push(`<li><a href="${it.url || '#'}" class="gnb-mobile-sub-link">${it.title}</a></li>`);
            });
          });
        });
      });
    } else if (panelType === 'normal') {
      const normalMain = d1Item.items?.[0];
      (normalMain?.items || []).forEach(cate => {
        (cate.items || []).forEach(it => {
          links.push(`<li><a href="${it.url || '#'}" class="gnb-mobile-sub-link">${it.title}</a></li>`);
        });
      });
    }

    return links.join('');
  }

  /* ── 이벤트 바인딩 ── */
  bindEvents() {
    this.overlay = document.getElementById('gnbOverlay');

    /* 데스크톱: hover로 패널 열기 */
    document.querySelectorAll('.gnb-menu-item:not(.no-child)').forEach(li => {
      li.addEventListener('mouseenter', () => this.openPanel(li));
      li.addEventListener('mouseleave', () => this.closePanel(li));
    });

    /* 오버레이 닫기 */
    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.closeAll());
    }

    /* 키보드 접근성 */
    document.querySelectorAll('.gnb-depth1-link').forEach(link => {
      link.addEventListener('focus', (e) => {
        const li = e.target.closest('.gnb-menu-item');
        if (li && !li.classList.contains('no-child')) {
          this.closeAllPanels();
          this.openPanel(li);
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeAll();
    });

    /* 모바일 햄버거 */
    const hamburger = document.getElementById('gnbHamburger');
    const mobilePanel = document.getElementById('gnbMobilePanel');
    if (hamburger && mobilePanel) {
      hamburger.addEventListener('click', () => {
        const isOpen = mobilePanel.classList.toggle('is-open');
        hamburger.setAttribute('aria-expanded', isOpen);
        hamburger.classList.toggle('is-active', isOpen);
      });
    }

    /* 모바일 아코디언 */
    document.querySelectorAll('.gnb-mobile-item:not(.no-child) .gnb-mobile-depth1').forEach(btn => {
      btn.addEventListener('click', () => {
        const li = btn.closest('.gnb-mobile-item');
        const isOpen = li.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', isOpen);
      });
    });
  }

  openPanel(li) {
    li.classList.add('is-open');
    const link = li.querySelector('.gnb-depth1-link');
    if (link) link.setAttribute('aria-expanded', 'true');
    if (this.overlay) this.overlay.classList.add('is-visible');
  }

  closePanel(li) {
    li.classList.remove('is-open');
    const link = li.querySelector('.gnb-depth1-link');
    if (link) link.setAttribute('aria-expanded', 'false');
    if (!document.querySelector('.gnb-menu-item.is-open')) {
      if (this.overlay) this.overlay.classList.remove('is-visible');
    }
  }

  closeAllPanels() {
    document.querySelectorAll('.gnb-menu-item.is-open').forEach(li => this.closePanel(li));
  }

  closeAll() {
    this.closeAllPanels();
    if (this.overlay) this.overlay.classList.remove('is-visible');
  }
}

/* 외부 공개 */
window.GNBRenderer = GNBRenderer;
