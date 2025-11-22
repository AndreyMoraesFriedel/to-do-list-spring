const API_TASKS_URL = '/api/tasks'; 

document.addEventListener("DOMContentLoaded", () => {
    // 1. Identificar Usuário e Dashboard Atual
    const urlParams = new URLSearchParams(window.location.search);
    const dashboardId = urlParams.get('dashboardId');
    const userId = localStorage.getItem('loggedInUserId');
    const token = localStorage.getItem('authToken'); // Se estiver usando token

    // Referências do DOM
    const taskForm = document.getElementById("new-task-form");
    const taskTextInput = document.getElementById("task-text");
    const taskUrgencyInput = document.getElementById("task-urgency");
    const todoList = document.getElementById("todo-list"); // Coluna "A Fazer"
    const taskLists = document.querySelectorAll(".task-list");

    // Validação de Segurança
    if (!dashboardId || !userId) {
        alert("Erro: Dashboard ou Usuário não identificado. Voltando...");
        window.location.href = "/MainPage.html"; // Volta para a lista de dashboards
        return;
    }

    // --- FUNÇÃO 1: CARREGAR TAREFAS DO BANCO ---
    async function loadTasks() {
        try {
            // Chama a rota: GET /api/tasks?dashboardId=X
            const response = await fetch(`${API_TASKS_URL}?dashboardId=${dashboardId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });

            if (response.ok) {
                const tasks = await response.json();
                // Limpa a lista antes de encher
                todoList.innerHTML = '<h3>A Fazer</h3>'; // Mantém o título se houver
                
                tasks.forEach(task => {
                    // Aqui assumimos que toda tarefa nova vai para "todo-list"
                    // (Para salvar a coluna correta, precisaríamos de um campo 'status' no banco)
                    const card = createTaskCardElement(task.id, task.title, task.priority);
                    todoList.appendChild(card);
                });
            }
        } catch (error) {
            console.error("Erro ao carregar tarefas:", error);
        }
    }

    // Chama o carregamento inicial
    loadTasks();


    // --- FUNÇÃO 2: CRIAR NOVA TAREFA (POST) ---
    taskForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const text = taskTextInput.value.trim();
        const urgencyStr = taskUrgencyInput.value; // "alta", "media", "baixa"

        if (text === "") {
            alert("Por favor, descreva a tarefa.");
            return;
        }

        // Converter urgência de String para Número (se seu backend espera Integer)
        // Exemplo: 1=Alta, 2=Media, 3=Baixa (ajuste conforme sua lógica Java)
        let priorityInt = 3; 
        if(urgencyStr === 'alta') priorityInt = 1;
        if(urgencyStr === 'media') priorityInt = 2;

        const newTaskPayload = {
            title: text,
            description: "", // Se tiver campo descrição, coloque aqui
            priority: priorityInt,
            // IDs enviados para serem tratados no backend
            userId: userId,         
            dashboardId: dashboardId 
        };

        try {
            const response = await fetch(API_TASKS_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify(newTaskPayload)
            });

            if (response.ok) {
                const savedTask = await response.json();
                
                // Só cria na tela se o banco salvou com sucesso
                const taskCard = createTaskCardElement(savedTask.id, savedTask.title, urgencyStr);
                todoList.appendChild(taskCard);

                // Limpa form
                taskTextInput.value = "";
                taskUrgencyInput.value = "baixa";
            } else {
                alert("Erro ao salvar tarefa no servidor.");
            }
        } catch (error) {
            console.error("Erro de rede:", error);
        }
    });


    // --- FUNÇÃO AUXILIAR: CRIAR O HTML DO CARD ---
    function createTaskCardElement(id, text, urgency) {
        // Converte número de volta para texto se vier do banco (ex: 1 -> "alta")
        let urgencyClass = urgency;
        if (typeof urgency === 'number') {
            if(urgency === 1) urgencyClass = 'alta';
            else if(urgency === 2) urgencyClass = 'media';
            else urgencyClass = 'baixa';
        }

        const card = document.createElement("div");
        card.className = `task-card urgency-${urgencyClass}`;
        card.draggable = true;
        card.id = "task-" + id; // Usa o ID real do banco

        card.innerHTML = `
            <p>${text}</p>
            <div class="urgency-tag">${urgencyClass}</div>
        `;

        addDragEvents(card);
        return card;
    }

    // --- LÓGICA DE DRAG AND DROP (Manteve a sua) ---
    let draggedItem = null;

    function addDragEvents(card) {
        card.addEventListener("dragstart", (e) => {
            draggedItem = card;
            e.dataTransfer.setData('text/plain', card.id);
            setTimeout(() => {
                card.classList.add("dragging"); 
            }, 0);
        });

        card.addEventListener("dragend", () => {
            setTimeout(() => {
                draggedItem.classList.remove("dragging");
                draggedItem = null;
            }, 0);
            
            // DICA FUTURA: Aqui você poderia fazer um PUT para atualizar o status no banco
            // baseado em qual coluna o item caiu (todo-list, doing, done)
        });
    }

    taskLists.forEach(list => {
        list.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        list.addEventListener("drop", (e) => {
            e.preventDefault();
            if (draggedItem) {
                list.appendChild(draggedItem);
            }
        });
    });

});