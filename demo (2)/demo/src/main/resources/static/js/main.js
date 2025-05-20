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
  document.getElementById("member-info-btn").addEventListener("click", openMemberPopup);

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

// ✅ 회원정보 팝업 로직
function openMemberPopup() {
  const popup = document.getElementById("member-popup");
  const form = document.getElementById("member-form");

  form.email.value = localStorage.getItem("email") || "";
  form.currentPassword.value = "";
  form.newPassword.value = "";
  form.role.value = localStorage.getItem("userType") || "CUSTOMER";

  popup.style.display = "block";
}

function closeMemberPopup() {
  document.getElementById("member-popup").style.display = "none";
}

// ✅ 새 비밀번호 유효성 검사 함수
function isValidPassword(password) {
  const minLength = password.length >= 6;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  return minLength && hasLetter && hasNumber;
}

document.getElementById("member-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const email = form.email.value;
  const currentPassword = form.currentPassword.value;
  const newPassword = form.newPassword.value;

  if (!currentPassword) {
    alert("현재 비밀번호를 입력해주세요.");
    return;
  }

  if (newPassword && !isValidPassword(newPassword)) {
    alert("새 비밀번호는 숫자/영문 포함 6자 이상이어야 합니다.");
    return;
  }

  const body = {
    email: email,
    currentPassword: currentPassword,
    newPassword: newPassword
  };

  const res = await fetch("/api/users/me", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (res.ok) {
    alert("비밀번호가 수정되었습니다.");
    closeMemberPopup();
  } else if (res.status === 401) {
    alert("현재 비밀번호가 일치하지 않습니다.");
  } else {
    alert("수정 실패");
  }
});

document.getElementById("delete-user").addEventListener("click", async () => {
  const email = document.getElementById("member-form").email.value;
  if (!confirm("정말 탈퇴하시겠습니까?")) return;

  const res = await fetch(`/api/users/me?email=${email}`, {
    method: "DELETE"
  });

  if (res.ok) {
    alert("탈퇴 완료");
    localStorage.clear();
    window.location.href = "/login.html";
  } else {
    alert("탈퇴 실패");
  }
});