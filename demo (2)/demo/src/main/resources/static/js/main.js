let map;
let pharmacyMarkers = [];
let activeInfoWindow = null;
let activeMarker = null;

function logout() {
  localStorage.removeItem("userType");
  localStorage.removeItem("email");
  window.location.href = "/login.html";
}

window.onload = function () {
  const userType = localStorage.getItem("userType") || "CUSTOMER";
  const userRoleText = document.querySelector(".user-role-text");
  if (userRoleText) {
    const formatted = userType.charAt(0) + userType.slice(1).toLowerCase();
    userRoleText.textContent = `Current User: ${formatted}`;
  }

  if (userType === "MANAGER") {
    const controls = document.querySelector(".top-inner");
    const manageBtn = document.createElement("button");
    manageBtn.textContent = "Manage Inventory";
    manageBtn.className = "btn";
    manageBtn.onclick = () => {
      window.location.href = "/inventory.html";
    };
    const memberBtn = controls.querySelector("button:last-child");
    controls.insertBefore(manageBtn, memberBtn);
  }

  map = new kakao.maps.Map(document.getElementById("map"), {
    center: new kakao.maps.LatLng(37.5665, 126.9780),
    level: 3
  });

  document.getElementById("gps-button").addEventListener("click", moveToCurrentLocation);
  // document.getElementById("searchBtn").addEventListener("click", handleDrugSearch);

  moveToCurrentLocation();
};

function moveToCurrentLocation() {
  if (!navigator.geolocation) {
    alert("이 브라우저는 위치 정보를 지원하지 않습니다.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const loc = new kakao.maps.LatLng(lat, lon);

      const markerImage = new kakao.maps.MarkerImage(
        "/images/locationMarker.png",
        new kakao.maps.Size(40, 40),
        { offset: new kakao.maps.Point(20, 20) }
      );

      new kakao.maps.Marker({
        map,
        position: loc,
        title: "현재 위치",
        image: markerImage
      });

      map.setCenter(loc);
      searchPharmaciesByMapCenter();
    },
    () => {
      alert("위치 정보를 가져올 수 없습니다.");
    }
  );
}

function searchPharmaciesByMapCenter() {
  const ps = new kakao.maps.services.Places();
  const center = map.getCenter();

  ps.keywordSearch("약국", (data, status) => {
    if (status !== kakao.maps.services.Status.OK) {
      console.warn("약국 검색 실패:", status);
      return;
    }

    clearPharmacyMarkers();

    data.forEach(place => {
      const markerImage = new kakao.maps.MarkerImage(
        "/images/pharmacyMarker.png",
        new kakao.maps.Size(30, 30),
        { offset: new kakao.maps.Point(15, 30) }
      );

      const marker = new kakao.maps.Marker({
        map,
        position: new kakao.maps.LatLng(place.y, place.x),
        title: place.place_name,
        image: markerImage
      });

      const info = new kakao.maps.InfoWindow({
        content: `
          <div style="padding: 8px 12px;">
            <strong>${place.place_name}</strong><br/>
            <span style="font-size: 0.9rem;">${place.address_name}</span>
          </div>`
      });

      kakao.maps.event.addListener(marker, 'click', () => {
        if (activeInfoWindow && activeMarker === marker) {
          activeInfoWindow.close();
          activeInfoWindow = null;
          activeMarker = null;
        } else {
          if (activeInfoWindow) activeInfoWindow.close();
          info.open(map, marker);
          activeInfoWindow = info;
          activeMarker = marker;
        }
      });

      pharmacyMarkers.push(marker);
    });
  }, {
    location: center,
    radius: 2000,
    sort: kakao.maps.services.SortBy.DISTANCE
  });
}

function clearPharmacyMarkers() {
  pharmacyMarkers.forEach(marker => marker.setMap(null));
  pharmacyMarkers = [];
}

// 🔍 검색 버튼 클릭 시 약 검색 처리 함수 (다음 단계에 구현 예정)
function handleDrugSearch() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) return alert("약 이름을 입력해주세요.");

  // 향후 구현: 약 검색 → 상세정보 + 판매 약국 표시
  console.log("검색어:", query);
}