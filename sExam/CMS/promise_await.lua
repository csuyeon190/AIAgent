Promise와 async/await 완벽 가이드 🎯
1. Promise란? 🤝
Promise는 "미래에 완료될 작업"에 대한 약속이에요.
실생활 비유
javascript// 📱 치킨 주문 시나리오

// ❌ 동기 방식 (현실에서 불가능)
const chicken = orderChicken();  // 30분 동안 여기서 멈춤 😱
console.log('치킨 먹기');

// ✅ Promise 방식 (현실적)
orderChicken()  // "30분 후에 줄게!" (약속)
  .then(chicken => {
    console.log('치킨 먹기');
  });

console.log('기다리는 동안 유튜브 보기');  // 먼저 실행됨
Promise의 3가지 상태
javascript// Promise의 생애주기
const promise = new Promise((resolve, reject) => {
  // 1. Pending (대기) - 초기 상태
  console.log('치킨 조리 중...');
  
  setTimeout(() => {
    const success = Math.random() > 0.5;
    
    if (success) {
      // 2. Fulfilled (이행) - 성공
      resolve('🍗 치킨 완성!');
    } else {
      // 3. Rejected (거부) - 실패
      reject('❌ 재료 소진');
    }
  }, 3000);
});

// 상태별 처리
promise
  .then(result => {
    // Fulfilled 시 실행
    console.log(result);  // 🍗 치킨 완성!
  })
  .catch(error => {
    // Rejected 시 실행
    console.log(error);   // ❌ 재료 소진
  })
  .finally(() => {
    // 성공/실패 관계없이 실행
    console.log('주문 완료');
  });
2. 콜백 지옥 → Promise 🔥
❌ 콜백 지옥 (Callback Hell)
javascript// 나쁜 예: 콜백 중첩 (가독성 최악)
loadUserData(userId, function(user) {
  loadUserPosts(user.id, function(posts) {
    loadPostComments(posts[0].id, function(comments) {
      loadCommentAuthor(comments[0].authorId, function(author) {
        console.log(author.name);
        // 😱 들여쓰기 지옥
      });
    });
  });
});
✅ Promise 체이닝
javascript// 좋은 예: Promise로 평탄화
loadUserData(userId)
  .then(user => loadUserPosts(user.id))
  .then(posts => loadPostComments(posts[0].id))
  .then(comments => loadCommentAuthor(comments[0].authorId))
  .then(author => console.log(author.name))
  .catch(error => console.error('에러 발생:', error));

// ✅ 읽기 쉽고, 에러 처리도 한 곳에서!
3. async/await - Promise의 문법 설탕 🍬
기본 문법
javascript// Promise 방식
function getUser() {
  return fetch('/api/user')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      return data;
    });
}

// ✅ async/await 방식 (더 읽기 쉬움)
async function getUser() {
  const response = await fetch('/api/user');
  const data = await response.json();
  console.log(data);
  return data;
}

// 둘 다 Promise를 반환함!
await의 마법
javascript// await가 하는 일
async function example() {
  console.log('1. 시작');
  
  const result = await Promise.resolve('완료');
  // ↑ 여기서 기다림 (다른 코드는 실행됨)
  
  console.log('2.', result);
}

example();
console.log('3. 다른 작업');

// 출력 순서:
// 1. 시작
// 3. 다른 작업  ← await 기다리는 동안 실행
// 2. 완료
4. 실전 예제: GNB 데이터 로딩 🎯
Before: 콜백 방식
javascript// ❌ 옛날 방식: jQuery Ajax
_proto.getData = function(dataUrl, callback) {
  $.ajax({
    url: dataUrl,
    method: 'GET',
    success: function(data) {
      _this.setupMenu(data);
      if (callback) {
        callback();
      }
    },
    error: function() {
      console.log('에러 발생');
    }
  });
};

// 사용
this.getData(url, function() {
  _this.setSticky();
  _this.drawHistory();
});
After: async/await
javascript// ✅ 현대적 방식: async/await
class GNBController {
  async loadData() {
    try {
      // 1. 메뉴 데이터 로딩
      const menuData = await this.fetchMenuData(this.data.url);
      this.setupMenu(menuData);
      
      // 2. Feature 데이터 로딩
      const featureData = await this.fetchFeatureData(this.data.urlFeature);
      this.featureData = featureData;
      
      // 3. UI 초기화
      this.setSticky();
      this.drawHistory();
      
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
      this.showErrorMessage();
    }
  }

