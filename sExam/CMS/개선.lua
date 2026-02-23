$(document).ready(function () {
  const url = new URL(window.location.href);
  const param = new URLSearchParams(url.search);

  // ✅ 이중 디코딩 제거, 한 번만 디코딩
  const decodedParam = decodeURIComponent(param.toString());
  const cleanParam = XSSCheck(decodedParam);
  const params = new URLSearchParams(cleanParam);

  // ✅ null 체크 강화
  const utm_source = params.get('utm_source');
  if (utm_source !== null && utm_source.trim() !== "") {

    // ✅ utm_ 파라미터만 허용 (화이트리스트)
    const allowedUtmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    const addParams = new URLSearchParams();

    for (const [key, value] of params) {
      if (allowedUtmKeys.includes(key)) {
        // ✅ 값도 개별 검증
        const cleanValue = XSSCheck(value);
        addParams.append(key, cleanValue);
      }
    }

    const addParmStr = addParams.toString() ? `?${addParams.toString()}` : '';

    if (addParmStr) {
      $('.utmLink').each(function () {
        const currentHref = $(this).attr('href') || '';

        // ✅ javascript: 같은 위험한 프로토콜 차단
        if (/^javascript:/i.test(currentHref)) return;

        // ✅ 이미 ? 가 있는 경우 처리
        const separator = currentHref.includes('?') ? '&' : '?';
        $(this).attr('href', currentHref + separator + addParams.toString());
      });
    }
  }
});

function XSSCheck(str) {
  if (typeof str !== 'string') return '';

  let newStr = str;

  // ✅ 위험 패턴 제거 (이벤트 핸들러, javascript:, 태그 등)
  newStr = newStr.replace(/javascript\s*:/gi, '');
  newStr = newStr.replace(/on\w+\s*=/gi, '');          // onerror=, onload= 등
  newStr = newStr.replace(/<\s*script[^>]*>.*?<\/script>/gi, '');
  newStr = newStr.replace(/<[^>]*>/g, '');              // 모든 HTML 태그
  newStr = newStr.replace(/[<>"';]/g, '');              // 특수문자

  return newStr;
}