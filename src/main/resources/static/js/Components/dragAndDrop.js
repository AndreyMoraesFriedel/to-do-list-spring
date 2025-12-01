import { updateTaskStatus } from './api.js';

let draggedItem = null;

// Mapeamento: ID do HTML -> Enum do Backend
const STATUS_MAP = {
    'todo-list': 'FAZER',
    'doing-list': 'FAZENDO',
    'done-list': 'FEITO'
};

/**
 * Ativa a capacidade de arrastar em um cartão de tarefa.
 */
export function enableDragAndDrop(cardElement) {
    cardElement.addEventListener("dragstart", (e) => {
        draggedItem = cardElement;
        // Transfere o ID da div (ex: "task-1")
        e.dataTransfer.setData('text/plain', cardElement.id);
        
        // Timeout para que o elemento original não suma imediatamente durante o drag
        setTimeout(() => cardElement.classList.add("dragging"), 0);
    });

    cardElement.addEventListener("dragend", () => {
        if (draggedItem) {
            draggedItem.classList.remove("dragging");
            draggedItem = null;
        }
    });
}

/**
 * Configura as zonas onde os cartões podem ser soltos (as colunas).
 */
export function setupDropZones(zonesNodeList, token) {
    zonesNodeList.forEach(zone => {
        // Necessário para permitir o "drop"
        zone.addEventListener("dragover", (e) => e.preventDefault());

        zone.addEventListener("drop", async (e) => {
            e.preventDefault();

            const rawTaskId = e.dataTransfer.getData('text/plain');
            // Remove o prefixo 'task-' para obter apenas o ID numérico
            const taskId = rawTaskId.replace('task-', '');
            
            const draggable = document.getElementById(rawTaskId);

            if (!draggable) return;

            const newStatusKey = zone.id;
            const newStatusValue = STATUS_MAP[newStatusKey];

            // Se soltou em uma zona válida conhecida
            if (newStatusValue) {
                // 1. Atualização Otimista (Visual primeiro)
                // Ao mover o elemento para a nova div (zone), o CSS específico daquela coluna
                // (#doing-list ou #done-list) aplicará a cor correta automaticamente e permanentemente.
                zone.appendChild(draggable);
                
                // 2. Verifica se a tarefa foi concluída para rodar o efeito
                if (newStatusValue === 'FEITO') {
                    triggerSuccessEffect(draggable);
                }

                // 3. Persistência no Backend
                try {
                    await updateTaskStatus(taskId, newStatusValue, token);
                    console.log(`[Sync] Task ${taskId} -> ${newStatusValue}`);
                } catch (error) {
                    console.error("Erro ao sincronizar status:", error);
                    alert("Erro ao salvar alteração. Recarregue a página.");
                }
            }
        });
    });
}

/**
 * Dispara efeitos visuais de sucesso.
 * Tenta usar a biblioteca 'canvas-confetti' se disponível.
 */
function triggerSuccessEffect(cardElement) {
    // Adiciona uma classe APENAS para a animação de "pulo" (pop)
    // A cor verde NÃO depende mais dessa classe, ela vem do ID da coluna (#done-list) no CSS.
    cardElement.classList.add('task-finished-pop');
    
    // Remove a classe de animação após 500ms para que ela possa rodar de novo se necessário
    // Isso NÃO remove a cor verde, pois a cor está no CSS da coluna pai.
    setTimeout(() => cardElement.classList.remove('task-finished-pop'), 500);

    // Efeito de Confete (Requer biblioteca externa)
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#27ae60', '#2ecc71', '#f1c40f', '#e67e22']
        });
    }
}