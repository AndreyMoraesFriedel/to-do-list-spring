/**
 * MainPage.js
 * Gerenciamento de Dashboards (Listagem, Criação, Edição e Exclusão)
 */

const API_BASE_URL = '/api/dashboards';
const DOM = {
    dashboardList: document.getElementById('dashboard-list'),
    newDashboardInput: document.getElementById('new-dashboard-name'),
    btnCreate: document.getElementById('btn-create-dashboard')
};

// Variável global para rastrear o item sendo arrastado
let draggedItem = null;

// ==================================================================================
// 1. SERVICE LAYER (Comunicação com API)
// ==================================================================================
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

// ==================================================================================
// 2. UI LAYER (Renderização e Manipulação do DOM)
// ==================================================================================

function createDashboardCard(dashboard) {
    const cardLink = document.createElement('a');
    // Adiciona classe 'draggable-item' para facilitar a seleção na lógica de drag
    cardLink.className = 'dashboard-card draggable-item';
    cardLink.href = `/TaskPage.html?dashboardId=${dashboard.id}`;
    cardLink.id = `card-${dashboard.id}`;
    
    // ATIVA O ARRASTAR
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

    // Event Delegation para botões dentro do card
    cardLink.addEventListener('click', (e) => handleCardClick(e, dashboard));

    // --- NOVOS EVENTOS DE DRAG-AND-DROP NO CARD ---
    cardLink.addEventListener('dragstart', () => {
        draggedItem = cardLink;
        cardLink.classList.add('dragging'); // Adiciona estilo visual (ex: opacidade)
    });

    cardLink.addEventListener('dragend', () => {
        cardLink.classList.remove('dragging');
        draggedItem = null;
    });

    return cardLink;
}

// Função auxiliar para atualizar o contador
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
        updateDashboardCount(); // Atualiza contador para (0)
        return;
    }

    const grid = document.createElement('div');
    grid.className = 'dashboard-grid';
    
    // --- LÓGICA DE DRAG-AND-DROP NA GRID (CONTAINER) ---
    grid.addEventListener('dragover', (e) => {
        e.preventDefault(); // Necessário para permitir o drop
        
        // Calcula qual elemento está logo DEPOIS da posição atual do mouse (eixo X)
        const afterElement = getDragAfterElement(grid, e.clientX);
        
        const draggable = document.querySelector('.dragging');
        if (!draggable) return;

        if (afterElement == null) {
            // Se não há elemento depois, adiciona ao final da lista
            grid.appendChild(draggable);
        } else {
            // Insere antes do elemento encontrado
            grid.insertBefore(draggable, afterElement);
        }
    });

    dashboards.forEach(dash => {
        grid.appendChild(createDashboardCard(dash));
    });

    DOM.dashboardList.appendChild(grid);
    updateDashboardCount(); // Atualiza contador com o total
}

/**
 * Função que calcula onde soltar o card baseado na posição X do mouse.
 * Retorna o elemento que deve ficar DEPOIS do card que estamos arrastando.
 */
function getDragAfterElement(container, x) {
    // Seleciona todos os cards arrastáveis que NÃO são o que está sendo movido agora
    const draggableElements = [...container.querySelectorAll('.draggable-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        
        // Calcula o centro horizontal do box
        const boxCenter = box.left + box.width / 2;
        
        // Diferença entre o cursor do mouse e o centro do elemento
        const offset = x - boxCenter;

        // Queremos o offset que seja negativo (mouse à esquerda do centro) 
        // e o mais próximo de 0 (o elemento imediatamente à direita)
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}


// ==================================================================================
// 3. HANDLERS & LOGIC
// ==================================================================================

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

    // Configura Listeners Globais
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
        init(); // Recarrega a lista para incluir o novo item
    } catch (error) {
        alert("Erro ao criar dashboard: " + error.message);
    }
}

function handleCardClick(e, dashboard) {
    const btn = e.target.closest('button');
    
    // Se clicou em um botão, impede a navegação do link
    if (btn) {
        e.preventDefault();
        e.stopPropagation();
        
        const action = btn.dataset.action;
        if (action === 'edit') editDashboard(dashboard.id, dashboard.dashboardName);
        if (action === 'delete') deleteDashboard(dashboard.id);
    }
    // Se não clicou em botão, o comportamento padrão (link href) ocorre
}

async function editDashboard(id, currentName) {
    const newName = prompt("Renomear Dashboard:", currentName);

    if (newName && newName.trim() !== "" && newName !== currentName) {
        try {
            const updatedDash = await DashboardService.update(id, newName.trim());
            
            // Atualização Otimista da UI (Manipulação direta do DOM)
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
            
            // Remove o elemento do DOM visualmente
            const cardElement = document.getElementById(`card-${id}`);
            if (cardElement) {
                cardElement.style.opacity = '0';
                
                setTimeout(() => {
                    cardElement.remove();
                    updateDashboardCount(); // Atualiza o contador após remover
                    
                    // Se ficou vazio, renderiza o estado vazio
                    if (document.querySelectorAll('.dashboard-card').length === 0) {
                        renderDashboardList([]); 
                    }
                }, 300);
            } else {
                init(); // Fallback se não achar o elemento
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao excluir dashboard.");
        }
    }
}

document.addEventListener('DOMContentLoaded', init);