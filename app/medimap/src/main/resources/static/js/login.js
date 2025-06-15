document.addEventListener("DOMContentLoaded", () => {
  const signInBtn = document.getElementById("signIn");
  const signUpBtn = document.getElementById("signUp");
  const firstForm = document.getElementById("form1");
  const secondForm = document.getElementById("form2");
  const container = document.querySelector(".container");

  console.log("✅ login.js loaded");

  signInBtn.addEventListener("click", () => {
    container.classList.remove("right-panel-active");
  });

  signUpBtn.addEventListener("click", () => {
    container.classList.add("right-panel-active");
  });

  // 회원가입 처리
  firstForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = firstForm.querySelector('input[type="email"]').value;
    const password = firstForm.querySelector('input[type="password"]').value;
    const role = firstForm.querySelector('select[name="role"]').value;

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role })
    });

    if (!response.ok) {
      alert("회원가입 실패!");
      return;
    }

    alert("회원가입 성공! 로그인 해주세요.");
    container.classList.remove("right-panel-active");
  });

  // 로그인 처리
  secondForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = secondForm.email.value;
    const password = secondForm.password.value;

    console.log("EMAIL:", email);
    console.log("PASSWORD:", password);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const resultText = await response.text();

      if (!response.ok) {
        if (response.status === 401) {
          alert("❌ 비밀번호가 일치하지 않습니다.");
        } else {
          alert("🚫 로그인 실패: " + resultText);
        }
        return;
      }

      const data = JSON.parse(resultText);
      localStorage.setItem("userType", data.role);
      localStorage.setItem("email", data.email);
      alert("🎉 로그인에 성공했습니다. 환영합니다!");
      window.location.href = "/main.html";

    } catch (err) {
      console.error("❌ 로그인 요청 오류:", err);
      alert("서버 오류로 로그인할 수 없습니다.");
    }
  });
});