window.openPharmacyPopup = async function (id) {
  try {
    const res = await fetch(`/api/pharmacies/${id}/stock`);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();

    const popup = document.createElement("div");
    popup.className = "popup";
    popup.style.maxWidth = "400px";
    popup.style.maxHeight = "70vh";
    popup.style.overflowY = "auto";
    popup.style.padding = "1rem";
    popup.style.backgroundColor = "#fff";
    popup.style.border = "1px solid #ccc";
    popup.style.borderRadius = "10px";
    popup.style.position = "fixed";
    popup.style.top = "10%";
    popup.style.left = "50%";
    popup.style.transform = "translateX(-50%)";
    popup.style.zIndex = "3000";

    const stockHtml = data.stockList.map(item => `
      <li>${item.drugName} - 수량: ${item.quantity}</li>
    `).join("");

    popup.innerHTML = `
      <h3>약국 정보</h3>
      <p><strong>${data.name}</strong></p>
      <p>${data.address}</p>
      <h4>보유 약 목록</h4>
      <ul>${stockHtml}</ul>
      <button class="btn" onclick="this.parentNode.remove()">닫기</button>
    `;

    document.body.appendChild(popup);
  } catch (err) {
    console.error("Error:", err);
    alert("약국 정보를 불러오는 데 실패했습니다.");
  }
};