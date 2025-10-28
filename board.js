document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("new-task-form");
    const taskTextInput = document.getElementById("task-text");
    const taskUrgencyInput = document.getElementById("task-urgency");
    
    const todoList = document.getElementById("todo-list");
    
    const taskLists = document.querySelectorAll(".task-list");

    // --- 1. ADICIONAR NOVA TAREFA ---
    
    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const text = taskTextInput.value.trim();
        const urgency = taskUrgencyInput.value;

        if (text === "") {
            alert("Por favor, descreva a tarefa.");
            return;
        }

        const taskCard = createTaskCard(text, urgency);
        todoList.appendChild(taskCard);

        taskTextInput.value = "";
        taskUrgencyInput.value = "baixa";
    });

    function createTaskCard(text, urgency) {
        const card = document.createElement("div");
        card.className = `task-card urgency-${urgency}`;
        card.draggable = true;
        
        card.id = "task-" + new Date().getTime(); 

        card.innerHTML = `
            <p>${text}</p>
            <div class="urgency-tag">${urgency}</div>
        `;

        addDragEvents(card);
        
        return card;
    }

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