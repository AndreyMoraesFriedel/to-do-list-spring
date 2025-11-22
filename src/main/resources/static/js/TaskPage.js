// Importa as funcionalidades das outras pastas (Components)
// Certifique-se que os arquivos api.js, taskRenderer.js e dragAndDrop.js estão dentro da pasta 'Components'
import { fetchTasks, createTask } from './Components/api.js';
import { createTaskCardElement } from './Components/taskRender.js'; 
import { enableDragAndDrop, setupDropZones } from './Components/dragAndDrop.js';

document.addEventListener("DOMContentLoaded", () => {
    // --- 1. CONFIGURAÇÃO INICIAL E VARIÁVEIS ---
    const urlParams = new URLSearchParams(window.location.search);
    const dashboardId = urlParams.get('dashboardId');
    const userId = localStorage.getItem('loggedInUserId');
    const token = localStorage.getItem('authToken');

    // Referências aos elementos do HTML (Quadro)
    const taskForm = document.getElementById("new-task-form");
    const todoList = document.getElementById("todo-list");
    const allTaskLists = document.querySelectorAll(".task-list");

    // Referências aos elementos do HTML (Modal/Detalhes)
    const modal = document.getElementById("task-modal");
    const closeModalBtn = document.querySelector(".close-modal-btn");
    const modalTitle = document.getElementById("modal-title");
    const modalPriority = document.querySelector("#modal-priority span");
    const modalImageContainer = document.getElementById("modal-image-container");
    const modalDescription = document.getElementById("modal-description");

    // Validação de Segurança Básica
    if (!dashboardId || !userId) {
        alert("Erro de navegação: Dashboard ou Usuário não identificados. Voltando para a Home.");
        window.location.href = "/MainPage.html";
        return;
    }

    // Configura as colunas para aceitarem itens soltos (Drag & Drop)
    setupDropZones(allTaskLists);

    // --- 2. LÓGICA DO MODAL (JANELA DE DETALHES) ---
    
    // Função chamada quando se clica num card
    function openTaskModal(task) {
        modalTitle.textContent = task.title;
        
        // Formata a prioridade visualmente
        let priorityText = 'Baixa';
        if (task.priority === 1) priorityText = 'Alta';
        else if (task.priority === 2) priorityText = 'Média';
        modalPriority.textContent = priorityText;
        
        if (modalDescription) {
            modalDescription.textContent = task.description || "Sem descrição adicional.";
        }

        // Limpa imagem anterior
        modalImageContainer.innerHTML = '';

        // Se tiver imagem Base64, cria o elemento e mostra
        if (task.imageBase64) {
            const img = document.createElement('img');
            img.src = task.imageBase64;
            // Estilos inline para garantir que a imagem não estoure o modal
            img.style.maxWidth = "100%";
            img.style.borderRadius = "8px";
            img.style.marginTop = "15px";
            modalImageContainer.appendChild(img);
        } else {
            modalImageContainer.innerHTML = '<p style="color:#888; font-style:italic; margin-top:10px;">Sem imagem anexa.</p>';
        }

        // Mostra o modal (remove a classe hidden)
        modal.classList.remove("hidden");
    }

    // Eventos para fechar o modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", () => modal.classList.add("hidden"));
    }
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) modal.classList.add("hidden"); // Fecha se clicar fora da caixa branca
        });
    }

    // --- 3. FUNÇÃO: CARREGAR E RENDERIZAR TAREFAS ---
    async function loadAndRenderTasks() {
        try {
            // Usa o componente de API para buscar dados no servidor
            const tasks = await fetchTasks(dashboardId, token);

            // Limpa a coluna visualmente antes de renderizar para não duplicar
            todoList.innerHTML = '';
            
            tasks.forEach(task => {
                // A. Cria o HTML do card usando o componente Renderizador
                // Passamos a função openTaskModal para que o card saiba o que fazer ao ser clicado
                const card = createTaskCardElement(task, openTaskModal);
                
                // B. Ativa o comportamento de arrastar no card criado
                enableDragAndDrop(card);
                
                // C. Adiciona o card na tela (Por padrão na coluna 'A Fazer')
                todoList.appendChild(card);
            });

        } catch (error) {
            console.error("Falha ao carregar tarefas:", error);
            if(todoList.children.length === 0) {
                todoList.innerHTML = '<p style="color:red; font-size: 0.9em; padding: 10px;">Erro ao carregar tarefas.</p>';
            }
        }
    }

    // Chama o carregamento inicial assim que a página abre
    loadAndRenderTasks();

    // --- 4. EVENTO: CRIAR NOVA TAREFA (FORMULÁRIO) ---
    if (taskForm) {
        taskForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Pega os elementos do formulário
            const textInput = document.getElementById("task-text");
            const urgencyInput = document.getElementById("task-urgency");
            const imageInput = document.getElementById("task-image"); // Input de arquivo (Opcional)
            
            const title = textInput.value.trim();
            const urgencyStr = urgencyInput.value;
            const file = imageInput ? imageInput.files[0] : null;

            if (!title) {
                alert("Por favor, digite o nome da tarefa.");
                return;
            }

            // A. Lógica de Conversão de Imagem (File -> Base64)
            let base64Image = null;
            if (file) {
                try {
                    base64Image = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = error => reject(error);
                    });
                } catch (err) {
                    console.error("Erro ao processar imagem:", err);
                    alert("Erro ao processar a imagem. Tente uma imagem menor.");
                    return;
                }
            }

            // B. Converte urgência para Integer (regra de negócio)
            let priorityInt = 3; 
            if(urgencyStr === 'alta') priorityInt = 1;
            if(urgencyStr === 'media') priorityInt = 2;

            // C. Monta o objeto DTO para enviar ao Backend
            const newTaskData = {
                title: title,
                description: "", 
                priority: priorityInt,
                userId: userId,
                dashboardId: dashboardId,
                image: base64Image // Envia a string Base64 da imagem
            };

            try {
                // D. Usa o componente API para salvar no banco de dados
                const savedTask = await createTask(newTaskData, token);

                // E. Renderiza o novo card na tela imediatamente
                // Passamos o openTaskModal para o novo card também funcionar o clique
                const card = createTaskCardElement(savedTask, openTaskModal);
                enableDragAndDrop(card);
                todoList.appendChild(card);

                // F. Limpa o formulário
                textInput.value = "";
                urgencyInput.value = "baixa";
                if(imageInput) imageInput.value = ""; // Limpa o arquivo selecionado

            } catch (error) {
                console.error("Falha ao criar tarefa:", error);
                alert("Erro ao salvar a tarefa. Tente novamente.");
            }
        });
    }
});