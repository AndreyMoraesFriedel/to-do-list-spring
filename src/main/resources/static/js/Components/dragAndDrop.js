import { updateTaskStatus } from './api.js';

let draggedItem = null;

const STATUS_MAP = {
    'todo-list': 'FAZER',
    'doing-list': 'FAZENDO',
    'done-list': 'FEITO'
};

export function enableDragAndDrop(cardElement) {
    cardElement.addEventListener("dragstart", (e) => {
        draggedItem = cardElement;
        e.dataTransfer.setData('text/plain', cardElement.id);

        setTimeout(() => cardElement.classList.add("dragging"), 0);
    });

    cardElement.addEventListener("dragend", () => {
        if (draggedItem) {
            draggedItem.classList.remove("dragging");
            draggedItem = null;
        }
    });
}

export function setupDropZones(zonesNodeList, token) {
    zonesNodeList.forEach(zone => {
        zone.addEventListener("dragover", (e) => e.preventDefault());

        zone.addEventListener("drop", async (e) => {
            e.preventDefault();

            const rawTaskId = e.dataTransfer.getData('text/plain');
            const taskId = rawTaskId.replace('task-', '');
            
            const draggable = document.getElementById(rawTaskId);

            if (!draggable) return;

            const newStatusKey = zone.id;
            const newStatusValue = STATUS_MAP[newStatusKey];

            if (newStatusValue) {
                zone.appendChild(draggable);

                if (newStatusValue === 'FEITO') {
                    triggerSuccessEffect(draggable);
                }

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

function triggerSuccessEffect(cardElement) {
    cardElement.classList.add('task-finished-pop');

    setTimeout(() => cardElement.classList.remove('task-finished-pop'), 500);

    if (typeof confetti === 'function') {
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#27ae60', '#2ecc71', '#f1c40f', '#e67e22']
        });
    }
}