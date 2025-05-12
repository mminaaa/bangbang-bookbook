import { displaySearchResults } from './kakaomap.js';

/**
 * 데이터 초기화
 */
async function initializeBookstoreData() {
    const items = await getItems(getBaseUrl(), null);
    return createMapPositions(items);
}

/**
 * 키워드 검색
 */
async function searchBookstores(keyword) {
    try {
        const items = await getItems(getBaseUrl(), keyword);
        const positions = await createMapPositions(items);
    
        //지도에 마커 표시
        displaySearchResults(positions);
    } catch (error) {
        console.error('Error searching bookstores:', error);
        alert('검색 중 오류가 발생했습니다.');
        return [];
    }
}

/**
 * API 주소
 */
function getBaseUrl() {
    const serviceKey = 'a839dbd2-48c9-4ab7-97d7-0db47321f8dd';
    const numOfRows = 1500;
    const pageNo = 1;
    const baseUrl = `http://api.kcisa.kr/openapi/API_CIA_089/request?serviceKey=${serviceKey}&numOfRows=${numOfRows}&pageNo=${pageNo}`;

    return baseUrl;
}

/**
 * 응답받은 데이터 파싱
 */
async function getItems(baseUrl, keyword) {
    const url = (keyword != null) ? baseUrl + "&keyword=" + keyword : baseUrl;
    const response = await fetch(url);
    const str = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(str, "text/xml");
    
    return xml.getElementsByTagName("item");
}

/**
 * 지도용 마커 객체 배열 생성
 */
function createMapPositions(items) {
    let positions = [];
    for (let i = 0; i < items.length; i++) {
        const title = items[i].getElementsByTagName("TITLE")[0]?.textContent;
        const desc = items[i].getElementsByTagName("DESCRIPTION")[0]?.textContent;
        const subDesc = items[i].getElementsByTagName("SUB_DESCRIPTION")[0]?.textContent;
        const address = items[i].getElementsByTagName("ADDRESS")[0]?.textContent;
        const coordinates = items[i].getElementsByTagName("COORDINATES")[0]?.textContent;

        //좌표는 문자열이므로 쉼표 기준 분리
        const [lat, lng] = coordinates.split(',').map(v => v.trim());

        positions.push({
            content: `<div class="info-window">
                        <div class="title">📚 ${title}</div>
                        <div class="address">🏠 ${address}</div>
                        <div class="desc">🗓️ ${desc}</div>
                        <div class="sub-desc">✨ <em>${subDesc}</em></div>
                     </div>`,
            latlng: new kakao.maps.LatLng(lat, lng)
        });
    }
    return positions;
}

export { initializeBookstoreData, searchBookstores };