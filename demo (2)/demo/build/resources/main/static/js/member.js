// 전역 함수로 팝업 열기
window.openMemberPopup = function () {
  const popup = document.getElementById("member-popup");
  const form = document.getElementById("member-form");
  if (!popup || !form) {
    console.error("❌ 팝업 또는 폼 요소를 찾을 수 없습니다.");
    return;
  }

  form.email.value = localStorage.getItem("email") || "";
  form.currentPassword.value = "";
  form.newPassword.value = "";
  form.role.value = localStorage.getItem("userType") || "CUSTOMER";

  popup.style.display = "block";
};

// 팝업 닫기
function closeMemberPopup() {
  const popup = document.getElementById("member-popup");
  if (popup) popup.style.display = "none";
}

// 비밀번호 유효성 검사
function isValidPassword(password) {
  return password.length >= 6 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

// 이벤트 연결
window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("member-form");
  const deleteBtn = document.getElementById("delete-user");

  if (!form) {
    console.error("❌ member-form not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("✅ form submitted");

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

    try {
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          currentPassword,
          newPassword
        })
      });

      const resultText = await res.text();
      console.log("🔁 응답 상태:", res.status);
      console.log("📩 응답 본문:", resultText);

      if (res.ok) {
        alert("비밀번호가 수정되었습니다.");
        closeMemberPopup();
      } else if (res.status === 401) {
        alert("현재 비밀번호가 일치하지 않습니다.");
      } else {
        alert("수정 실패: " + resultText);
      }
    } catch (err) {
      console.error("❌ fetch 오류:", err);
      alert("서버 오류가 발생했습니다.");
    }
  });

  if (deleteBtn) {
    deleteBtn.addEventListener("click", async () => {
      const email = form.email.value;
      if (!confirm("정말 탈퇴하시겠습니까?")) return;

      try {
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
      } catch (err) {
        console.error("❌ 탈퇴 요청 오류:", err);
        alert("탈퇴 처리 중 오류 발생");
      }
    });
  }
});