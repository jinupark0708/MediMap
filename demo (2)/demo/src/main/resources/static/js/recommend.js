let currentQuestionIndex = 0;
let questions = [];
let answers = {};

window.openSymptomPopup = function () {
  const popup = document.getElementById("symptom-popup");

  // ✅ 팝업 내용 초기화
  popup.innerHTML = `
    <h3>증상 기반 약 추천</h3>
    <div id="symptom-question-box" style="margin: 1rem 0;">
      <p id="symptom-question-text">질문이 여기에 표시됩니다.</p>
      <div style="margin-top: 1rem;">
        <button class="btn answer-btn" id="answer-yes" onclick="handleAnswer(true)">O</button>
        <button class="btn answer-btn" id="answer-no" onclick="handleAnswer(false)">X</button>
      </div>
    </div>
    <div style="margin-top: 1rem;">
      <button class="btn" onclick="prevQuestion()">← 이전</button>
      <button class="btn" onclick="nextQuestion()">다음 →</button>
    </div>
    <div style="margin-top: 1.5rem;">
      <button class="btn" onclick="closeSymptomPopup()">닫기</button>
    </div>
  `;

  // ✅ 선택 상태 스타일 다시 삽입
  const styleTag = document.createElement("style");
  styleTag.innerHTML = `
    .answer-btn.selected {
      background-color: #3c82f6;
      color: white;
      font-weight: bold;
      border: 2px solid #1d4ed8;
    }
  `;
  popup.appendChild(styleTag);

  // ✅ 팝업 열기
  popup.style.display = "block";

  // ✅ 질문 가져오기
  fetch("/api/recommendation/questions")
    .then(res => res.json())
    .then(data => {
      questions = data;
      currentQuestionIndex = 0;
      answers = {};
      renderQuestion();
    });
};

function closeSymptomPopup() {
  const popup = document.getElementById("symptom-popup");
  popup.style.display = "none";
}

function renderQuestion() {
  const text = document.getElementById("symptom-question-text");
  const q = questions[currentQuestionIndex];
  text.textContent = `${currentQuestionIndex + 1}. ${q.question}`;

  document.querySelectorAll(".answer-btn").forEach(btn => {
    btn.classList.remove("selected");
  });

  const answer = answers[q.id];
  if (answer === true) {
    document.getElementById("answer-yes").classList.add("selected");
  } else if (answer === false) {
    document.getElementById("answer-no").classList.add("selected");
  }
}

function handleAnswer(isYes) {
  const id = questions[currentQuestionIndex].id;
  answers[id] = isYes;
  renderQuestion(); // ✅ 선택 즉시 반영
}

function nextQuestion() {
  const currentQ = questions[currentQuestionIndex];
  const answer = answers[currentQ.id];

  // ❗답변이 없으면 경고 후 진행 막기
  if (answer !== true && answer !== false) {
    alert("답변을 선택해주세요.");
    return;
  }

  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    renderQuestion();
  } else {
    submitRecommendation();
  }
}

function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuestion();
  }
}

function submitRecommendation() {
  fetch("/api/recommendation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers })
  })
    .then(async res => {
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`❌ 서버 응답 오류: ${res.status} - ${text}`);
      }
      return res.json();
    })
    .then(async drugs => {
      const popup = document.getElementById("symptom-popup");

      if (!Array.isArray(drugs) || drugs.length === 0) {
        popup.innerHTML = `
          <h3>증상 추천 결과:</h3>
          <p>추천할 약이 없습니다.</p>
          <button class="btn" onclick="closeSymptomPopup()">닫기</button>
        `;
        return;
      }

      // 중복 제거
      const seen = new Set();
      const uniqueDrugs = drugs.filter(drug => {
        if (seen.has(drug.id)) return false;
        seen.add(drug.id);
        return true;
      });

      // 💊 각 약에 대해 약국 데이터 fetch
      const drugHtmlPromises = uniqueDrugs.map(async drug => {
        const pharmacyRes = await fetch(`/api/drugs/${drug.id}/pharmacies`);
        const pharmacies = await pharmacyRes.json();

        const pharmacyListHtml = Array.isArray(pharmacies) && pharmacies.length
          ? pharmacies.map(p => `
              <li>${p.name} (${p.address}) - 수량: ${p.quantity}</li>
            `).join("")
          : "<li>판매 약국 정보 없음</li>";

        return `
          <div style="margin-bottom: 2rem; border-bottom: 1px solid #ddd; padding-bottom: 1rem;">
            <img src="/${drug.imageUrl}" style="width: 100px; margin-bottom: 0.5rem;"><br/>
            <strong>${drug.name}</strong><br/>
            <p><strong>효능:</strong> ${drug.efficacy}</p>
            <p><strong>용법:</strong> ${drug.dosage}</p>
            <p><strong>주의사항:</strong> ${drug.caution}</p>
            <p><strong>판매 약국:</strong></p>
            <ul>${pharmacyListHtml}</ul>
          </div>
        `;
      });

      const drugHtmlList = await Promise.all(drugHtmlPromises);

      popup.innerHTML = `
        <h3>증상 추천 결과:</h3>
        <div style="height: 16px;"></div> <!-- ✅ 제목과 첫 약 사이 여백 -->
        ${drugHtmlList.join("")}
        <button class="btn" onclick="closeSymptomPopup()">닫기</button>
      `;
    })
    .catch(err => {
      console.error("❌ 추천 오류:", err);
      alert("추천 요청 중 문제가 발생했습니다.");
    });
}