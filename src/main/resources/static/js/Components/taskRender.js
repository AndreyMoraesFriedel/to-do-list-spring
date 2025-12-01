/**
 * * @param {Object} taskObj Objeto de tarefa retornado pelo Backend.
 * @param {Function} onCardClick Função a ser executada ao clicar no cartão.
 * @returns {HTMLElement} O elemento DIV que representa o cartão da tarefa.
 */
export function createTaskCardElement(taskObj, onCardClick) {
    let urgencyClass = 'baixa';
    // Determina a classe de CSS baseada no campo priority (1=alta, 2=media)
    if (taskObj.priority === 1) urgencyClass = 'alta';
    else if (taskObj.priority === 2) urgencyClass = 'media';

    const card = document.createElement("div");
    // Define classes para estilização e prioridade
    card.className = `task-card urgency-${urgencyClass}`;
    card.draggable = true;
    // Define o ID do elemento HTML (necessário para o drag-and-drop)
    card.id = `task-${taskObj.id}`; 

    // Define data attributes (úteis para manipulação posterior)
    card.dataset.id = taskObj.id;
    card.dataset.title = taskObj.title;
    card.dataset.priority = taskObj.priority;
    
    // Conteúdo HTML do cartão
    card.innerHTML = `
        <p>${taskObj.title}</p>
        <div class="urgency-tag">${urgencyClass}</div>
    `;

    // Configura o evento de clique para abrir o modal de visualização
    card.addEventListener('click', () => {
        if (onCardClick && typeof onCardClick === 'function') {
            onCardClick(taskObj); 
        }
    });

    return card;
}