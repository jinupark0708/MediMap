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

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      alert("Login failed");
      return;
    }

    const data = await response.json();
    localStorage.setItem("userType", data.role);
    localStorage.setItem("email", data.email);
    window.location.href = "/main.html";
  });
});