// Interatividade para formulários de Login e Cadastro
document.addEventListener('DOMContentLoaded', function () {

    // Animação de entrada para form containers
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
        formContainer.style.opacity = '0';
        formContainer.style.transform = 'translateY(30px)';

        setTimeout(() => {
            formContainer.style.transition = 'all 0.6s ease';
            formContainer.style.opacity = '1';
            formContainer.style.transform = 'translateY(0)';
        }, 200);
    }

    // Efeitos nos inputs
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="date"]');
    inputs.forEach(input => {
        // Efeito de foco
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function () {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });

        // Validação em tempo real
        input.addEventListener('input', function () {
            validateInput(this);
        });
    });

    // Validação de formulário
    function validateInput(input) {
        const inputGroup = input.parentElement;
        let isValid = true;
        let errorMessage = '';

        // Remove mensagens de erro anteriores
        const existingError = inputGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        inputGroup.classList.remove('error', 'success');

        // Validações específicas
        switch (input.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (input.value && !emailRegex.test(input.value)) {
                    isValid = false;
                    errorMessage = 'E-mail inválido';
                }
                break;

            case 'password':
                if (input.value && input.value.length < 6) {
                    isValid = false;
                    errorMessage = 'Senha deve ter pelo menos 6 caracteres';
                }
                break;

            case 'text':
                if (input.name === 'nome' && input.value && input.value.length < 2) {
                    isValid = false;
                    errorMessage = 'Nome deve ter pelo menos 2 caracteres';
                }
                break;
        }

        // Aplica estilos baseados na validação
        if (input.value !== '') {
            if (isValid) {
                inputGroup.classList.add('success');
            } else {
                inputGroup.classList.add('error');
                showErrorMessage(inputGroup, errorMessage);
            }
        }
    }

    function showErrorMessage(inputGroup, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        inputGroup.appendChild(errorDiv);
    }

    // Animação do botão de submit
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.addEventListener('click', function (e) {
            e.preventDefault();

            // Adiciona efeito de loading
            const originalText = this.textContent;
            this.textContent = 'Processando...';
            this.disabled = true;

            // Valida todos os campos
            let allValid = true;
            inputs.forEach(input => {
                if (input.hasAttribute('required') && input.value === '') {
                    allValid = false;
                    input.parentElement.classList.add('error');
                    showErrorMessage(input.parentElement, 'Este campo é obrigatório');
                } else {
                    validateInput(input);
                    if (input.parentElement.classList.contains('error')) {
                        allValid = false;
                    }
                }
            });

            // Simula processamento
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;

                if (allValid) {
                    showSuccessMessage('Dados enviados com sucesso!');
                    // Aqui você adicionaria a lógica real de envio
                } else {
                    showErrorMessage(document.querySelector('.form-container'), 'Por favor, corrija os erros abaixo');
                }
            }, 1500);
        });
    }

    function showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-notification';
        successDiv.textContent = message;
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4fc16e;
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            box-shadow: 0 4px 12px rgba(79, 193, 110, 0.4);
            z-index: 1000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(successDiv);

        setTimeout(() => {
            successDiv.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            successDiv.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(successDiv);
            }, 300);
        }, 3000);
    }

    // Efeito de parallax suave no header (página inicial)
    if (window.location.pathname.includes('Pagina_inicio.html') || window.location.pathname.endsWith('/')) {
        window.addEventListener('scroll', function () {
            const header = document.querySelector('header');
            if (header) {
                const scrolled = window.pageYOffset;
                const parallax = scrolled * 0.5;
                header.style.transform = `translateY(${parallax}px)`;
            }
        });
    }

    // Menu responsivo
    const createMobileMenu = () => {
        const nav = document.querySelector('nav');
        if (nav && window.innerWidth <= 768) {
            const menuToggle = document.createElement('button');
            menuToggle.innerHTML = '☰';
            menuToggle.className = 'mobile-menu-toggle';
            menuToggle.style.cssText = `
                display: block;
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 10px;
                border-radius: 5px;
                background: rgba(255, 255, 255, 0.2);
            `;

            menuToggle.addEventListener('click', function () {
                nav.classList.toggle('active');
            });

            const menu = document.querySelector('.menu');
            if (menu) {
                menu.appendChild(menuToggle);
            }
        }
    };

    createMobileMenu();
    window.addEventListener('resize', createMobileMenu);
});