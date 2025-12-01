package com.IFC.BCC2025.to_do_list.service;

import java.util.List;
import java.util.Optional;
import java.util.Objects;

import org.springframework.stereotype.Service;

import com.IFC.BCC2025.to_do_list.model.Dashboard;
import com.IFC.BCC2025.to_do_list.model.Task;
import com.IFC.BCC2025.to_do_list.model.TaskStatus;
import com.IFC.BCC2025.to_do_list.model.User;
import com.IFC.BCC2025.to_do_list.repository.DashboardRepository;
import com.IFC.BCC2025.to_do_list.repository.TaskRepository;
import com.IFC.BCC2025.to_do_list.repository.UserRepository;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    private final UserRepository userRepository;

    private final DashboardRepository dashboardRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository, DashboardRepository dashboardRepository){
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.dashboardRepository = dashboardRepository;
    }

    public Task createTask(String title, String description, Integer priority, TaskStatus taskStatus, Long userId,
            Long dashboardId, String image) throws Exception{
        User user = getUserById(userId);
        Dashboard dash = getDashboardById(dashboardId);
        Task newTask = new Task(title, description, priority, taskStatus, user, dash, image);
        return taskRepository.save(newTask);
    }

    public User getUserById(Long userId) throws Exception{
        Long nonNullUserId = Objects.requireNonNull(userId, "userId must not be null");
        Optional<User> user = userRepository.findById(nonNullUserId);
        if(!user.isPresent()){
            throw new SecurityException("Usuário não encontrado");
        }
        return user.get();
    }

    public Dashboard getDashboardById(Long dashId) throws Exception{
        Long nonNullDashId = Objects.requireNonNull(dashId, "dashId must not be null");
        Optional<Dashboard> dash = dashboardRepository.findById(nonNullDashId);
        if(!dash.isPresent()){
            throw new SecurityException("Dashboard não encontrada");
        }
        return dash.get();
    }

    public Task getTaskById(Long taskId) throws Exception{
        Long nonNullTaskId = Objects.requireNonNull(taskId, "taskId must not be null");
        Optional<Task> task = taskRepository.findById(nonNullTaskId);
        if(!task.isPresent()){
            throw new SecurityException("Task não encontrada");
        }
        return task.get();
    }

    public List<Task> getAllTasks(Long dashboardId) throws Exception{
        Dashboard dashboard = getDashboardById(dashboardId);
        return taskRepository.findByDashboardId(dashboard.getId());
    }

    public Task updateTask(Long taskId, String title, String description, Integer priority, 
        TaskStatus taskStatus, String image) throws Exception{
        Task task = getTaskById(taskId);
        if (task == null) {
            throw new IllegalStateException("ERROR: Task not found for update");
        }
        
        if(title != null) task.setTitle(title);
        if(description != null) task.setDescription(description);
        if(priority != null) task.setPriority(priority);
        if(taskStatus != null) task.setStatus(taskStatus);
        if(image != null) task.setImage(image);
        
        return taskRepository.save(task);
    }

    public void deleteTask(Long taskId) throws Exception{
        Task task = getTaskById(taskId);
        Long id = Objects.requireNonNull(task.getId(), "Task id must not be null");
        taskRepository.deleteById(id);
    }

    public void deleteTaskByDashId(Long dashId) throws Exception{
        List<Task> tasks = getAllTasks(dashId);
        if(tasks != null && !tasks.isEmpty()){
            taskRepository.deleteAll(tasks);
        }
    }

}