/**
 * M00_A | GNB & RNB & Header Controls (Vanilla JS Modern Refactoring)
 * Samsung SDS 스타일 헤더/GNB/RNB 종합 제어 모듈
 */

class M00_A {
    constructor(el) {
        this.el = (el instanceof jQuery) ? el[0] : el;
        var htmlNode = document.querySelector('html');
        this.lang = htmlNode ? (htmlNode.getAttribute('lang') || 'en') : 'en';
        this.country = htmlNode ? (htmlNode.getAttribute('data-country') || 'en') : 'en';
        
        this.data = {
            history: true,
            current: '',
            url: '',
            urlFeature: ''
        };
        this.menuData = null;
        this.menuDataXml = null;
        this.breadData = [];
        this.featureData = '';
        this.offeringData = null;
        this.currentPageType = '';
        this.gnbType = 'main';
        this.isOfferingMain = false;
        
        this.isMobile = window.innerWidth > 1024 ? false : true;
        this.isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.isFocus = false;
        
        this.historyMaxCount = 5;
        this.historyStorageKey = 'visitHistory_' + this.lang + '_' + this.country;
        
        var rawEl = this.el;
        this.hd_iconNavigator = rawEl ? rawEl.querySelector('.hd-etc') : null;
        this.hd_iconNavigator_area = this.hd_iconNavigator ? this.hd_iconNavigator.querySelector('.util') : null;
        
        this.overlay = null;
        this.init();
    }
    
    init() {
        var _this = this;
        // Dataset extend
        if (this.el && this.el.dataset) {
            Object.assign(this.data, this.el.dataset);
        } else if (this.el && typeof jQuery !== 'undefined' && this.el instanceof jQuery) {
            Object.assign(this.data, this.el.data());
        }
        
        var host = '';
        if (window.location.hostname.includes('70.225.30.31')) host = 'http://70.225.30.31:8001';
        this.data.url = host + this.data.url;
        this.data.urlFeature = host + this.data.urlFeature;
        
        // Setup 리스너 추가
        document.addEventListener('DOMContentLoaded', () => {
            var reUrl = window.location.href;
            if (reUrl.includes(':7000') || reUrl.includes(':8001') || reUrl.includes(':8002') || !reUrl.includes('cn')) {
                document.querySelectorAll('.gnb').forEach(el => el.classList.add('gnb_ver2024', 'ver2024_2'));
            }
        });
        
        this.getData(this.data.url, () => {
            _this.setSticky();
            _this.writeHistory();
            _this.drawHistory();
            _this.setTextByCountry();
        });
        
        window.addEventListener('resize', () => {
            _this.isMobile = window.innerWidth > 1024 ? false : true;
        });
        
        window.addEventListener('scroll', () => {
            _this.setSticky();
        });
    }
    
