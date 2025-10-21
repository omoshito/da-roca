// Login e Cadastro - JavaScript para Da Roça
document.addEventListener("DOMContentLoaded", function () {
  // Elementos principais
  const loginToggle = document.getElementById("login-toggle");
  const registerToggle = document.getElementById("register-toggle");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const loginFormElement = document.getElementById("login");
  const registerFormElement = document.getElementById("register");

  // Alternância entre formulários
  loginToggle.addEventListener("click", function () {
    showLoginForm();
  });

  registerToggle.addEventListener("click", function () {
    showRegisterForm();
  });

  function showLoginForm() {
    loginToggle.classList.add("active");
    registerToggle.classList.remove("active");
    loginForm.classList.add("active");
    registerForm.classList.remove("active");
    clearAllErrors();
  }

  function showRegisterForm() {
    registerToggle.classList.add("active");
    loginToggle.classList.remove("active");
    registerForm.classList.add("active");
    loginForm.classList.remove("active");
    clearAllErrors();
  }

  // Labels flutuantes
  function setupFloatingLabels() {
    const inputs = document.querySelectorAll(".input-group input");

    inputs.forEach((input) => {
      const inputGroup = input.closest(".input-group");

      // Verifica se o input já tem valor no carregamento
      if (input.value.trim() !== "") {
        inputGroup.classList.add("focused");
      }

      // Evento de foco
      input.addEventListener("focus", function () {
        inputGroup.classList.add("focused");
      });

      // Evento de perda de foco
      input.addEventListener("blur", function () {
        if (input.value.trim() === "") {
          inputGroup.classList.remove("focused");
        }
      });

      // Evento de input para manter o label flutuante
      input.addEventListener("input", function () {
        if (input.value.trim() !== "") {
          inputGroup.classList.add("focused");
        } else {
          inputGroup.classList.remove("focused");
        }
      });
    });
  }

  // Máscara de telefone
  function setupPhoneMask() {
    const phoneInput = document.getElementById("register-phone");
    if (phoneInput) {
      phoneInput.addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, "");

        if (value.length <= 11) {
          if (value.length <= 10) {
            value = value.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
          } else {
            value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
          }
        }

        e.target.value = value;
      });
    }
  }

  // Validação de email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validação de telefone
  function isValidPhone(phone) {
    const cleanPhone = phone.replace(/\D/g, "");
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
  }

  // Mostrar erro em campo
  function showFieldError(input, message) {
    const inputGroup = input.closest(".input-group");
    inputGroup.classList.add("error");

    let errorElement = inputGroup.querySelector(".error-message");
    if (!errorElement) {
      errorElement = document.createElement("span");
      errorElement.className = "error-message";
      inputGroup.appendChild(errorElement);
    }
    errorElement.textContent = message;
    errorElement.setAttribute("role", "alert");
  }

  // Limpar erro de campo
  function clearFieldError(input) {
    const inputGroup = input.closest(".input-group");
    inputGroup.classList.remove("error");

    const errorElement = inputGroup.querySelector(".error-message");
    if (errorElement) {
      errorElement.remove();
    }
  }

  // Limpar todos os erros
  function clearAllErrors() {
    const errorElements = document.querySelectorAll(".error-message");
    const errorGroups = document.querySelectorAll(".input-group.error");

    errorElements.forEach((el) => el.remove());
    errorGroups.forEach((group) => group.classList.remove("error"));
  }

  // Estado de loading do botão
  function setLoadingState(button, loading) {
    const span = button.querySelector("span");
    const icon = button.querySelector("i");

    if (loading) {
      button.disabled = true;
      button.classList.add("loading");
      span.textContent = "Aguarde...";
      icon.className = "bx bx-loader-alt bx-spin";
    } else {
      button.disabled = false;
      button.classList.remove("loading");

      if (button.closest("#login-form")) {
        span.textContent = "Entrar";
        icon.className = "bx bx-right-arrow-alt";
      } else {
        span.textContent = "Criar conta";
        icon.className = "bx bx-right-arrow-alt";
      }
    }
  }

  // Notificação de sucesso
  function showSuccess(message) {
    const notification = document.createElement("div");
    notification.className = "notification success";
    notification.innerHTML = `
      <i class="bx bx-check-circle"></i>
      <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // Validação do formulário de login
  if (loginFormElement) {
    loginFormElement.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("login-email");
      const password = document.getElementById("login-password");
      const submitBtn = this.querySelector(".submit-btn");

      // Limpar erros anteriores
      clearFieldError(email);
      clearFieldError(password);

      let isValid = true;

      // Validar email
      if (!email.value.trim()) {
        showFieldError(email, "E-mail é obrigatório");
        isValid = false;
      } else if (!isValidEmail(email.value)) {
        showFieldError(email, "E-mail inválido");
        isValid = false;
      }

      // Validar senha
      if (!password.value.trim()) {
        showFieldError(password, "Senha é obrigatória");
        isValid = false;
      } else if (password.value.length < 6) {
        showFieldError(password, "Senha deve ter pelo menos 6 caracteres");
        isValid = false;
      }

      if (isValid) {
        setLoadingState(submitBtn, true);

        // Simular requisição de login
        setTimeout(() => {
          console.log("Dados do login:", {
            email: email.value,
            password: password.value,
            remember: document.getElementById("remember").checked,
          });

          // Simular sucesso (substituir pela lógica real)
          const success = true;

          if (success) {
            showSuccess("Login realizado com sucesso!");
            setTimeout(() => {
              window.location.href = "inicio.html";
            }, 1500);
          } else {
            showFieldError(email, "E-mail ou senha incorretos");
            showFieldError(password, "E-mail ou senha incorretos");
          }

          setLoadingState(submitBtn, false);
        }, 2000);
      }
    });
  }

  // Validação do formulário de cadastro
  if (registerFormElement) {
    registerFormElement.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("register-name");
      const email = document.getElementById("register-email");
      const phone = document.getElementById("register-phone");
      const password = document.getElementById("register-password");
      const confirmPassword = document.getElementById("confirm-password");
      const terms = document.getElementById("terms");
      const submitBtn = this.querySelector(".submit-btn");

      // Limpar erros anteriores
      clearFieldError(name);
      clearFieldError(email);
      clearFieldError(phone);
      clearFieldError(password);
      clearFieldError(confirmPassword);

      let isValid = true;

      // Validar nome
      if (!name.value.trim()) {
        showFieldError(name, "Nome é obrigatório");
        isValid = false;
      } else if (name.value.trim().length < 3) {
        showFieldError(name, "Nome deve ter pelo menos 3 caracteres");
        isValid = false;
      }

      // Validar email
      if (!email.value.trim()) {
        showFieldError(email, "E-mail é obrigatório");
        isValid = false;
      } else if (!isValidEmail(email.value)) {
        showFieldError(email, "E-mail inválido");
        isValid = false;
      }

      // Validar telefone
      if (!phone.value.trim()) {
        showFieldError(phone, "Telefone é obrigatório");
        isValid = false;
      } else if (!isValidPhone(phone.value)) {
        showFieldError(phone, "Telefone inválido");
        isValid = false;
      }

      // Validar senha
      if (!password.value.trim()) {
        showFieldError(password, "Senha é obrigatória");
        isValid = false;
      } else if (password.value.length < 6) {
        showFieldError(password, "Senha deve ter pelo menos 6 caracteres");
        isValid = false;
      }

      // Validar confirmação de senha
      if (!confirmPassword.value.trim()) {
        showFieldError(confirmPassword, "Confirmação de senha é obrigatória");
        isValid = false;
      } else if (password.value !== confirmPassword.value) {
        showFieldError(confirmPassword, "Senhas não coincidem");
        isValid = false;
      }

      // Validar termos
      if (!terms.checked) {
        const termsGroup = terms.closest(".checkbox-container");
        termsGroup.style.outline = "2px solid #e53e3e";
        setTimeout(() => {
          termsGroup.style.outline = "none";
        }, 3000);
        isValid = false;
      }

      if (isValid) {
        setLoadingState(submitBtn, true);

        // Simular requisição de cadastro
        setTimeout(() => {
          console.log("Dados do cadastro:", {
            name: name.value,
            email: email.value,
            phone: phone.value,
            password: password.value,
          });

          // Simular sucesso (substituir pela lógica real)
          const success = true;

          if (success) {
            showSuccess("Conta criada com sucesso!");
            setTimeout(() => {
              window.location.href = "inicio.html";
            }, 1500);
          } else {
            showFieldError(email, "E-mail já está em uso");
          }

          setLoadingState(submitBtn, false);
        }, 2000);
      }
    });
  }

  // Inicializar funcionalidades
  setupFloatingLabels();
  setupPhoneMask();

  // Mostrar formulário de login por padrão
  showLoginForm();
});
