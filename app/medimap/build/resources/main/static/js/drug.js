function setupDrugSearch() {
  const searchBtn = document.getElementById("searchBtn");
  const input = document.getElementById("searchInput");

  if (!searchBtn || !input) {
    console.error("❌ Search 버튼 또는 input을 찾을 수 없습니다.");
    return;
  }

  searchBtn.addEventListener("click", async () => {
    const keyword = input.value.trim();
    if (!keyword) {
      alert("약 이름을 입력해주세요.");
      return;
    }

    console.log("🔍 검색어:", keyword);

    try {
      const listRes = await fetch(`/api/drugs?name=${encodeURIComponent(keyword)}`);
      const list = await listRes.json();
      console.log("📦 API 응답:", list);

      if (!list.length) {
        alert("해당 이름의 약을 찾을 수 없습니다.");
        return;
      }

      const drug = list[0];
      const detailRes = await fetch(`/api/drugs/${drug.id}`);
      const detail = await detailRes.json();

      const pharmacyRes = await fetch(`/api/drugs/${drug.id}/pharmacies`);
      const pharmacies = await pharmacyRes.json();

      // ✅ 이미지 경로 처리 (기본 이미지 fallback)
      const imagePath = detail.imageUrl ? `/${detail.imageUrl}` : '/images/default.png';

      const html = `
        <img src="${imagePath}" alt="${detail.name}" style="width: 100px;" />
        <h4>${detail.name}</h4>
        <p><strong>효능:</strong> ${detail.efficacy}</p>
        <p><strong>용법:</strong> ${detail.dosage}</p>
        <p><strong>주의사항:</strong> ${detail.caution}</p>
        <h5>판매 약국</h5>
        <ul>
          ${Array.isArray(pharmacies) ? pharmacies.map(p => `
            <li>${p.name} (${p.address}) - 수량: ${p.quantity}</li>
          `).join("") : `<li>판매 정보 없음</li>`}
        </ul>
      `;

      showDrugPopup(html);
    } catch (err) {
      console.error("🔴 검색 오류:", err);
      alert("검색 중 오류가 발생했습니다.");
    }
  });
}

function showDrugPopup(html) {
  const popup = document.getElementById("drug-popup");
  const container = document.getElementById("drug-details");
  if (container && popup) {
    container.innerHTML = html;
    popup.style.display = "block";
  }
}

function closeDrugPopup() {
  const popup = document.getElementById("drug-popup");
  if (popup) popup.style.display = "none";
}