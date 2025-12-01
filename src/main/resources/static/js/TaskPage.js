import { enableDragAndDrop, setupDropZones } from './Components/dragAndDrop.js';
import { fetchTasks, createTask } from './Components/api.js';
import { createTaskCardElement } from './Components/taskRender.js';

const PRIORITY_MAP = { 'alta': 1, 'media': 2, 'baixa': 3 };

document.addEventListener("DOMContentLoaded", () => {
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

    if (!dashboardId || !userId) {
        alert("Sessão inválida. Retornando...");
        window.location.href = "/MainPage.html";
        return;
    }

    setupDropZones(ui.lists.all, token);
    
    setupEventListeners();

    loadAndRenderTasks();


    async function loadAndRenderTasks() {
        try {
            const tasks = await fetchTasks(dashboardId, token);

            Object.values(COLUMN_MAP).forEach(listElement => {
                if (listElement) listElement.innerHTML = '';
            });
            
            if (tasks.length === 0) {
                renderEmptyState();
                return;
            }
            
            tasks.forEach(task => {
                const listElement = COLUMN_MAP[task.status]; 
                
                if (listElement) {
                    addTaskToScreen(task, listElement); 
                } else {
                    console.error(`Status desconhecido (${task.status}). Colocando em 'A Fazer' como fallback.`);
                    addTaskToScreen(task, COLUMN_MAP['FAZER']); 
                }
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

        if (!title) {
            alert("O nome da tarefa é obrigatório.");
            return;
        }

       
        function getPriorityValue(str) {
        if (!str) return 3;
        const cleanStr = str.toString().toLowerCase().trim();
        return PRIORITY_MAP[cleanStr] || 3;
        }

        const rawUrgency = ui.createModal.inputs.urgency.value;
        const priorityInt = getPriorityValue(rawUrgency);
        console.log(`Prioridade Selecionada: "${rawUrgency}" -> Convertida para ID: ${priorityInt}`);


        const file = ui.createModal.inputs.image.files[0];

        try {
            const base64Image = file ? await convertImageToBase64(file) : null;

            const newTaskData = {
                title: title,
                description: description,
                priority: priorityInt,
                userId: userId,
                dashboardId: dashboardId,
                image: base64Image
            };

            const savedTask = await createTask(newTaskData, token);

            addTaskToScreen(savedTask, COLUMN_MAP['FAZER']);
            clearCreateForm();
            toggleModal(ui.createModal.overlay, false);

        } catch (error) {
            console.error("Erro na criação:", error);
            alert("Erro ao salvar. Tente uma imagem menor.");
        }
    }

    function setupEventListeners() {
        if (ui.btnOpenCreate) {
            ui.btnOpenCreate.addEventListener("click", () => {
                toggleModal(ui.createModal.overlay, true);
            });
        } else {
            console.error("Botão 'btn-open-create' não encontrado no HTML!");
        }

        if (ui.createModal.form) {
            ui.createModal.form.addEventListener("submit", handleCreateSubmit);
        }

        setupModalCloseLogic(ui.createModal.overlay, ui.createModal.closeBtn);
        setupModalCloseLogic(ui.viewModal.overlay, ui.viewModal.closeBtn);

        if (ui.btnLogout) {
            ui.btnLogout.addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.removeItem('authToken');
                localStorage.removeItem('loggedInUserId');
                window.location.href = "/LoginPage.html"; 
            });
        }
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
        if (!targetListElement) {
            console.error("Erro: Elemento de lista de destino não encontrado.");
            return;
        }

        const emptyMsg = targetListElement.querySelector('.empty-state-msg');
        if (emptyMsg) emptyMsg.remove();

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
        ui.createModal.inputs.description.value = ""; // <--- 4. LIMPA O CAMPO DE DESCRIÇÃO
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
    
    function openViewModal(task) {
        if(ui.viewModal.title) ui.viewModal.title.textContent = task.title;
        
        if(ui.viewModal.priority) {
            ui.viewModal.priority.textContent = `Prioridade: ${getPriorityLabel(task.priority)}`;
        }
        
        if (ui.viewModal.description) {
            ui.viewModal.description.textContent = task.description || "Sem descrição."; // Fallback visual
        }

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
});