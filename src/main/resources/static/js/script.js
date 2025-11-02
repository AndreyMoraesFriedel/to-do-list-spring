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

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault(); 

        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

            fetch("http://localhost:8080/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
            })


        .then(response => {
            if (!response.ok) throw new Error('Email ou senha inválidos');
            return response.json();
        })

        .then(data => {
            if (data.status === 'success') {
                window.location.href = 'index.html';
            }
        })

    });

    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("reg-name").value;
        const email = document.getElementById("reg-email").value;
        const password = document.getElementById("reg-password").value;

        fetch("http://localhost:8080/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Resposta do cadastro:", data);
            if (data.status === "success") {
                alert("Usuário cadastrado com sucesso!");
                // troca pra tela de login automaticamente
                registerFormContainer.classList.add("hidden");
                loginFormContainer.classList.remove("hidden");
            } else {
                alert(data.message || "Erro no cadastro!");
            }
        })
        .catch(err => console.error("Erro no fetch de cadastro:", err));
    });

});