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

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault(); 

        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        try {
            const response = await fetch("/api/login", { // URL relativa
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "same-origin" // envia cookies/sessão
            });

            // se servidor redirecionou (fetch segue redirect por padrão)
            if (response.redirected) {
                window.location.href = response.url;
                return;
            }

            if (!response.ok) {
                const txt = await response.text().catch(() => "");
                throw new Error(txt || `Erro ${response.status}`);
            }

            // tenta ler JSON; se não tiver, redireciona para index
            let data;
            try {
                data = await response.json();
            } catch (err) {
                window.location.href = "/index.html";
                return;
            }

            if (data && data.status === "success") {
                window.location.href = "/index.html";
            } else {
                alert(data.message || "Falha no login");
            }
        } catch (err) {
            console.error("Login erro:", err);
            alert(err.message || "Erro de rede ao tentar logar");
        }
    });

    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("reg-name").value;
        const email = document.getElementById("reg-email").value;
        const password = document.getElementById("reg-password").value;

        fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
            credentials: "same-origin"
        })
        .then(response => response.json())
        .then(data => {
            console.log("Resposta do cadastro:", data);
            if (data.status === "success") {
                alert("Usuário cadastrado com sucesso!");
                registerFormContainer.classList.add("hidden");
                loginFormContainer.classList.remove("hidden");
            } else {
                alert(data.message || "Erro no cadastro!");
            }
        })
        .catch(err => console.error("Erro no fetch de cadastro:", err));
    });

});