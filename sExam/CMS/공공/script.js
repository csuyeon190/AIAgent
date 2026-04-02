/**
 * ========================================
 * 삼성SDS 사례연구 페이지 - 메인 JavaScript
 * ========================================
 * 
 * 주요 기능:
 * - JSON 데이터 비동기 페칭
 * - 카테고리별 필터링 (클라우드/행정)
 * - 이미지 Lazy Loading (Intersection Observer)
 * - 페이지네이션 (6개씩 표시)
 * - 탭 전환 UI
 */

// ========================================
// 전역 상태 관리
// ========================================
const AppState = {
    allData: [],              // 전체 데이터
    cloudData: [],            // 클라우드 필터링 데이터
    adminData: [],            // 행정 필터링 데이터
    currentTab: 'cloud',      // 현재 활성 탭
    cloudDisplayCount: 6,     // 클라우드 표시 개수
    adminDisplayCount: 6,     // 행정 표시 개수
    itemsPerPage: 6,          // 페이지당 항목 수
    isLoading: false,         // 로딩 상태
    imageCache: new Set()     // 로드된 이미지 URL 캐시
};

// ========================================
// API 설정
// ========================================
const API_CONFIG = {
    dataUrl: 'http://localhost:3000/data.txt',
    timeout: 10000,  // 10초 타임아웃
    retryAttempts: 3 // 재시도 횟수
};

// ========================================
// DOM 요소 참조
// ========================================
const DOM = {
    loadingIndicator: null,
    errorMessage: null,
    cloudGrid: null,
    adminGrid: null,
    cloudLoadMore: null,
    adminLoadMore: null,
    tabButtons: null
};

// ========================================
// 초기화 함수
// ========================================
function initApp() {
    // DOM 요소 캐싱
    DOM.loadingIndicator = document.getElementById('loadingIndicator');
    DOM.errorMessage = document.getElementById('errorMessage');
    DOM.cloudGrid = document.getElementById('cloudGrid');
    DOM.adminGrid = document.getElementById('adminGrid');
    DOM.cloudLoadMore = document.getElementById('cloudLoadMore');
    DOM.adminLoadMore = document.getElementById('adminLoadMore');
    DOM.tabButtons = document.querySelectorAll('.tab-button');

    // 이벤트 리스너 등록
    setupEventListeners();

    // 데이터 로드
    loadData();
}

// ========================================
// 이벤트 리스너 설정
// ========================================
function setupEventListeners() {
    // 탭 버튼 클릭 이벤트
    DOM.tabButtons.forEach(button => {
        button.addEventListener('click', handleTabClick);
    });

    // 더보기 버튼 클릭 이벤트
    DOM.cloudLoadMore.addEventListener('click', () => handleLoadMore('cloud'));
    DOM.adminLoadMore.addEventListener('click', () => handleLoadMore('admin'));
}

// ========================================
// 탭 전환 핸들러
// ========================================
function handleTabClick(event) {
    const tab = event.currentTarget.dataset.tab;
    
    // 이미 활성화된 탭이면 무시
    if (AppState.currentTab === tab) return;

    AppState.currentTab = tab;

    // 탭 버튼 상태 업데이트
    DOM.tabButtons.forEach(btn => {
        const isActive = btn.dataset.tab === tab;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive);
    });

    // 패널 상태 업데이트
    const cloudPanel = document.getElementById('cloud-panel');
    const adminPanel = document.getElementById('admin-panel');
    
    if (tab === 'cloud') {
        cloudPanel.classList.add('active');
        adminPanel.classList.remove('active');
    } else {
        adminPanel.classList.add('active');
        cloudPanel.classList.remove('active');
    }
}

// ========================================
// 데이터 로드 함수 (async/await 사용)
// ========================================
async function loadData() {
    showLoading(true);
    hideError();

    try {
        // 재시도 로직과 함께 데이터 페칭
        const data = await fetchWithRetry(API_CONFIG.dataUrl, API_CONFIG.retryAttempts);
        
        // 데이터 파싱 및 저장
        AppState.allData = data;

        // 카테고리별 필터링
        filterDataByCategory();

        // UI 렌더링
        renderAllData();

        showLoading(false);
    } catch (error) {
        console.error('데이터 로드 실패:', error);
        showLoading(false);
        showError();
    }
}

