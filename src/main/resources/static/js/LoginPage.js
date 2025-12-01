document.addEventListener("DOMContentLoaded", () => {
    console.log("login.js: DOMContentLoaded"); // debug

    const loginFormContainer = document.getElementById("login-form");
    const registerFormContainer = document.getElementById("register-form");
    const showRegisterLink = document.getElementById("show-register");
    const showLoginLink = document.getElementById("show-login");

    if (!loginFormContainer || !registerFormContainer) {
        console.error("login.js: containers not found", { loginFormContainer, registerFormContainer });
        return;
    }

    const loginForm = loginFormContainer.querySelector("form");
    const registerForm = registerFormContainer.querySelector("form");

    console.log("login.js: found forms", { loginFormExists: !!loginForm, registerFormExists: !!registerForm });

    showRegisterLink?.addEventListener("click", (e) => {
        e.preventDefault();
        loginFormContainer.classList.add("hidden");
        registerFormContainer.classList.remove("hidden");
    });

    showLoginLink?.addEventListener("click", (e) => {
        e.preventDefault();
        registerFormContainer.classList.add("hidden");
        loginFormContainer.classList.remove("hidden");
    });

    const loginButton = loginForm?.querySelector('button[type="submit"]');
    loginButton?.addEventListener("click", () => console.log("login.js: login button clicked"));

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            console.log("login.js: submit handler fired");

            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;
            console.log("login.js: credentials (email):", email);

            try {
                const response = await fetch("/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                    credentials: "same-origin"
                });

                console.log("login.js: POST /api/login status:", response.status, "redirected:", response.redirected);

                let body = null;
                try {
                    body = await response.clone().json();
                    console.log("login.js: response JSON:", body);
                } catch (err) {
                    console.log("login.js: response not JSON");
                }

                if (!response.ok) {
                    const msg = body?.message || `Erro ${response.status}`;
                    console.warn("login.js: login failed:", msg);
                    alert(msg);
                    return;
                }

                if (body && body.id) {
                    localStorage.setItem('loggedInUserId', String(body.id));
                    localStorage.setItem('userName', body.name);

                    window.location.href = "/MainPage.html";
                    return;
                }

                alert("Resposta inesperada do servidor.");
            } catch (err) {
                console.error("login.js: fetch error:", err);
                alert("Erro de rede ao tentar logar. Veja console/Network.");
            }
        });
    } else {
        console.warn("login.js: loginForm is null — submit listener not attached");
    }

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("reg-name").value;
            const email = document.getElementById("reg-email").value;
            const password = document.getElementById("reg-password").value;

            try {
                const response = await fetch("/api/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password }),
                    credentials: "same-origin"
                });

                const data = await response.json();
                console.log("login.js: register response:", data);
                if (response.ok) {
                    alert("Usuário cadastrado com sucesso! Faça login.");
                    registerFormContainer.classList.add("hidden");
                    loginFormContainer.classList.remove("hidden");
                } else {
                    alert(data.message || `Erro ${response.status}`);
                }
            } catch (err) {
                console.error("login.js: register fetch error:", err);
                alert("Erro de rede ao tentar cadastrar.");
            }
        });
    }
});