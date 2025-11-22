export function createTaskCardElement(taskObj) {
    // 1. Lógica de Urgência (Visual)
    let urgencyClass = 'baixa';
    if (taskObj.priority === 1) urgencyClass = 'alta';
    else if (taskObj.priority === 2) urgencyClass = 'media';

    // 2. Criação do Elemento
    const card = document.createElement("div");
    card.className = `task-card urgency-${urgencyClass}`;
    card.draggable = true; 
    card.id = `task-${taskObj.id}`; 

    // 3. Dataset (Dados ocultos)
    card.dataset.id = taskObj.id;
    card.dataset.title = taskObj.title;
    card.dataset.priority = taskObj.priority;
    
    // 4. HTML Interno
    card.innerHTML = `
        <p>${taskObj.title}</p>
        <div class="urgency-tag">${urgencyClass}</div>
    `;

    return card;
}