  async fetchMenuData(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  async fetchFeatureData(url) {
    const response = await fetch(url);
    return await response.text();
  }
}
5. 병렬 처리: Promise.all 🚀
❌ 순차 처리 (느림)
javascript// 나쁜 예: 순차적으로 기다림 (6초)
async function loadAllData() {
  const menu = await fetchMenu();      // 3초 대기
  const feature = await fetchFeature(); // 3초 대기
  const user = await fetchUser();      // 3초 대기
  // 총 9초 소요 😱
}
✅ 병렬 처리 (빠름)
javascript// 좋은 예: 동시에 요청 (3초)
async function loadAllData() {
  // 동시에 시작
  const [menu, feature, user] = await Promise.all([
    fetchMenu(),
    fetchFeature(),
    fetchUser()
  ]);
  // 총 3초 소요 (가장 느린 것 기준) ✅
  
  return { menu, feature, user };
}
Promise.all vs Promise.allSettled
javascript// Promise.all - 하나라도 실패하면 전체 실패
async function loadWithAll() {
  try {
    const [data1, data2, data3] = await Promise.all([
      fetch('/api/data1'),
      fetch('/api/data2'),
      fetch('/api/data3')  // ❌ 이것만 실패해도 전체 catch
    ]);
  } catch (error) {
    // 하나라도 실패하면 여기로
    console.error('일부 데이터 로딩 실패');
  }
}

// ✅ Promise.allSettled - 모두 완료될 때까지 기다림
async function loadWithAllSettled() {
  const results = await Promise.allSettled([
    fetch('/api/data1'),
    fetch('/api/data2'),
    fetch('/api/data3')
  ]);
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`데이터${index + 1} 성공:`, result.value);
    } else {
      console.error(`데이터${index + 1} 실패:`, result.reason);
    }
  });
  
  // 성공한 것만 사용 가능 ✅
}
6. 에러 처리 🛡️
try-catch 사용법
javascript// ✅ 기본 에러 처리
async function loadUser(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const user = await response.json();
    return user;
    
  } catch (error) {
    console.error('사용자 로딩 실패:', error);
    
    // 기본값 반환 또는 재시도
    return null;
  }
}
고급 에러 처리 패턴
javascriptclass DataLoader {
  // 재시도 로직
  async fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        console.log(`시도 ${i + 1}/${retries} 실패`);
        
        if (i === retries - 1) {
          throw error; // 마지막 시도에서 실패하면 에러 전파
        }
        
        // 재시도 전 대기 (exponential backoff)
        await this.delay(Math.pow(2, i) * 1000);
      }
    }
  }

  // 타임아웃 설정
  async fetchWithTimeout(url, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return await response.json();
      
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('요청 시간 초과');
      }
      throw error;
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
7. 실전: GNB 최적화된 데이터 로딩 🎯
javascriptclass GNBController {
  async init() {
    try {
      // 1. 필수 데이터 병렬 로딩
      await this.loadCriticalData();
      
      // 2. 선택적 데이터 백그라운드 로딩
      this.loadOptionalData(); // await 없음 (백그라운드)
      
      // 3. UI 초기화
      this.initializeUI();
      
    } catch (error) {
      this.handleInitError(error);
    }
  }

  // 필수 데이터 (빠르게)
  async loadCriticalData() {
    const [menuData, featureData] = await Promise.all([
      this.fetchMenuData(this.data.url),
      this.fetchFeatureData(this.data.urlFeature)
    ]);
    
    this.menuData = menuData;
    this.featureData = featureData;
    this.setupMenu(menuData);
  }

  // 선택적 데이터 (천천히)
  async loadOptionalData() {
    try {
      // 유휴 시간에 로딩
      if ('requestIdleCallback' in window) {
        await new Promise(resolve => {
          requestIdleCallback(resolve, { timeout: 2000 });
        });
      }
      
      const [history, preferences] = await Promise.allSettled([
        this.loadHistory(),
        this.loadUserPreferences()
      ]);
      
      if (history.status === 'fulfilled') {
        this.drawHistory(history.value);
      }
      
      if (preferences.status === 'fulfilled') {
        this.applyPreferences(preferences.value);
      }
      
    } catch (error) {
      console.warn('선택적 데이터 로딩 실패:', error);
      // 필수가 아니므로 에러 무시
    }
  }

  // API 호출 (재시도 + 타임아웃)
  async fetchMenuData(url) {
    const maxRetries = 3;
    const timeout = 5000;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const response = await fetch(url, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        return await response.json();
        
      } catch (error) {
        console.warn(`로딩 시도 ${i + 1}/${maxRetries} 실패`);
        
        if (i === maxRetries - 1) {
          throw new Error('메뉴 데이터 로딩 최종 실패');
        }
        
        // 재시도 대기 (1초, 2초, 4초...)
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, i) * 1000)
        );
      }
    }
  }

  handleInitError(error) {
    console.error('GNB 초기화 실패:', error);
    
    // 사용자에게 알림
    this.showErrorMessage('메뉴를 불러오는데 실패했습니다.');
    
    // Analytics 전송
    if (window.gtag) {
      gtag('event', 'exception', {
        description: error.message,
        fatal: true
      });
    }
  }
}
8. 헬퍼 함수 모음 🛠️
javascript// Promise 유틸리티
class PromiseUtils {
  // 지연 실행
  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 타임아웃
  static timeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), ms)
      )
    ]);
  }

  // 재시도
  static async retry(fn, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === retries - 1) throw error;
        await this.delay(delay * Math.pow(2, i));
      }
    }
  }

  // 순차 실행
  static async sequential(tasks) {
    const results = [];
    for (const task of tasks) {
      results.push(await task());
    }
    return results;
  }

  // 동시 실행 (개수 제한)
  static async concurrent(tasks, limit = 3) {
    const results = [];
    const executing = [];
    
    for (const task of tasks) {
      const promise = task().then(result => {
        executing.splice(executing.indexOf(promise), 1);
        return result;
      });
      
      results.push(promise);
      executing.push(promise);
      
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
    
    return Promise.all(results);
  }
}

