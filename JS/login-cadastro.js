document.addEventListener("DOMContentLoaded", function () {
  const loginToggle = document.getElementById("login-toggle");
  const registerToggle = document.getElementById("register-toggle");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const loginEmail = document.getElementById("login-email");
  const registerName = document.getElementById("register-name");

  loginToggle.addEventListener("click", function () {
    loginToggle.classList.add("active");
    registerToggle.classList.remove("active");
    loginForm.classList.add("active");
    registerForm.classList.remove("active");
    loginEmail.focus();
  });

  registerToggle.addEventListener("click", function () {
    registerToggle.classList.add("active");
    loginToggle.classList.remove("active");
    registerForm.classList.add("active");
    loginForm.classList.remove("active");
    registerName.focus();
  });

  document.getElementById("login").addEventListener("submit", function (e) {
    e.preventDefault();
    // Aqui pode adicionar integração real ou feedback visual
  });

  document.getElementById("register").addEventListener("submit", function (e) {
    e.preventDefault();
    // Aqui pode adicionar integração real ou feedback visual
  });
});