    getData(dataUrl, callback) {
        var _this = this;
        var methodType = dataUrl.indexOf('/data_ajax/') < 0 ? 'POST' : 'GET';
        
        fetch(dataUrl, {
            method: methodType,
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => {
            if (!res.ok) throw new Error('Fetch failed');
            return res.json();
        })
        .then(data => {
            _this.setupMenu(data, callback);
        })
        .catch(err => {
            console.error('[GNB] data fetch error:', err);
        });
    }
    
    setupMenu(data, callback) {
        var _this = this;
        this.menuData = data;
        
        var foundNode = null;
        
        // menuData 구조 순회하며 current ID 매칭
        for (var group in this.menuData) {
            var menuGroup = this.menuData[group];
            for (var depth1 in menuGroup) {
                var item = menuGroup[depth1];
                if (item.menuId === this.data.current) {
                    foundNode = item;
                    break;
                }
                if (item.items) {
                    item.items.forEach(sub => {
                        if (sub.menuId === _this.data.current) {
                            foundNode = sub;
                        }
                        if (sub.items) {
                            sub.items.forEach(sub2 => {
                                if (sub2.menuId === _this.data.current) {
                                    foundNode = sub2;
                                }
                            });
                        }
                    });
                }
            }
        }
        
        if (foundNode) {
            this.currentPageType = foundNode.type || '';
            var typePrefix = this.currentPageType.split('_')[0];
            if (typePrefix === 'static') this.gnbType = 'static';
            else if (typePrefix === 'offering') this.gnbType = 'offering';
            else if (typePrefix === 'normal') this.gnbType = 'normal';
            else this.gnbType = 'main';
        }
        
        fetch(this.data.urlFeature)
        .then(res => res.ok ? res.text() : '')
        .then(html => {
            _this.featureData = html;
            _this.setBreadData();
            _this.drawGnb();
            
            if (callback) callback();
        })
        .catch(err => {
            console.error('[GNB] feature fetch error:', err);
        });
    }
    
    setBreadData() {
        this.breadData = [];
        if (!this.menuData) return;
        
        var _this = this;
        var currentId = this.data.current;
        var pathList = [];
        
        // 현재 menuId까지의 경로를 찾아 breadData 채우기
        function findPath(node, currentPath) {
            if (node.menuId === currentId) {
                pathList = [...currentPath, node];
                return true;
            }
            if (node.items) {
                for (var child of node.items) {
                    if (findPath(child, [...currentPath, node])) return true;
                }
            }
            return false;
        }
        
        for (var group in this.menuData) {
            for (var d1 of Object.values(this.menuData[group])) {
                if (findPath(d1, [])) break;
            }
        }
        
        pathList.forEach(node => {
            _this.breadData.push({
                title: node.title,
                url: node.url || null,
                target: node.target || null,
                menuId: node.menuId
            });
        });
        
        if (pathList.length > 0) {
            var lastNode = pathList[pathList.length - 1];
            this.offeringData = pathList.find(n => n.type === 'offering_main' || n.type === 'normal_main') || lastNode;
            this.drawBread();
        }
    }
    
    drawBread() {
        var len = this.breadData.length;
        if (len === 0) return;
        var current = this.breadData[len - 1];
        var color = this.offeringColor || '#fff';
        
        var htmlStr = '<div class="brandcolor" style="background-color:' + color + '"><div class="inner">';
        if (this.gnbType == 'normal' || this.gnbType == 'static') {
            htmlStr = '<div class="brandcolor normal"><div class="inner">';
        }
        if (this.gnbType == 'offering') {
            if (this.offeringData && this.offeringData.menuId == current.menuId) {
                htmlStr = '<div class="brandcolor normal"><div class="inner">';
                this.isOfferingMain = true;
            } else {
                htmlStr += '<p class="title">' + current.title + '</p>';
            }
        }
        
        htmlStr += '<nav class="breadcrumb"><a href="' + this.getHomeUrl() + '"><span>Home</span></a>';
        for (var i = 0; i < len; i++) {
            if (i == len - 1 || !this.breadData[i].url) {
                htmlStr += '<span>' + this.breadData[i].title + '</span>';
            } else {
                htmlStr += '<a href="' + this.breadData[i].url + '" target="' + this.breadData[i].target + '" ><span>' + this.breadData[i].title + '</span></a>';
            }
        }
        htmlStr += '</nav></div></div>';
        
        var header = document.getElementById('header');
        var brandColorEl = document.querySelector('.brandcolor');
        if (!brandColorEl && header) {
            header.insertAdjacentHTML('beforeend', htmlStr);
            brandColorEl = document.querySelector('.brandcolor');
        }
        
        if (brandColorEl && header) {
            brandColorEl.style.top = this.el.offsetHeight + 'px';
        }
    }
    
    writeHistory() {
        if (this.data.history == 'false' || this.data.history === false) return;
        var storage = window.localStorage;
        var historyArray = JSON.parse(storage.getItem(this.historyStorageKey)) || [];
        
        var isOverlap = historyArray.some(data => data.menuId == this.data.current && data.url == window.location.href);
        if (isOverlap) return;
        
        var historyObj = {
            menuId: this.data.current,
            url: window.location.href,
            title: document.title,
            location: this.breadData.map(b => b.title).join(' > ') || 'Home'
        };
        
        var ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) historyObj.image = ogImage.getAttribute('content');
        
        historyArray.unshift(historyObj);
        if (historyArray.length > this.historyMaxCount) {
            historyArray.pop();
        }
        storage.setItem(this.historyStorageKey, JSON.stringify(historyArray));
    }
    
    drawHistory() {
        var historyDataArray = JSON.parse(window.localStorage.getItem(this.historyStorageKey)) || [];
        var historyUl = document.createElement('ul');
        
        historyDataArray.forEach(item => {
            var li = document.createElement('li');
            li.innerHTML = `
                <div class="summary">
                    <span class="bread" title="${item.location}">${item.location}</span>
                    <p class="title"><a href="${item.url}">${item.title}</a></p>
                </div>
                <div class="pic">
                    <a href="${item.url}"><img src="${item.image || ''}" alt="${item.title}"></a>
                </div>`;
            historyUl.appendChild(li);
        });
        
        var pagesEl = this.el.querySelector('.pages');
        if (pagesEl) {
            pagesEl.innerHTML = '';
            pagesEl.appendChild(historyUl);
        }
    }
    