// ========================================
// Fetch with Retry (재시도 로직)
// ========================================
async function fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

            const response = await fetch(url, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                }
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.warn(`Fetch attempt ${i + 1} failed:`, error);
            
            // 마지막 재시도에서도 실패하면 에러 throw
            if (i === retries - 1) {
                throw error;
            }

            // 재시도 전 대기 (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
    }
}

// ========================================
// 카테고리별 데이터 필터링
// ========================================
function filterDataByCategory() {
    AppState.cloudData = [];
    AppState.adminData = [];

    AppState.allData.forEach(item => {
        const categories = item.category || [];
        
        // 클라우드 카테고리: "공공" 또는 "클라우드" 포함
        if (categories.includes('공공') || categories.includes('클라우드')) {
            AppState.cloudData.push(item);
        }
        
        // 행정 카테고리: "자동화/협업" 또는 "공공" 포함
        if (categories.includes('자동화/협업') || categories.includes('공공')) {
            AppState.adminData.push(item);
        }
    });

    console.log('클라우드 데이터:', AppState.cloudData.length, '개');
    console.log('행정 데이터:', AppState.adminData.length, '개');
}

// ========================================
// 전체 데이터 렌더링
// ========================================
function renderAllData() {
    // 초기 표시 개수 리셋
    AppState.cloudDisplayCount = AppState.itemsPerPage;
    AppState.adminDisplayCount = AppState.itemsPerPage;

    // 각 탭 렌더링
    renderTabData('cloud');
    renderTabData('admin');
}

// ========================================
// 탭별 데이터 렌더링
// ========================================
function renderTabData(tab) {
    const data = tab === 'cloud' ? AppState.cloudData : AppState.adminData;
    const grid = tab === 'cloud' ? DOM.cloudGrid : DOM.adminGrid;
    const loadMoreBtn = tab === 'cloud' ? DOM.cloudLoadMore : DOM.adminLoadMore;
    const displayCount = tab === 'cloud' ? AppState.cloudDisplayCount : AppState.adminDisplayCount;

    // 그리드 초기화
    grid.innerHTML = '';

    // 표시할 데이터 슬라이스
    const displayData = data.slice(0, displayCount);

    // 카드 생성 및 추가 (애니메이션 딜레이 적용)
    displayData.forEach((item, index) => {
        const card = createCaseCard(item, index);
        grid.appendChild(card);
    });

    // 더보기 버튼 표시/숨김
    if (displayCount < data.length) {
        loadMoreBtn.style.display = 'flex';
    } else {
        loadMoreBtn.style.display = 'none';
    }

    // Lazy Loading 설정
    setupLazyLoading();
}

// ========================================
// 케이스 스터디 카드 생성
// ========================================
function createCaseCard(item, index) {
    const card = document.createElement('article');
    card.className = 'case-card';
    card.style.animationDelay = `${index * 0.1}s`; // 순차 애니메이션

    // 이미지 영역 생성
    const imageDiv = document.createElement('div');
    imageDiv.className = 'card-image';

    // success_yn이 'T'인 경우에만 이미지 표시
    if (item.success_yn === 'T' && item.success_img) {
        const img = document.createElement('img');
        img.dataset.src = item.success_img; // Lazy loading을 위한 data-src
        img.alt = item.title || '사례 이미지';
        img.loading = 'lazy'; // 브라우저 네이티브 lazy loading
        imageDiv.appendChild(img);
    } else {
        // 플레이스홀더 표시
        imageDiv.innerHTML = `
            <svg class="card-image-placeholder" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                <path d="M21 15L16 10L5 21" stroke="currentColor" stroke-width="2"/>
            </svg>
        `;
    }

    // 콘텐츠 영역 생성
    const contentDiv = document.createElement('div');
    contentDiv.className = 'card-content';

    // 로고 (있는 경우)
    let logoHtml = '';
    if (item.logo_img) {
        logoHtml = `<img src="${item.logo_img}" alt="${item.company || ''} 로고" class="card-logo">`;
    }

    // 태그 생성
    const tags = (item.category || []).map(cat => 
        `<span class="card-tag">${cat}</span>`
    ).join('');

    contentDiv.innerHTML = `
        ${logoHtml}
        <h3 class="card-title">${item.title || '제목 없음'}</h3>
        <p class="card-description">${item.description || '설명 없음'}</p>
        <div class="card-tags">${tags}</div>
    `;

    card.appendChild(imageDiv);
    card.appendChild(contentDiv);

    // 클릭 이벤트 (상세 페이지로 이동 등)
    if (item.link) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            window.open(item.link, '_blank');
        });
    }

    return card;
}

