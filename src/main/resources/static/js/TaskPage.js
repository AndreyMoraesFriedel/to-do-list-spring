// Importa as funcionalidades das outras pastas (Components)
// Certifique-se que os arquivos api.js, taskRenderer.js e dragAndDrop.js estão dentro da pasta 'Components'
import { fetchTasks, createTask } from './Components/api.js';
import { createTaskCardElement } from './Components/taskRender.js';
import { enableDragAndDrop, setupDropZones } from './Components/dragAndDrop.js';

document.addEventListener("DOMContentLoaded", () => {
    // --- 1. CONFIGURAÇÃO INICIAL E VALIDAÇÃO ---
    const urlParams = new URLSearchParams(window.location.search);
    const dashboardId = urlParams.get('dashboardId');
    const userId = localStorage.getItem('loggedInUserId');
    const token = localStorage.getItem('authToken');

    // Referências aos elementos do HTML
    const taskForm = document.getElementById("new-task-form");
    const todoList = document.getElementById("todo-list");
    const allTaskLists = document.querySelectorAll(".task-list");

    // Validação de Segurança Básica
    if (!dashboardId || !userId) {
        alert("Erro de navegação: Dashboard ou Usuário não identificados. A voltar para a Home.");
        window.location.href = "/MainPage.html";
        return;
    }

    // Configura as colunas para aceitarem itens soltos (Drag & Drop)
    setupDropZones(allTaskLists);

    // --- 2. FUNÇÃO: CARREGAR E RENDERIZAR TAREFAS ---
    async function loadAndRenderTasks() {
        try {
            // Usa o componente de API para buscar dados no servidor
            const tasks = await fetchTasks(dashboardId, token);

            // Limpa a coluna visualmente antes de renderizar para não duplicar
            todoList.innerHTML = '';
            
            tasks.forEach(task => {
                // A. Cria o HTML do card usando o componente Renderizador
                const card = createTaskCardElement(task);
                
                // B. Ativa o comportamento de arrastar no card criado
                enableDragAndDrop(card);
                
                // C. Adiciona o card na tela (Por padrão na coluna 'A Fazer')
                // Nota: Se futuramente tiver 'status' no banco, pode fazer if(task.status == 'done') aqui.
                todoList.appendChild(card);
            });

        } catch (error) {
            console.error("Falha ao carregar tarefas:", error);
            // Mostra erro na tela se a lista estiver vazia
            if(todoList.children.length === 0) {
                todoList.innerHTML = '<p style="color:red; font-size: 0.9em; padding: 10px;">Erro ao carregar tarefas.</p>';
            }
        }
    }

    // Chama o carregamento inicial assim que a página abre
    loadAndRenderTasks();

    // --- 3. EVENTO: CRIAR NOVA TAREFA (FORMULÁRIO) ---
    if (taskForm) {
        taskForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Pega os valores dos inputs
            const textInput = document.getElementById("task-text");
            const urgencyInput = document.getElementById("task-urgency");
            
            const title = textInput.value.trim();
            const urgencyStr = urgencyInput.value;

            if (!title) {
                alert("Por favor, digite o nome da tarefa.");
                return;
            }

            // Converte urgência para Integer (regra de negócio do Java: 1=Alta, 2=Média, 3=Baixa)
            let priorityInt = 3; 
            if(urgencyStr === 'alta') priorityInt = 1;
            if(urgencyStr === 'media') priorityInt = 2;

            // Monta o objeto DTO para enviar ao Backend
            const newTaskData = {
                title: title,
                description: "", // Futuramente você pode adicionar um campo de descrição no form
                priority: priorityInt,
                userId: userId,
                dashboardId: dashboardId
            };

            try {
                // A. Usa o componente API para salvar no banco de dados
                const savedTask = await createTask(newTaskData, token);

                // B. Renderiza o novo card na tela imediatamente (sem precisar recarregar a página)
                const card = createTaskCardElement(savedTask);
                
                // C. Ativa o drag and drop no novo card
                enableDragAndDrop(card);
                
                // D. Adiciona na coluna
                todoList.appendChild(card);

                // E. Limpa o formulário para a próxima tarefa
                textInput.value = "";
                urgencyInput.value = "baixa";

            } catch (error) {
                console.error("Falha ao criar tarefa:", error);
                alert("Erro ao salvar a tarefa. Tente novamente.");
            }
        });
    }
});