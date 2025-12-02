const API_TASKS_URL = '/api/tasks';

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

export async function createTask(taskData, token) {
    const userId = taskData.userId;
    const dashId = taskData.dashboardId; 
    
    const url = `${API_TASKS_URL}/${userId}/${dashId}`; 

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(taskData)
    });

    if (!response.ok) {
        await handleApiError(response, 'Erro ao criar tarefa');
    }
    return await response.json();
}

export async function updateTaskStatus(taskId, newStatus, token) {
    const response = await fetch(`${API_TASKS_URL}/${taskId}`, {
        method: 'PATCH', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ 
            taskStatus: newStatus 
        })
    });

    if (!response.ok) {
        await handleApiError(response, 'Falha ao atualizar status');
    }
}

export async function updateTaskContent(taskId, taskData, token) {
    const response = await fetch(`${API_TASKS_URL}/${taskId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
            title: taskData.title,
            description: taskData.description,
            priority: taskData.priority,
            image: taskData.image
        })
    });

    if (!response.ok) {
        await handleApiError(response, 'Falha ao atualizar tarefa');
    }

    return await response.json();
}

export async function deleteTask(taskId, token) {
    const response = await fetch(`${API_TASKS_URL}/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': token ? `Bearer ${token}` : ''
        }
    });

    if (!response.ok) {
        await handleApiError(response, 'Falha ao excluir tarefa');
    }
}

// Função auxiliar para evitar repetição de código de erro
async function handleApiError(response, defaultMsg) {
    let errorBody = null;
    try {
        errorBody = await response.json(); 
    } catch (e) {
        try { errorBody = await response.text(); } catch(e2) {}
    }

    const status = response.status;
    let errorMessage = `${defaultMsg} (${status})`;

    if (typeof errorBody === 'object' && errorBody !== null && errorBody.message) {
        errorMessage += `: ${errorBody.message}`;
    } else if (typeof errorBody === 'string' && errorBody.length > 0) {
        errorMessage += `: ${errorBody}`;
    } else {
        errorMessage += `: ${response.statusText}`;
    }

    throw new Error(errorMessage);
}