// ========================================
// Lazy Loading 설정 (Intersection Observer)
// ========================================
function setupLazyLoading() {
    // Intersection Observer가 지원되는지 확인
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        loadImage(img);
                        observer.unobserve(img); // 로드 후 관찰 해제
                    }
                });
            },
            {
                rootMargin: '50px', // 뷰포트 50px 전에 로드 시작
                threshold: 0.01
            }
        );

        // 모든 lazy 이미지 관찰
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));

    } else {
        // Intersection Observer 미지원 시 즉시 모든 이미지 로드
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => loadImage(img));
    }
}

// ========================================
// 이미지 로드 함수 (프리로딩)
// ========================================
function loadImage(imgElement) {
    const src = imgElement.dataset.src;
    
    if (!src || AppState.imageCache.has(src)) {
        return;
    }

    // 이미지 프리로딩
    const tempImage = new Image();
    
    tempImage.onload = () => {
        imgElement.src = src;
        imgElement.removeAttribute('data-src');
        imgElement.parentElement.classList.add('loaded');
        AppState.imageCache.add(src);
    };

    tempImage.onerror = () => {
        console.error('이미지 로드 실패:', src);
        imgElement.parentElement.classList.add('loaded'); // skeleton 제거
        // 에러 시 플레이스홀더 표시
        imgElement.parentElement.innerHTML = `
            <svg class="card-image-placeholder" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M3 3L21 21" stroke="currentColor" stroke-width="2"/>
            </svg>
        `;
    };

    // 실제 이미지 로드 시작
    tempImage.src = src;
}

// ========================================
// 더보기 버튼 핸들러
// ========================================
function handleLoadMore(tab) {
    if (tab === 'cloud') {
        AppState.cloudDisplayCount += AppState.itemsPerPage;
        renderTabData('cloud');
    } else {
        AppState.adminDisplayCount += AppState.itemsPerPage;
        renderTabData('admin');
    }

    // 부드러운 스크롤 (새로 추가된 항목으로)
    setTimeout(() => {
        const grid = tab === 'cloud' ? DOM.cloudGrid : DOM.adminGrid;
        const cards = grid.querySelectorAll('.case-card');
        const targetCard = cards[cards.length - AppState.itemsPerPage];
        
        if (targetCard) {
            targetCard.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }
    }, 100);
}

// ========================================
// UI 유틸리티 함수
// ========================================
function showLoading(show) {
    if (show) {
        DOM.loadingIndicator.style.display = 'flex';
        DOM.cloudGrid.style.display = 'none';
        DOM.adminGrid.style.display = 'none';
    } else {
        DOM.loadingIndicator.style.display = 'none';
        DOM.cloudGrid.style.display = 'grid';
        DOM.adminGrid.style.display = 'grid';
    }
}

function showError() {
    DOM.errorMessage.style.display = 'flex';
}

function hideError() {
    DOM.errorMessage.style.display = 'none';
}

// ========================================
// 앱 초기화 실행
// ========================================
// DOM이 완전히 로드된 후 실행
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// ========================================
// 성능 모니터링 (개발용)
// ========================================
if (window.performance && window.performance.mark) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`페이지 로드 시간: ${pageLoadTime}ms`);
    });
}
