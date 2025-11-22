let draggedItem = null;
export function enableDragAndDrop(cardElement) {
    cardElement.addEventListener("dragstart", (e) => {
        draggedItem = cardElement;
        e.dataTransfer.setData('text/plain', cardElement.id);
        
        setTimeout(() => {
            cardElement.classList.add("dragging"); 
        }, 0);
    });

    cardElement.addEventListener("dragend", () => {
        setTimeout(() => {
            if (draggedItem) {
                draggedItem.classList.remove("dragging");
                draggedItem = null;
            }
        }, 0);
    });
}


export function setupDropZones(zonesNodeList) {
    zonesNodeList.forEach(zone => {
        zone.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        zone.addEventListener("drop", (e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData('text/plain');
            const draggable = document.getElementById(id);
            
            if (draggable) {
                zone.appendChild(draggable);
                console.log(`Tarefa movida para a coluna: ${zone.id}`);
            }
        });
    });
}