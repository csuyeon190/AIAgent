/**
 * GNB Renderer - gnb.json → HTML GNB Hamburger Style
 * BCG-inspired Premium Hamburger Drawer Navigation
 */

class GNBRenderer {
  constructor(options = {}) {
    this.jsonUrl = options.jsonUrl || '/kr/gnb/gnb.json';
    this.containerId = options.containerId || 'header';
    this.menuData = null;
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
          SAMSUNG <span>SDS</span>
        </a>
        <button class="gnb-hamburger-btn" id="gnbHamburger" aria-label="전체 메뉴 열기" aria-expanded="false" aria-controls="gnbDrawer">
          <span class="hamburger-text">MENU</span>
          <div class="hamburger-icon">
            <span></span>
            <span></span>
          </div>
        </button>
      </nav>
      <div class="gnb-overlay" id="gnbOverlay" aria-hidden="true"></div>
      ${this.buildDrawerHTML()}
    `;
  }

  buildDrawerHTML() {
    return `
      <div class="gnb-drawer" id="gnbDrawer" aria-label="전체 메뉴" role="dialog" aria-modal="true" aria-hidden="true">
        <div class="gnb-drawer-header">
          <a href="/kr/index.html" class="gnb-drawer-logo">
            SAMSUNG <span>SDS</span>
          </a>
          <button class="gnb-drawer-close" id="gnbDrawerClose" aria-label="메뉴 닫기">
            <span class="close-text">CLOSE</span>
            <span class="close-icon"></span>
          </button>
        </div>
        <div class="gnb-drawer-body">
          <!-- 메인 레벨 1 메뉴 목록 -->
          <div class="gnb-drawer-main-menu" id="gnbDrawerMainMenu">
            <ul class="drawer-nav-list" role="menu">
              ${this.buildDrawerNavItems()}
            </ul>
            <div class="drawer-footer">
              <div class="drawer-lang-select">
                <a href="/kr/index.html" class="active">KR</a>
                <a href="/en/index.html">EN</a>
              </div>
            </div>
          </div>
          
          <!-- 서브 패널 -->
          ${this.buildDrawerSubPanels()}
        </div>
      </div>
    `;
  }

  /* ── DEPTH1 메뉴 아이템 생성 ── */
  buildDrawerNavItems() {
    if (!this.menuData) return '';
    const items = Object.values(this.menuData).flat();
    
    return items.map((item) => {
      const label = item.gnb_title || item.title;
      const hasChild = item.items && item.items.length > 0;
      const isNoChild = item.panelType === 'no-child' || !hasChild;

      if (isNoChild) {
        return `
          <li class="drawer-nav-item" role="none">
            <a href="${item.url || '#'}" class="drawer-nav-link" target="${item.target || '_self'}" role="menuitem">${label}</a>
          </li>`;
      } else {
        return `
          <li class="drawer-nav-item" role="none">
            <button class="drawer-nav-link" data-target="panel-${item.menuId}" role="menuitem" aria-haspopup="true">
              ${label} <span class="arrow-icon">→</span>
            </button>
          </li>`;
      }
    }).join('');
  }

  /* ── 서브 패널 컨테이너 빌드 ── */
  buildDrawerSubPanels() {
    if (!this.menuData) return '';
    const items = Object.values(this.menuData).flat();
    
    return items
      .filter(item => item.items && item.items.length > 0 && item.panelType !== 'no-child')
      .map(item => {
        const label = item.gnb_title || item.title;
        const viewAllUrl = item.items?.[0]?.url;
        const viewAllText = item.items?.[0]?.title || '전체보기';
        const hasViewAll = viewAllUrl && viewAllUrl !== 'javascript:void(0)';

        return `
          <div class="gnb-drawer-sub-panel" id="panel-${item.menuId}" aria-label="${label} 하위 메뉴" role="group">
            <div class="sub-panel-header">
              <button class="sub-panel-back" data-back="true">Back</button>
              <div class="sub-panel-title-wrapper">
                <h2 class="sub-panel-title">${label}</h2>
                ${hasViewAll ? `<a href="${viewAllUrl}" class="sub-panel-viewall" target="${item.items[0].target || '_self'}">${viewAllText} 전체보기</a>` : ''}
              </div>
            </div>
            <div class="sub-panel-body">
              ${this.buildSubPanelContent(item)}
            </div>
          </div>
        `;
      })
      .join('');
  }

  /* ── 서브 패널의 실제 메뉴 구조 ── */
  buildSubPanelContent(item) {
    const panelType = item.panelType;

    if (panelType === 'offering') {
      const offeringMain = item.items?.[0];
      if (!offeringMain) return '';
      const categories = offeringMain.items || [];

      return categories.map(cate => {
        const subcategories = cate.items || [];
        return subcategories.map(sub => {
          const groups = sub.items || [];
          const groupsHTML = groups.map(group => {
            const leafItems = group.items || [];
            const itemsHTML = leafItems.map(it => `
              <li class="drawer-link-item" role="none">
                <a href="${it.url || '#'}" target="${it.target || '_self'}" role="menuitem">${it.title}</a>
              </li>
            `).join('');

            return `
              <div class="drawer-offering-group">
                <h4 class="drawer-offering-group-title">${group.title}</h4>
                <ul class="drawer-link-list" role="menu">
                  ${itemsHTML}
                </ul>
              </div>
            `;
          }).join('');

          return `
            <div class="drawer-offering-sec">
              <h3 class="drawer-offering-sec-title">${sub.title}</h3>
              ${groupsHTML}
            </div>
          `;
        }).join('');
      }).join('');
    }

    if (panelType === 'normal') {
      const normalMain = item.items?.[0];
      if (!normalMain) return '';
      const categories = normalMain.items || [];

      return categories.map(cate => {
        const leafItems = cate.items || [];
        const itemsHTML = leafItems.map(it => `
          <li class="drawer-link-item" role="none">
            <a href="${it.url || '#'}" target="${it.target || '_self'}" role="menuitem">${it.title}</a>
          </li>
        `).join('');

        return `
          <div class="drawer-normal-sec">
            <h3 class="drawer-normal-sec-title">${cate.title}</h3>
            <ul class="drawer-link-list" role="menu">
              ${itemsHTML}
            </ul>
          </div>
        `;
      }).join('');
    }

    return '';
  }

  /* ── 이벤트 바인딩 ── */
  bindEvents() {
    const hamburger = document.getElementById('gnbHamburger');
    const drawer = document.getElementById('gnbDrawer');
    const closeBtn = document.getElementById('gnbDrawerClose');
    const overlay = document.getElementById('gnbOverlay');
    const mainMenu = document.getElementById('gnbDrawerMainMenu');

    if (!hamburger || !drawer) return;

    // 메뉴 열기
    const openDrawer = () => {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      if (overlay) overlay.classList.add('is-visible');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden'; // 뒷배경 스크롤 방지
    };

    // 메뉴 닫기
    const closeDrawer = () => {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      if (overlay) overlay.classList.remove('is-visible');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      
      // 서브패널 전부 초기화
      setTimeout(() => {
        if (mainMenu) mainMenu.classList.remove('is-shifted');
        document.querySelectorAll('.gnb-drawer-sub-panel').forEach(panel => {
          panel.classList.remove('is-active');
        });
      }, 300); // 드로어가 닫히는 트랜지션 이후에 초기화
    };

    hamburger.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);

    // ESC 키로 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeDrawer();
      }
    });

    // Depth 1 서브메뉴 진입 버튼
    document.querySelectorAll('.drawer-nav-link[data-target]').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const targetPanel = document.getElementById(targetId);
        if (mainMenu && targetPanel) {
          mainMenu.classList.add('is-shifted');
          targetPanel.classList.add('is-active');
          // 포커스를 서브패널의 Back 버튼으로 이동
          const backBtn = targetPanel.querySelector('.sub-panel-back');
          if (backBtn) backBtn.focus();
        }
      });
    });

    // 서브메뉴 Back 버튼 클릭
    document.querySelectorAll('.sub-panel-back').forEach(btn => {
      btn.addEventListener('click', () => {
        const panel = btn.closest('.gnb-drawer-sub-panel');
        if (panel && mainMenu) {
          panel.classList.remove('is-active');
          mainMenu.classList.remove('is-shifted');
          // 포커스를 기존 눌렀던 depth1 버튼으로 복구
          const menuId = panel.id.replace('panel-', '');
          const originalBtn = document.querySelector(`.drawer-nav-link[data-target="panel-${menuId}"]`);
          if (originalBtn) originalBtn.focus();
        }
      });
    });
  }
}

// 글로벌 등록
window.GNBRenderer = GNBRenderer;
