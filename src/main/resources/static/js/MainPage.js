const API_BASE_URL = '/api/dashboards';
const DOM = {
    dashboardList: document.getElementById('dashboard-list'),
    newDashboardInput: document.getElementById('new-dashboard-name'),
    btnCreate: document.getElementById('btn-create-dashboard')
};

let draggedItem = null;

const DashboardService = {
    getHeaders: () => {
        const token = localStorage.getItem('authToken');
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    },

    getAuthData: () => {
        return {
            userId: localStorage.getItem('loggedInUserId'),
            userName: localStorage.getItem('userName')
        };
    },

    async getAll(userId) {
        const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
            method: 'GET',
            headers: this.getHeaders()
        });
        if (response.status === 404 || response.status === 204) return [];
        if (!response.ok) throw new Error(`Erro ao buscar dashboards: ${response.status}`);
        return await response.json();
    },

    async create(name, userId) {
        const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ dashboardName: name })
        });
        if (!response.ok) throw new Error('Erro ao criar dashboard');
        return await response.json();
    },

    async update(id, newName) {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify({ dashboardName: newName })
        });
        if (!response.ok) throw new Error('Erro ao atualizar dashboard');
        return await response.json();
    },

    async delete(id) {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders()
        });
        if (!response.ok) throw new Error('Erro ao excluir dashboard');
    }
};

function createDashboardCard(dashboard) {
    const cardLink = document.createElement('a');
    cardLink.className = 'dashboard-card draggable-item';
    cardLink.href = `/TaskPage.html?dashboardId=${dashboard.id}`;
    cardLink.id = `card-${dashboard.id}`;

    cardLink.draggable = true;

    cardLink.innerHTML = `
        <div class="card-visual">
            <div class="mini-column"><div class="mini-task"></div><div class="mini-task"></div></div>
            <div class="mini-column"><div class="mini-task"></div></div>
            <div class="mini-column"><div class="mini-task"></div><div class="mini-task"></div><div class="mini-task"></div></div>
        </div>
        <div class="card-footer">
            <span class="dashboard-name" id="name-${dashboard.id}" title="${dashboard.dashboardName}">
                ${dashboard.dashboardName}
            </span>
            <div class="card-actions">
                <button class="edit-btn-card" data-id="${dashboard.id}" data-action="edit" title="Editar">✏️</button>
                <button class="edit-btn-card" data-id="${dashboard.id}" data-action="delete" title="Excluir" style="color: #E74C3C;">🗑️</button>
            </div>
        </div>
    `;

    cardLink.addEventListener('click', (e) => handleCardClick(e, dashboard));

    cardLink.addEventListener('dragstart', () => {
        draggedItem = cardLink;
        cardLink.classList.add('dragging');
    });

    cardLink.addEventListener('dragend', () => {
        cardLink.classList.remove('dragging');
        draggedItem = null;
    });

    return cardLink;
}

function updateDashboardCount() {
    const countElement = document.getElementById('dashboard-count');
    if (countElement) {
        const currentCount = document.querySelectorAll('.dashboard-card').length;
        countElement.textContent = `(${currentCount})`;
    }
}

function renderDashboardList(dashboards) {
    DOM.dashboardList.innerHTML = '';

    if (!Array.isArray(dashboards) || dashboards.length === 0) {
        DOM.dashboardList.innerHTML = `
            <div style="text-align: center; color: #666; margin-top: 20px;">
                <p>Você ainda não tem nenhum dashboard.</p>
                <p>Crie um novo acima para começar!</p>
            </div>`;
        updateDashboardCount();
        return;
    }

    const grid = document.createElement('div');
    grid.className = 'dashboard-grid';

    grid.addEventListener('dragover', (e) => {
        e.preventDefault();

        const afterElement = getDragAfterElement(grid, e.clientX);
        
        const draggable = document.querySelector('.dragging');
        if (!draggable) return;

        if (afterElement == null) {
            grid.appendChild(draggable);
        } else {
            grid.insertBefore(draggable, afterElement);
        }
    });

    dashboards.forEach(dash => {
        grid.appendChild(createDashboardCard(dash));
    });

    DOM.dashboardList.appendChild(grid);
    updateDashboardCount();
}

function getDragAfterElement(container, x) {
    const draggableElements = [...container.querySelectorAll('.draggable-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();

        const boxCenter = box.left + box.width / 2;

        const offset = x - boxCenter;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

async function init() {
    const auth = DashboardService.getAuthData();
    if (!auth.userId) {
        window.location.href = "/LoginPage.html";
        return;
    }

    try {
        const dashboards = await DashboardService.getAll(auth.userId);
        renderDashboardList(dashboards);
    } catch (error) {
        console.error(error);
        DOM.dashboardList.innerHTML = `<p style="color: red;">Falha ao carregar dashboards.</p>`;
    }

    if (DOM.btnCreate) {
        DOM.btnCreate.addEventListener('click', handleCreateDashboard);
    }
}

async function handleCreateDashboard() {
    const name = DOM.newDashboardInput.value.trim();
    const auth = DashboardService.getAuthData();

    if (!name) return alert("Por favor, digite um nome para o dashboard.");

    try {
        await DashboardService.create(name, auth.userId);
        DOM.newDashboardInput.value = '';
        init();
    } catch (error) {
        alert("Erro ao criar dashboard: " + error.message);
    }
}

function handleCardClick(e, dashboard) {
    const btn = e.target.closest('button');

    if (btn) {
        e.preventDefault();
        e.stopPropagation();
        
        const action = btn.dataset.action;
        if (action === 'edit') editDashboard(dashboard.id, dashboard.dashboardName);
        if (action === 'delete') deleteDashboard(dashboard.id);
    }
}

async function editDashboard(id, currentName) {
    const newName = prompt("Renomear Dashboard:", currentName);

    if (newName && newName.trim() !== "" && newName !== currentName) {
        try {
            const updatedDash = await DashboardService.update(id, newName.trim());

            const nameElement = document.getElementById(`name-${id}`);
            if (nameElement) {
                nameElement.textContent = updatedDash.dashboardName;
                nameElement.title = updatedDash.dashboardName;
            }
        } catch (error) {
            console.error(error);
            alert("Não foi possível renomear o dashboard.");
        }
    }
}

async function deleteDashboard(id) {
    if (confirm("Tem certeza que deseja excluir este dashboard e todas as suas tarefas?")) {
        try {
            await DashboardService.delete(id);

            const cardElement = document.getElementById(`card-${id}`);
            if (cardElement) {
                cardElement.style.opacity = '0';
                
                setTimeout(() => {
                    cardElement.remove();
                    updateDashboardCount();

                    if (document.querySelectorAll('.dashboard-card').length === 0) {
                        renderDashboardList([]); 
                    }
                }, 300);
            } else {
                init();
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao excluir dashboard.");
        }
    }
}

document.addEventListener('DOMContentLoaded', init);