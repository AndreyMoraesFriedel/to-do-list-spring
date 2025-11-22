const API_TASKS_URL = '/api/tasks';

/**
 * Busca todas as tarefas de um dashboard específico.
 */
export async function fetchTasks(dashboardId, token) {
    const response = await fetch(`${API_TASKS_URL}?dashboardId=${dashboardId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        }
    });

    if (!response.ok) {
        throw new Error(`Erro na API (${response.status}): ${response.statusText}`);
    }

    return await response.json();
}

/**
 * Cria uma nova tarefa no banco de dados.
 */
export async function createTask(taskData, token) {
    const response = await fetch(API_TASKS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(taskData)
    });

    if (!response.ok) {
        throw new Error(`Erro ao criar tarefa (${response.status})`);
    }

    return await response.json();
}