document.addEventListener("DOMContentLoaded", () => {
    
    const loginFormContainer = document.getElementById("login-form");
    const registerFormContainer = document.getElementById("register-form");
    const showRegisterLink = document.getElementById("show-register");
    const showLoginLink = document.getElementById("show-login");

    const loginForm = loginFormContainer.querySelector("form");
    const registerForm = registerFormContainer.querySelector("form");

    showRegisterLink.addEventListener("click", (e) => {
        e.preventDefault(); 
        loginFormContainer.classList.add("hidden");
        registerFormContainer.classList.remove("hidden");
    });

    showLoginLink.addEventListener("click", (e) => {
        e.preventDefault();
        registerFormContainer.classList.add("hidden");
        loginFormContainer.classList.remove("hidden");
    });

    // --- CONTROLE DE SUBMISSÃO (Preparo para o Backend) ---

    // Lidar com o envio do formulário de Login
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Impede o recarregamento da página

        // 1. Coletar os dados
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        // 2. Aqui você enviará os dados para seu backend (API)
        console.log("Tentativa de Login com:", { email, password });
        
        // Exemplo de como você faria no futuro:
        /*
        fetch('http://sua-api.com/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data); // Resposta do servidor
            // Se login OK, redireciona o usuário
        })
        .catch(error => console.error('Erro:', error));
        */
        
        alert("Login bem-sucedido! Redirecionando...");
    
        // Redireciona o usuário para a página principal (o quadro)
        window.location.href = 'index.html';
    });

    // Lidar com o envio do formulário de Cadastro
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Impede o recarregamento da página

        // 1. Coletar os dados
        const name = document.getElementById("reg-name").value;
        const email = document.getElementById("reg-email").value;
        const password = document.getElementById("reg-password").value;

        // 2. Aqui você enviará os dados para seu backend (API)
        console.log("Tentativa de Cadastro com:", { name, email, password });

        // Exemplo de como você faria no futuro:
        /*
        fetch('http://sua-api.com/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data); // Resposta do servidor
            // Se cadastro OK, talvez mostre o login
        })
        .catch(error => console.error('Erro:', error));
        */

        alert("Cadastro enviado! Verifique o console (F12).");
    });

});