// 사용 예시
async function example() {
  // 1초 대기
  await PromiseUtils.delay(1000);
  
  // 5초 타임아웃
  const data = await PromiseUtils.timeout(
    fetch('/api/slow'),
    5000
  );
  
  // 3번 재시도
  const result = await PromiseUtils.retry(
    () => fetch('/api/unstable'),
    3
  );
  
  // 동시 3개씩 실행
  const images = await PromiseUtils.concurrent(
    imageUrls.map(url => () => loadImage(url)),
    3
  );
}
9. 주의사항 ⚠️
❌ 흔한 실수들
javascript// 실수 1: await 빠뜨림
async function bad1() {
  const result = fetch('/api/data'); // Promise 객체 반환
  console.log(result); // Promise {<pending>} 😱
}

// ✅ 올바름
async function good1() {
  const result = await fetch('/api/data');
  console.log(result); // Response 객체
}

// 실수 2: forEach에서 await
async function bad2() {
  urls.forEach(async url => {
    await fetch(url); // 기다리지 않음!
  });
}

// ✅ 올바름
async function good2() {
  for (const url of urls) {
    await fetch(url);
  }
  // 또는
  await Promise.all(urls.map(url => fetch(url)));
}

// 실수 3: try-catch 없이 사용
async function bad3() {
  const data = await fetch('/api/data'); // 에러 시 앱 크래시
}

// ✅ 올바름
async function good3() {
  try {
    const data = await fetch('/api/data');
  } catch (error) {
    console.error('에러 처리:', error);
  }
}

// 실수 4: 불필요한 await
async function bad4() {
  return await fetch('/api/data'); // 불필요
}

// ✅ 올바름
async function good4() {
  return fetch('/api/data'); // 이미 Promise 반환
}
10. 실전 체크리스트 ✅
markdown### Promise/async-await 체크리스트

#### 기본
- [ ] async 함수는 항상 Promise 반환
- [ ] await는 async 함수 안에서만 사용
- [ ] try-catch로 에러 처리
- [ ] Promise.all로 병렬 처리

#### 성능
- [ ] 순차가 필요한 경우만 순차 실행
- [ ] 독립적인 작업은 병렬 처리
- [ ] 타임아웃 설정
- [ ] 재시도 로직 구현

#### 주의사항
- [ ] forEach에서 await 사용 금지
- [ ] await 빠뜨리지 않기
- [ ] 불필요한 await 제거
- [ ] 에러 처리 빠뜨리지 않기
