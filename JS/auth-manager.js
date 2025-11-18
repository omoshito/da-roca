// Gerenciador de autenticação e interface do usuário

class AuthManager {
  constructor() {
    this.init();
  }

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.verificarStatusLogin();
    });
  }

  verificarStatusLogin() {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");

    const navList = document.querySelector(".main-nav ul");
    if (!navList) return;

    const loginItem = this.findLoginItem(navList);

    if (token && userData) {
      this.mostrarMenuUsuario(loginItem, userData);
    } else {
      this.mostrarLinkLogin(loginItem);
    }
  }

  findLoginItem(navList) {
    // Procura o item que contém o link de login
    return Array.from(navList.querySelectorAll("li")).find((li) => {
      const link = li.querySelector('a[href*="login-cadastro"]');
      return link !== null;
    });
  }

  mostrarMenuUsuario(loginItem, userData) {
    if (!loginItem) return;

    let user;
    try {
      user = JSON.parse(userData);
    } catch (e) {
      console.error("Erro ao parsear userData:", e);
      this.logout();
      return;
    }

    const nomeUsuario = user.nome || user.email?.split("@")[0] || "Usuário";

    loginItem.innerHTML = `
            <div class="user-menu">
                <button class="user-toggle" onclick="authManager.toggleUserMenu()" aria-label="Menu do usuário">
                    <i class='bx bx-user-circle'></i>
                    <span>Olá, ${nomeUsuario}</span>
                    <i class='bx bx-chevron-down'></i>
                </button>
                <div class="user-dropdown" id="userDropdown">
                    <a href="#" onclick="authManager.verPerfil()">
                        <i class='bx bx-user'></i> Meu Perfil
                    </a>
                    <a href="Carrinho.html">
                        <i class='bx bx-cart'></i> Meu Carrinho
                    </a>
                    <a href="#" onclick="authManager.logout()">
                        <i class='bx bx-log-out'></i> Sair
                    </a>
                </div>
            </div>
        `;
  }

  mostrarLinkLogin(loginItem) {
    if (!loginItem) return;

    loginItem.innerHTML = `<a href="login-cadastro.html">Entrar / Cadastrar</a>`;
  }

  toggleUserMenu() {
    const dropdown = document.getElementById("userDropdown");
    if (!dropdown) return;

    dropdown.classList.toggle("show");

    // Fechar o menu se clicar fora dele
    const closeMenu = (e) => {
      if (!e.target.closest(".user-menu")) {
        dropdown.classList.remove("show");
        document.removeEventListener("click", closeMenu);
      }
    };

    setTimeout(() => {
      document.addEventListener("click", closeMenu);
    }, 10);
  }

  verPerfil() {
    alert("Funcionalidade de perfil em desenvolvimento!");
  }

  logout() {
    if (confirm("Tem certeza que deseja sair?")) {
      // Limpar todos os dados do usuário
      this.limparDadosUsuario();

      // Mostrar mensagem e redirecionar
      this.mostrarMensagemLogout();
    }
  }

  limparDadosUsuario() {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("carrinho_daroca");
  }

  mostrarMensagemLogout() {
    // Criar notificação de logout
    const notification = document.createElement("div");
    notification.className = "logout-notification";
    notification.innerHTML = `
            <div class="notification-content">
                <i class='bx bx-check-circle'></i>
                <span>Logout realizado com sucesso!</span>
            </div>
        `;

    // Estilos da notificação
    Object.assign(notification.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      background: "linear-gradient(135deg, #28a745, #20c997)",
      color: "white",
      padding: "16px 20px",
      borderRadius: "12px",
      boxShadow: "0 8px 32px rgba(40, 167, 69, 0.3)",
      zIndex: "10000",
      animation: "slideInRight 0.4s ease",
      fontWeight: "500",
    });

    document.body.appendChild(notification);

    // Remover notificação e redirecionar
    setTimeout(() => {
      notification.remove();
      window.location.href = "Inicio.html";
    }, 2000);
  }

  // Método para verificar se o usuário está logado
  isLoggedIn() {
    return localStorage.getItem("token") !== null;
  }

  // Método para obter dados do usuário
  getUserData() {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  }

  // Atualizar status após login (chamar da página de login)
  updateLoginStatus() {
    this.verificarStatusLogin();
  }
}

// Criar instância global
const authManager = new AuthManager();

// Adicionar estilos CSS para o menu do usuário
const authStyles = document.createElement("style");
authStyles.textContent = `
    /* Estilos do menu do usuário */
    .user-menu {
        position: relative;
    }

    .user-toggle {
        display: flex;
        align-items: center;
        gap: 8px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px 16px;
        border-radius: 8px;
        transition: all 0.3s ease;
        color: #333;
        font-weight: 500;
        font-size: 0.95rem;
        font-family: inherit;
    }

    .user-toggle:hover {
        background-color: #f8f9fa;
        transform: translateY(-2px);
    }

    .user-toggle i:first-child {
        font-size: 1.5rem;
        color: #4caf50;
    }

    .user-toggle i:last-child {
        font-size: 1rem;
        transition: transform 0.3s ease;
    }

    .user-dropdown.show + .user-toggle i:last-child {
        transform: rotate(180deg);
    }

    .user-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        min-width: 200px;
        padding: 12px 0;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        z-index: 1000;
        border: 1px solid rgba(0, 0, 0, 0.08);
    }

    .user-dropdown.show {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }

    .user-dropdown a {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 20px;
        text-decoration: none;
        color: #333;
        transition: all 0.2s ease;
        font-size: 0.9rem;
    }

    .user-dropdown a:hover {
        background-color: #f8f9fa;
        color: #4caf50;
    }

    .user-dropdown a i {
        width: 18px;
        text-align: center;
        color: #666;
    }

    .user-dropdown a:hover i {
        color: #4caf50;
    }

    /* Separador visual no dropdown */
    .user-dropdown a:last-child {
        border-top: 1px solid #eee;
        margin-top: 8px;
        color: #dc3545;
    }

    .user-dropdown a:last-child:hover {
        background-color: #fff5f5;
        color: #dc3545;
    }

    .user-dropdown a:last-child i {
        color: #dc3545;
    }

    .user-dropdown a:last-child:hover i {
        color: #dc3545;
    }

    /* Animação da notificação */
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .logout-notification .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .logout-notification i {
        font-size: 1.2rem;
    }

    /* Responsividade para o menu do usuário */
    @media (max-width: 768px) {
        .user-toggle span {
            display: none;
        }
        
        .user-dropdown {
            right: -10px;
            min-width: 180px;
        }
    }
`;
document.head.appendChild(authStyles);
