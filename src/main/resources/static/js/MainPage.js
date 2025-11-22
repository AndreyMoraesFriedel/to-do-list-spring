const API_BASE_URL = '/api/dashboards'; 
const DASHBOARD_LIST_ELEMENT = document.getElementById('dashboard-list');

function getAuthData() {
    return {
        token: localStorage.getItem('authToken'),
        userId: localStorage.getItem('loggedInUserId'), 
        userName: localStorage.getItem('userName')
    };
}

async function fetchAndDisplayDashboards() {
    if (!DASHBOARD_LIST_ELEMENT) {
        console.error('MainPage.js: elemento #dashboard-list não encontrado no DOM.');
        return;
    }
    
    const auth = getAuthData();
    DASHBOARD_LIST_ELEMENT.innerHTML = '<p>Carregando dashboards...</p>';

    if (!auth.userId) {
        DASHBOARD_LIST_ELEMENT.innerHTML = '<p>Erro: Usuário não autenticado. Redirecionando...</p>';
        setTimeout(() => {
            window.location.href = "/login.html"; 
        }, 1500);
        return;
    }

    try {
        const url = `${API_BASE_URL}/user/${encodeURIComponent(auth.userId)}`;
        
        const headers = { 'Content-Type': 'application/json' };
        if (auth.token) headers['Authorization'] = `Bearer ${auth.token}`;

        const response = await fetch(url, {
            method: 'GET',
            headers
        });

        if (!response.ok) {
            const errorText = await response.text(); 
            console.error(`Erro ${response.status}:`, errorText);
            
            if (response.status === 404 || response.status === 204) {
                 renderDashboardList([], DASHBOARD_LIST_ELEMENT);
                 return;
            }

            throw new Error(`Falha ao buscar dashboards. Status: ${response.status}.`);
        }

        const rawResponseText = await response.text(); 
        
        let dashboards;
        try {
            dashboards = JSON.parse(rawResponseText);
            
        } catch (jsonError) {
            console.error('Erro ao fazer parse do JSON:', jsonError);
            console.error('Corpo da Resposta Recebida (texto):', rawResponseText);
            
            throw new Error(`Resposta inválida. Servidor retornou um formato não-JSON.`);
        }
        
        renderDashboardList(dashboards, DASHBOARD_LIST_ELEMENT);

    } catch (error) {
        console.error('Falha na operação:', error);
        DASHBOARD_LIST_ELEMENT.innerHTML = `<p style="color: red;">Ocorreu um erro: ${error.message}</p>`;
    }
}

function renderDashboardList(dashboards, container) {
    container.innerHTML = '';

    if (!Array.isArray(dashboards) || dashboards.length === 0) {
        container.innerHTML = '<p>Você ainda não tem nenhum dashboard cadastrado.</p>';
        return;
    }

    const ul = document.createElement('ul');
    ul.className = 'dashboard-list-items';

    dashboards.forEach(dashboard => {
        const li = document.createElement('li');
        li.className = 'dashboard-item';
        
        li.innerHTML = `
            <div class="dashboard-info">
                <strong>ID ${dashboard.id}:</strong> 
                <a href="/TaskPage.html?dashboardId=${dashboard.id}" class="dashboard-link">
                    ${dashboard.dashboardName}
                </a>
            </div>
            <button onclick="editDashboard(${dashboard.id})">Editar</button>
        `;
        ul.appendChild(li);
    });

    container.appendChild(ul);
}

function editDashboard(dashboardId) {
    alert(`Clicou em Editar o Dashboard ID: ${dashboardId}`);
}

document.addEventListener('DOMContentLoaded', fetchAndDisplayDashboards);

async function handleCreateDashboard() {
    const nameInput = document.getElementById('new-dashboard-name');
    const dashboardName = nameInput.value.trim();
    const auth = getAuthData();

    if (!dashboardName) {
        alert("Por favor, digite um nome para o dashboard.");
        return;
    }

    if (!auth.userId) {
        alert("Erro: Usuário não identificado.");
        return;
    }

    try {
        const url = `${API_BASE_URL}/user/${auth.userId}`;

        const headers = { 'Content-Type': 'application/json' };
        if (auth.token) headers['Authorization'] = `Bearer ${auth.token}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ dashboardName: dashboardName })
        });

        if (!response.ok) {
            throw new Error(`Erro ao criar dashboard: ${response.status}`);
        }

        alert("Dashboard criado com sucesso!");
        nameInput.value = ''; 
        fetchAndDisplayDashboards();

    } catch (error) {
        console.error(error);
        alert("Falha ao criar dashboard.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayDashboards();

    const btnCreate = document.getElementById('btn-create-dashboard');
    if (btnCreate) {
        btnCreate.addEventListener('click', handleCreateDashboard);
    }
});