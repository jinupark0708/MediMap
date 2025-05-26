window.openInventoryPopup = async function () {
  try {
    const res = await fetch("/api/pharmacies/all");
    if (!res.ok) throw new Error("약국 목록 조회 실패");
    const pharmacies = await res.json();

    // 기존 팝업 제거 (중복 방지)
    document.querySelectorAll(".inventory-popup").forEach(p => p.remove());

    const popup = document.createElement("div");
    popup.className = "popup inventory-popup";

    popup.innerHTML = `
      <style>
        .pharmacy-section {
          border-bottom: 1px solid #ccc;
          padding: 1rem 0;
        }
        .pharmacy-section:last-child {
          border-bottom: none;
        }
      </style>

      <h3>📦 재고 관리</h3>

      <div class="add-stock-form">
        <select id="add-pharmacy">
          ${pharmacies.map(p => `<option value="${p.id}">${p.name}</option>`).join("")}
        </select>
        <input type="text" id="add-drug" placeholder="약 이름" />
        <input type="number" id="add-qty" placeholder="수량" min="1" />
        <button onclick="handleAddStock()">+ 추가</button>
      </div>

      <div class="inventory-list">
        ${pharmacies.map(p => `
          <div class="pharmacy-section">
            <h4>${p.name}</h4>
            <p>${p.address}</p>
            <ul id="pharmacy-${p.id}-stock" class="stock-list"></ul>
          </div>
        `).join("")}
      </div>
      <button class="btn close-button" onclick="this.closest('.popup').remove()">닫기</button>
    `;

    document.body.appendChild(popup);

    for (const p of pharmacies) {
      try {
        const stockRes = await fetch(`/api/pharmacies/${p.id}/stock`);
        if (!stockRes.ok) throw new Error();
        const stockData = await stockRes.json();
        renderStockList(p.id, stockData.stockList);
      } catch (err) {
        alert(`${p.name} 약국의 재고 정보를 불러올 수 없습니다.`);
      }
    }
  } catch (err) {
    console.error("❌ 재고 팝업 로딩 실패:", err);
    alert("재고 목록을 불러오는 중 오류가 발생했습니다.");
  }
};

function renderStockList(pharmacyId, stockList) {
  const ul = document.getElementById(`pharmacy-${pharmacyId}-stock`);
  ul.innerHTML = stockList.map(item => `
    <li class="stock-item">
      <div class="stock-row">
        <span class="drug-label">
          ${item.drugName} - 수량: <span id="qty-${pharmacyId}-${item.drugName}">${item.quantity}</span>
        </span>
        <div class="quantity-buttons">
          <button onclick="handleChange(${pharmacyId}, '${item.drugName.replace(/'/g, "\\'")}', 1)">+1</button>
          <button onclick="handleChange(${pharmacyId}, '${item.drugName.replace(/'/g, "\\'")}', -1)">-1</button>
          <button onclick="handleChange(${pharmacyId}, '${item.drugName.replace(/'/g, "\\'")}', 10)">+10</button>
          <button onclick="handleChange(${pharmacyId}, '${item.drugName.replace(/'/g, "\\'")}', -10)">-10</button>
          <button onclick="handleDelete(${pharmacyId}, '${item.drugName.replace(/'/g, "\\'")}')">🗑 삭제</button>
        </div>
      </div>
    </li>
  `).join("");
}

async function handleChange(pharmacyId, drugName, change) {
  try {
    const res = await fetch("/api/inventory/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pharmacyId, drugName, change })
    });

    if (!res.ok) throw new Error("재고 변경 실패");

    const qtySpan = document.getElementById(`qty-${pharmacyId}-${drugName}`);
    let current = parseInt(qtySpan.textContent, 10);
    let updated = current + change;
    if (updated < 0) {
      alert("현재 재고가 0입니다.");
      return;
    }
    qtySpan.textContent = updated;
  } catch (err) {
    console.error("재고 변경 실패:", err);
    alert("재고 변경 중 오류 발생");
  }
}

async function handleAddStock() {
  const pharmacyId = document.getElementById("add-pharmacy").value;
  const drugName = document.getElementById("add-drug").value.trim();
  const quantity = parseInt(document.getElementById("add-qty").value, 10);

  if (!pharmacyId || !drugName || !quantity || quantity <= 0) {
    alert("모든 필드를 올바르게 입력해주세요.");
    return;
  }

  try {
    const checkRes = await fetch(`/api/pharmacies/${pharmacyId}/stock`);
    if (!checkRes.ok) throw new Error("재고 확인 실패");

    const stockData = await checkRes.json();
    const exists = stockData.stockList.some(s => s.drugName === drugName);

    if (exists) {
      alert("이미 해당 약국에 존재하는 약입니다.");
      return;
    }

    const addRes = await fetch("/api/inventory/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pharmacyId: Number(pharmacyId), drugName, change: quantity })
    });

    if (!addRes.ok) {
      const errText = await addRes.text();
      throw new Error(errText);
    }

    alert("✅ 품목이 추가되었습니다.");
    document.querySelector(".inventory-popup")?.remove();
    openInventoryPopup(); // 목록 새로고침
  } catch (err) {
    console.error("❌ 품목 추가 실패:", err);
    alert("추가 중 오류 발생: " + err.message);
  }
}

async function handleDelete(pharmacyId, drugName) {
  if (!confirm(`'${drugName}' 품목을 삭제하시겠습니까?`)) return;

  try {
    const res = await fetch(
      `/api/inventory/delete?pharmacyId=${pharmacyId}&drugName=${encodeURIComponent(drugName)}`,
      { method: "DELETE" }
    );

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText);
    }

    alert("🗑 품목이 삭제되었습니다.");
    document.querySelector(".inventory-popup")?.remove();
    openInventoryPopup(); // 재호출로 새로고침

  } catch (err) {
    console.error("❌ 삭제 실패:", err);
    alert("삭제 중 오류 발생: " + err.message);
  }
}