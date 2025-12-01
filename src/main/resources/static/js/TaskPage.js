import { enableDragAndDrop, setupDropZones } from './Components/dragAndDrop.js';
import { createTaskCardElement } from './Components/taskRender.js';
import { fetchTasks, createTask, updateTaskContent, deleteTask } from './Components/api.js';

const PRIORITY_MAP = { 'alta': 1, 'media': 2, 'baixa': 3 };

document.addEventListener("DOMContentLoaded", () => {
    let currentEditingTaskId = null; // Variável para controlar se estamos Editando (ID) ou Criando (null)
    const urlParams = new URLSearchParams(window.location.search);
    const dashboardId = urlParams.get('dashboardId');
    const userId = localStorage.getItem('loggedInUserId');
    const token = localStorage.getItem('authToken');

    const COLUMN_MAP = {
        'FAZER': document.getElementById('todo-list'),
        'FAZENDO': document.getElementById('doing-list'),
        'FEITO': document.getElementById('done-list')
    };

    const ui = {
        btnOpenCreate: document.getElementById("btn-open-create"),
        btnLogout: document.getElementById("logout-button"),
        
        lists: {
            todo: document.getElementById("todo-list"),
            all: document.querySelectorAll(".task-list")
        },

        createModal: {
            overlay: document.getElementById("create-modal"),
            closeBtn: document.querySelector(".close-create-btn"), 
            form: document.getElementById("create-task-form"),     
            inputs: {
                text: document.getElementById("create-text"),
                description: document.getElementById("create-description"),
                urgency: document.getElementById("create-urgency"),
                image: document.getElementById("create-image")
            }
        },

        viewModal: {
            overlay: document.getElementById("view-modal"),
            closeBtn: document.querySelector(".close-view-btn"),
            title: document.getElementById("view-title"),
            priority: document.getElementById("view-priority"),
            imageContainer: document.getElementById("view-image-container"),
            description: document.getElementById("view-description")
        }
    };

    // 1. Validação de Sessão
    if (!dashboardId || !userId) {
        alert("Sessão inválida. Retornando...");
        window.location.href = "/MainPage.html";
        return;
    }

    // 2. Inicialização
    setupDropZones(ui.lists.all, token);
    setupEventListeners();
    loadAndRenderTasks();


    // --- FUNÇÕES ---

    async function loadAndRenderTasks() {
        try {
            const tasks = await fetchTasks(dashboardId, token);

            // Limpa as colunas antes de renderizar para não duplicar visualmente
            Object.values(COLUMN_MAP).forEach(listElement => {
                if (listElement) listElement.innerHTML = '';
            });
            
            if (tasks.length === 0) {
                renderEmptyState();
                return;
            }
            
            tasks.forEach(task => {
                // Se o status vier nulo do banco, joga para FAZER como segurança
                const statusKey = task.status || 'FAZER';
                const listElement = COLUMN_MAP[statusKey] || COLUMN_MAP['FAZER'];
                
                addTaskToScreen(task, listElement); 
            });
            
        } catch (error) {
            console.error("Erro ao carregar:", error);
            if (ui.lists.todo) {
                ui.lists.todo.innerHTML = `<p style="color:red; text-align:center;">Erro ao carregar tarefas.</p>`;
            }
        }
    }

    async function handleCreateSubmit(e) {
        e.preventDefault();

        const title = ui.createModal.inputs.text.value.trim();
        const description = ui.createModal.inputs.description.value.trim(); 
        const rawUrgency = ui.createModal.inputs.urgency.value;
        const priorityInt = getPriorityValue(rawUrgency);
        const file = ui.createModal.inputs.image.files[0];

        if (!title) return alert("O título é obrigatório.");

        try {
            const base64Image = file ? await convertImageToBase64(file) : null;

            // Objeto base da tarefa
            const taskData = {
                title: title,
                description: description,
                priority: priorityInt,
            };
            if (base64Image) taskData.image = base64Image;

            if (currentEditingTaskId) {
                // === MODO EDIÇÃO (PATCH) ===
                console.log(`Editando tarefa ${currentEditingTaskId}...`);
                const updatedTask = await updateTaskContent(currentEditingTaskId, taskData, token);
                
                // Atualiza o card na tela imediatamente
                const card = document.getElementById(`task-${currentEditingTaskId}`);
                if (card) {
                    card.querySelector('p').textContent = updatedTask.title;
                    card.className = `task-card urgency-${rawUrgency}`;
                    const tag = card.querySelector('.urgency-tag');
                    if(tag) tag.textContent = rawUrgency;
                    
                    // Atualiza datasets para futuras edições sem recarregar
                    card.dataset.title = updatedTask.title;
                    card.dataset.priority = updatedTask.priority;
                    
                    // Recarrega lista para garantir consistência total
                    loadAndRenderTasks(); 
                }
            } else {
                // === MODO CRIAÇÃO (POST) ===
                console.log("Criando nova tarefa...");
                taskData.userId = userId;
                taskData.dashboardId = dashboardId;
                
                const savedTask = await createTask(taskData, token);
                addTaskToScreen(savedTask, COLUMN_MAP['FAZER']);
            }

            clearCreateForm();
            toggleModal(ui.createModal.overlay, false);

        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao salvar: " + error.message);
        }
    }

    function setupEventListeners() {
        // AQUI ESTAVA O PROBLEMA: Havia dois listeners para o mesmo botão.
        // Agora unificamos em um só que garante o reset para "Criar".
        if (ui.btnOpenCreate) {
            ui.btnOpenCreate.addEventListener("click", () => {
                currentEditingTaskId = null; // Reseta para modo CRIAÇÃO
                clearCreateForm();
                
                // Ajusta textos do modal para "Nova Tarefa"
                const modalTitle = document.querySelector('#create-modal h2');
                if(modalTitle) modalTitle.textContent = "Nova Tarefa";
                
                const submitBtn = document.querySelector('#create-task-form button[type="submit"]');
                if(submitBtn) submitBtn.textContent = "Criar";

                toggleModal(ui.createModal.overlay, true);
            });
        } else {
            console.error("Botão 'btn-open-create' não encontrado no HTML!");
        }

        // Submit do formulário (funciona para Criar e Editar)
        if (ui.createModal.form) {
            ui.createModal.form.addEventListener("submit", handleCreateSubmit);
        }

        // Logout
        if (ui.btnLogout) {
            ui.btnLogout.addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.removeItem('authToken');
                localStorage.removeItem('loggedInUserId');
                window.location.href = "/LoginPage.html"; 
            });
        }

        // Botão EXCLUIR (dentro do modal de visualização)
        const btnDelete = document.getElementById("btn-delete-task");
        if (btnDelete) {
            btnDelete.addEventListener("click", async () => {
                if (!currentEditingTaskId) return;

                if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
                    try {
                        await deleteTask(currentEditingTaskId, token);
                        
                        // Remove da tela
                        const card = document.getElementById(`task-${currentEditingTaskId}`);
                        if (card) card.remove();
                        
                        toggleModal(ui.viewModal.overlay, false);
                    } catch (error) {
                        alert("Erro ao excluir: " + error.message);
                    }
                }
            });
        }

        // Botão EDITAR (dentro do modal de visualização)
        const btnEdit = document.getElementById("btn-edit-task");
        if (btnEdit) {
            btnEdit.addEventListener("click", () => {
                toggleModal(ui.viewModal.overlay, false); // Fecha "Ver"
                openEditModal(); // Abre "Editar"
            });
        }

        // Fechar Modais (X e Overlay)
        setupModalCloseLogic(ui.createModal.overlay, ui.createModal.closeBtn);
        setupModalCloseLogic(ui.viewModal.overlay, ui.viewModal.closeBtn);
    }

    function setupModalCloseLogic(overlay, closeBtn) {
        if (closeBtn) {
            closeBtn.addEventListener("click", () => toggleModal(overlay, false));
        }
        if (overlay) {
            overlay.addEventListener("click", (e) => {
                if (e.target === overlay) toggleModal(overlay, false);
            });
        }
    }

    function toggleModal(modalElement, show) {
        if (!modalElement) return;
        if (show) modalElement.classList.remove("hidden");
        else modalElement.classList.add("hidden");
    }

    function addTaskToScreen(task, targetListElement) {
        if (!targetListElement) return;

        const emptyMsg = targetListElement.querySelector('.empty-state-msg');
        if (emptyMsg) emptyMsg.remove();

        // Passamos openViewModal como callback de clique
        const card = createTaskCardElement(task, openViewModal);
        enableDragAndDrop(card);
        
        targetListElement.appendChild(card);
    }

    function renderEmptyState() {
        const todoList = COLUMN_MAP['FAZER'] || ui.lists.todo;
        if (todoList) {
            todoList.innerHTML = `
                <div class="empty-state-msg" style="text-align: center; color: #95a5a6; margin-top: 20px;">
                    <p>Nenhuma tarefa.</p>
                </div>`;
        }
    }

    function getPriorityValue(str) {
        return PRIORITY_MAP[str] || 3;
    }

    function clearCreateForm() {
        ui.createModal.inputs.text.value = "";
        ui.createModal.inputs.description.value = "";
        ui.createModal.inputs.urgency.value = "baixa";
        ui.createModal.inputs.image.value = "";
    }

    function convertImageToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    
    // Abre modal de visualização e define o ID da tarefa atual
    function openViewModal(task) {
        currentEditingTaskId = task.id; // IMPORTANTE: Guarda ID para edição/exclusão

        if(ui.viewModal.title) ui.viewModal.title.textContent = task.title;
        
        if(ui.viewModal.priority) {
            ui.viewModal.priority.textContent = `Prioridade: ${getPriorityLabel(task.priority)}`;
        }
        
        if (ui.viewModal.description) {
            ui.viewModal.description.textContent = task.description || "Sem descrição.";
        }

        // Renderiza Imagem se existir
        if(ui.viewModal.imageContainer) {
            ui.viewModal.imageContainer.innerHTML = '';
            if (task.imageBase64) {
                const img = document.createElement('img');
                img.src = task.imageBase64;
                Object.assign(img.style, {
                    maxWidth: '100%', maxHeight: '400px', borderRadius: '8px',
                    marginTop: '15px', display: 'block', margin: '15px auto'
                });
                ui.viewModal.imageContainer.appendChild(img);
            }
        }

        toggleModal(ui.viewModal.overlay, true);
    }

    function getPriorityLabel(p) {
        if (p === 1) return 'Alta';
        if (p === 2) return 'Média';
        return 'Baixa';
    }

    // Prepara formulário para edição
    function openEditModal() {
        const card = document.getElementById(`task-${currentEditingTaskId}`);
        if (!card) return;

        // Recupera valores atuais do modal de visualização
        const currentTitle = ui.viewModal.title.textContent;
        const currentDesc = ui.viewModal.description.textContent;
        const currentPriority = card.dataset.priority; 
        
        // Preenche o formulário
        ui.createModal.inputs.text.value = currentTitle;
        ui.createModal.inputs.description.value = (currentDesc === "Sem descrição.") ? "" : currentDesc;
        
        let priorityVal = 'baixa';
        if (currentPriority == 1) priorityVal = 'alta';
        if (currentPriority == 2) priorityVal = 'media';
        ui.createModal.inputs.urgency.value = priorityVal;

        // Ajusta UI do modal
        const modalTitle = document.querySelector('#create-modal h2');
        if(modalTitle) modalTitle.textContent = "Editar Tarefa";
        
        const submitBtn = document.querySelector('#create-task-form button[type="submit"]');
        if(submitBtn) submitBtn.textContent = "Salvar Alterações";

        toggleModal(ui.createModal.overlay, true);
    }
});