/**
 * 
 * @param {Object} taskObj 
 * @param {Function} onCardClick 
 * @returns {HTMLElement} 
 */
export function createTaskCardElement(taskObj, onCardClick) {
    let urgencyClass = 'baixa';
    if (taskObj.priority === 1) urgencyClass = 'alta';
    else if (taskObj.priority === 2) urgencyClass = 'media';

    const card = document.createElement("div");
    card.className = `task-card urgency-${urgencyClass}`;
    card.draggable = true;
    card.id = `task-${taskObj.id}`; 

    card.dataset.id = taskObj.id;
    card.dataset.title = taskObj.title;
    card.dataset.priority = taskObj.priority;
    
    card.innerHTML = `
        <p>${taskObj.title}</p>
        <div class="urgency-tag">${urgencyClass}</div>
    `;

    card.addEventListener('click', () => {
        if (onCardClick && typeof onCardClick === 'function') {
            onCardClick(taskObj); 
        }
    });

    return card;
}