// login.js - fluxo de login usando AuthAPI

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-login');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const btn = document.querySelector('.btn-primary');

    if (!form || !emailInput || !senhaInput) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const senha = senhaInput.value;

        if (!email || !senha) {
            alert('Informe e-mail e senha.');
            return;
        }

        try {
            if (btn) {
                btn.disabled = true;
                btn.textContent = 'Entrando...';
            }

            const usuario = await AuthAPI.login(email, senha);
            // Direciona ao início (ajuste conforme necessidade)
            window.location.href = 'Pagina_inicio.html';
        } catch (err) {
            alert(err.message || 'Erro ao fazer login');
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.textContent = 'Entrar';
            }
        }
    });
});