    drawGnb() {
        var _this = this;
        var cnt = document.createElement('div');
        cnt.className = 'hd-cnt';
        
        var gnbNav = document.createElement('nav');
        gnbNav.id = 'gnb';
        gnbNav.className = 'gnb-inner';
        gnbNav.innerHTML = `
            <a href="${this.getHomeUrl()}" class="gnb-logo" aria-label="Samsung SDS 홈">
              <span class="gnb-logo-text">SAMSUNG <span>SDS</span></span>
            </a>
            <ul class="gnb-menu gnb-nav" role="menubar" aria-label="메인 메뉴">
              ${this.buildMenuItems()}
            </ul>
        `;
        cnt.appendChild(gnbNav);
        
        var gnbEl = this.el.querySelector('.gnb');
        if (gnbEl) {
            gnbEl.innerHTML = '';
            gnbEl.appendChild(cnt);
        }
        
        this.drawRnb();
        this.bindEvents();
    }
    
    buildMenuItems() {
        var _this = this;
        if (!this.menuData) return '';
        var itemsHTML = [];
        
        for (var group in this.menuData) {
            var menuGroup = this.menuData[group];
            for (var depth1 in menuGroup) {
                var item = menuGroup[depth1];
                var hasChild = item.items && item.items.length > 0;
                itemsHTML.push(`
                    <li class="gnb-menu-item${!hasChild ? ' no-child' : ''}" data-menu-id="${item.menuId}">
                        <a class="gnb-depth1-link" href="${item.url || 'javascript:void(0)'}">${item.title}</a>
                        ${hasChild ? this.buildChildPanel(item) : ''}
                    </li>
                `);
            }
        }
        return itemsHTML.join('');
    }
    
    buildChildPanel(item) {
        return `
            <div class="childpanel ${item.style || ''}">
                <div class="inner">
                    <ul class="items">
                        ${item.items ? item.items.map(sub => `
                            <li>
                                <div class="title"><a href="${sub.url || '#'}">${sub.title}</a></div>
                            </li>
                        `).join('') : ''}
                    </ul>
                </div>
            </div>`;
    }
    
    drawRnb() {
        var rnbEl = this.el.querySelector('.rnb');
        if (rnbEl) {
            rnbEl.innerHTML = `
                <div class="container">
                    <div class="head">
                        <p class="logo"><a href="${this.getHomeUrl()}" aria-label="SAMSUNG SDS"></a></p>
                        <a href="javascript:void(0)" class="btn-close">닫기</a>
                    </div>
                    <div class="depth-main">
                    </div>
                </div>`;
        }
    }
    
    setSticky() {
        var scroll = window.pageYOffset || document.documentElement.scrollTop;
        var rawEl = this.el;
        if (!rawEl) return;
        
        rawEl.style.position = 'fixed';
        rawEl.style.width = '100%';
        rawEl.style.zIndex = '7000';
        
        var wrap = document.getElementById('wrap');
        if (wrap) {
            if (scroll > 0) {
                wrap.classList.remove('scroll_chk');
            } else {
                wrap.classList.add('scroll_chk');
            }
        }
    }
    
    bindEvents() {
        var _this = this;
        this.overlay = document.getElementById('gnbOverlay');
        
        this.el.querySelectorAll('.gnb-menu-item:not(.no-child)').forEach(li => {
            li.addEventListener('mouseenter', () => _this.openPanel(li));
            li.addEventListener('mouseleave', () => _this.closePanel(li));
        });
        
        var closeBtn = this.el.querySelector('.rnb .btn-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                _this.closeAll();
            });
        }
    }
    
    openPanel(li) {
        li.classList.add('is-open');
        if (this.overlay) this.overlay.classList.add('is-visible');
    }
    
    closePanel(li) {
        li.classList.remove('is-open');
        if (!this.el.querySelector('.gnb-menu-item.is-open')) {
            if (this.overlay) this.overlay.classList.remove('is-visible');
        }
    }
    
    closeAll() {
        this.el.querySelectorAll('.gnb-menu-item.is-open').forEach(li => this.closePanel(li));
    }
    
    getHomeUrl() {
        return '/' + this.lang + '/index.html';
    }
    
    setTextByCountry() {
        // 다국어 라벨 매핑 생략 또는 간단 구현
    }
}

// Global Export
window.M00_A = M00_A;
