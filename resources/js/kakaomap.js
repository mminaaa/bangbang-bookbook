
import { initializeBookstoreData } from './bookstoreApi.js';

let currentMarkers = [];

const mapContainer = document.getElementById('map'),
                    mapOption = { 
                        center: new kakao.maps.LatLng(36.5, 127.8), 
                        level: 12
                    };

const map = new kakao.maps.Map(mapContainer, mapOption); 

//지도 초기화 실행
initializeMap();

/**
 * 지도 초기화
 */
async function initializeMap() {
    const positions = await initializeBookstoreData();
    console.log("positions=>", positions);
    
    displayMarkers(positions);
}

/**
 * 검색 결과를 지도에 마커로 표시
 */
function displaySearchResults(positions) {
    //기존 마커 제거
    currentMarkers.forEach(marker => marker.setMap(null));
    currentMarkers = [];

    if (positions.length === 0) {
        alert('검색 결과가 없습니다.');
        return;
    }
    displayMarkers(positions);
    setMapCenter(positions);
}


/**
 * 마커 표시
 */
function displayMarkers(positions) {
    positions.forEach(position => {
        //마커 생성
        const marker = new kakao.maps.Marker({
            map: map,
            position: position.latlng
        });

        //인포윈도우 생성
        const infowindow = new kakao.maps.InfoWindow({
            content: position.content
        });

        //마커를 배열에 추가
        currentMarkers.push(marker);
        
        //이벤트 리스너 등록
        kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
        kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
    });
}

/**
 * 지도 중심 설정
 */
function setMapCenter(positions) {
    //검색 결과 개수에 따라 확대 레벨 설정
    const zoomLevel = positions.length === 1 ? 5 : 12;
    map.setLevel(zoomLevel);
    
    //원형 지도의 중앙에 오도록 약간의 오프셋 조정
    const center = positions[0].latlng;
    const offset = 0.001; // 위도/경도 오프셋 값 (필요에 따라 조정)
    
    //원형 지도의 중앙에 오도록 약간 위로 이동
    const adjustedCenter = new kakao.maps.LatLng(
        center.getLat() + offset,
        center.getLng()
    );
    map.setCenter(adjustedCenter);
}

/**
 * 인포윈도우를 표시하는 이벤트 리스너를 반환
 */
function makeOverListener(map, marker, infowindow) {
    return function() {
        infowindow.open(map, marker);
    };
}

/**
 * 인포윈도우를 닫는 이벤트 리스너를 반환   
 */
function makeOutListener(infowindow) {
    return function() {
        infowindow.close();
    };
}

export { displaySearchResults };