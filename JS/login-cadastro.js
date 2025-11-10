document.addEventListener("DOMContentLoaded", function () {
  const loginToggle = document.getElementById("login-toggle");
  const registerToggle = document.getElementById("register-toggle");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const loginEmail = document.getElementById("login-email");
  const registerName = document.getElementById("register-name");

  // Alternar entre Login e Cadastro
  loginToggle.addEventListener("click", function () {
    loginToggle.classList.add("active");
    registerToggle.classList.remove("active");
    loginForm.classList.add("active");
    registerForm.classList.remove("active");
    loginForm.setAttribute("aria-hidden", "false");
    registerForm.setAttribute("aria-hidden", "true");
    loginEmail.focus();
  });

  registerToggle.addEventListener("click", function () {
    registerToggle.classList.add("active");
    loginToggle.classList.remove("active");
    registerForm.classList.add("active");
    loginForm.classList.remove("active");
    registerForm.setAttribute("aria-hidden", "false");
    loginForm.setAttribute("aria-hidden", "true");
    registerName.focus();
  });

  // Login - validação básica
  document.getElementById("login").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    if (!email) {
      alert("Por favor, informe seu e-mail.");
      document.getElementById("login-email").focus();
      return;
    }

    if (!validateEmail(email)) {
      alert("Por favor, informe um e-mail válido.");
      document.getElementById("login-email").focus();
      return;
    }

    if (!password) {
      alert("Por favor, informe sua senha.");
      document.getElementById("login-password").focus();
      return;
    }

    // Aqui você pode adicionar integração com o backend
    alert("Login realizado com sucesso!\nEmail: " + email);
  });

  // Funções auxiliares para CPF
  function cleanCPF(cpf) {
    return (cpf || "").replace(/\D+/g, "");
  }

  function formatCPF(cpf) {
    cpf = cleanCPF(cpf);
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  // Funções auxiliares para CEP
  function cleanCEP(cep) {
    return (cep || "").replace(/\D+/g, "");
  }

  function formatCEP(cep) {
    cep = cleanCEP(cep);
    return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
  }

  // Funções auxiliares para Telefone
  function cleanPhone(phone) {
    return (phone || "").replace(/\D+/g, "");
  }

  function formatPhone(phone) {
    phone = cleanPhone(phone);
    if (phone.length <= 10) {
      return phone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  // Validar email
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validateCPF(cpf) {
    cpf = cleanCPF(cpf);

    if (!cpf || cpf.length !== 11) return false;

    // Elimina CPFs com todos dígitos iguais
    if (/^(\d)\1+$/.test(cpf)) return false;

    // Valida dígitos verificadores
    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  }

  // Máscara automática para CPF
  const cpfInput = document.getElementById("register-cpf");
  if (cpfInput) {
    cpfInput.addEventListener("input", function (e) {
      let value = cleanCPF(e.target.value);
      if (value.length <= 11) {
        e.target.value = formatCPF(value);
      }
    });
  }

  // Máscara automática para Telefone
  const phoneInput = document.getElementById("register-phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
      let value = cleanPhone(e.target.value);
      if (value.length <= 11) {
        e.target.value = formatPhone(value);
      }
    });
  }

  // Máscara automática para CEP
  const cepInput = document.getElementById("register-cep");
  if (cepInput) {
    cepInput.addEventListener("input", function (e) {
      let value = cleanCEP(e.target.value);
      if (value.length <= 8) {
        e.target.value = formatCEP(value);
      }
    });
  }

  // Converter estado para maiúsculas
  const stateInput = document.getElementById("register-state");
  if (stateInput) {
    stateInput.addEventListener("input", function (e) {
      e.target.value = e.target.value.toUpperCase();
    });
  }

  // Cadastro - validação completa
  document.getElementById("register").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const phone = document.getElementById("register-phone").value.trim();
    const cpf = document.getElementById("register-cpf").value.trim();
    const address = document.getElementById("register-address").value.trim();
    const number = document.getElementById("register-number").value.trim();
    const city = document.getElementById("register-city").value.trim();
    const state = document.getElementById("register-state").value.trim();
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const terms = document.getElementById("terms").checked;

    // Validações
    if (!name) {
      alert("Por favor, informe seu nome completo.");
      document.getElementById("register-name").focus();
      return;
    }

    if (!email || !validateEmail(email)) {
      alert("Por favor, informe um e-mail válido.");
      document.getElementById("register-email").focus();
      return;
    }

    if (!phone || cleanPhone(phone).length < 10) {
      alert("Por favor, informe um telefone válido (10 ou 11 dígitos).");
      document.getElementById("register-phone").focus();
      return;
    }

    if (!cpf) {
      alert("Por favor, informe seu CPF.");
      document.getElementById("register-cpf").focus();
      return;
    }

    if (!validateCPF(cpf)) {
      alert("CPF inválido. Por favor, verifique o número digitado.");
      document.getElementById("register-cpf").focus();
      return;
    }

    if (!cep || cleanCEP(cep).length !== 8) {
      alert("Por favor, informe um CEP válido (8 dígitos).");
      document.getElementById("register-cep").focus();
      return;
    }

    if (!address) {
      alert("Por favor, informe seu endereço.");
      document.getElementById("register-address").focus();
      return;
    }

    if (!number) {
      alert("Por favor, informe o número do endereço.");
      document.getElementById("register-number").focus();
      return;
    }

    if (!city) {
      alert("Por favor, informe a cidade.");
      document.getElementById("register-city").focus();
      return;
    }

    if (!state || state.length !== 2) {
      alert("Por favor, informe a UF (2 letras, ex: SP, RJ).");
      document.getElementById("register-state").focus();
      return;
    }

    if (!password || password.length < 6) {
      alert("A senha deve ter no mínimo 6 caracteres.");
      document.getElementById("register-password").focus();
      return;
    }

    if (password !== confirmPassword) {
      alert("As senhas não conferem. Por favor, tente novamente.");
      document.getElementById("confirm-password").focus();
      return;
    }

    if (!terms) {
      alert("Você precisa aceitar os termos de uso para continuar.");
      document.getElementById("terms").focus();
      return;
    }

    // Se chegou aqui, todos os dados são válidos
    alert(
      "Cadastro realizado com sucesso!\n\n" +
        "Nome: " +
        name +
        "\n" +
        "Email: " +
        email +
        "\n" +
        "CPF: " +
        formatCPF(cpf) +
        "\n" +
        "CEP: " +
        formatCEP(cep) +
        "\n" +
        "Endereço: " +
        address +
        ", " +
        number +
        "\n" +
        "Cidade: " +
        city +
        " - " +
        state
    );

  });
});
