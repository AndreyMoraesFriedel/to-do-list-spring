package com.IFC.BCC2025.to_do_list.controller;

import com.IFC.BCC2025.to_do_list.model.Dashboard;
import com.IFC.BCC2025.to_do_list.model.Task;
import com.IFC.BCC2025.to_do_list.model.User;
import com.IFC.BCC2025.to_do_list.repository.DashboardRepository;
import com.IFC.BCC2025.to_do_list.repository.TaskRepository;
import com.IFC.BCC2025.to_do_list.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DashboardRepository dashboardRepository;

    @GetMapping
    public List<Task> getAllTasks(@RequestParam(required = false) Long dashboardId) {
        if (dashboardId != null) {
            return taskRepository.findByDashboardId(dashboardId);
        }
        return taskRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Optional<Task> task = taskRepository.findById(id);
        return task.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }

    public static class TaskDTO {
        public String title;
        public String description;
        public Integer priority;
        public Long userId;
        public Long dashboardId;
        public String image;
    }

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody TaskDTO taskDto) {
        Optional<User> userOpt = userRepository.findById(taskDto.userId);
        Optional<Dashboard> dashOpt = dashboardRepository.findById(taskDto.dashboardId);

        if (userOpt.isEmpty() || dashOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Task newTask = new Task();
        newTask.setTitle(taskDto.title);
        newTask.setDescription(taskDto.description);
        newTask.setPriority(taskDto.priority);
        newTask.setUser(userOpt.get());
        newTask.setDashboard(dashOpt.get());
        newTask.setImageBase64(taskDto.image);

        Task savedTask = taskRepository.save(newTask);
        return ResponseEntity.ok(savedTask);

        
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        return taskRepository.findById(id)
            .map(task -> {
                task.setTitle(taskDetails.getTitle());
                task.setDescription(taskDetails.getDescription());
                task.setPriority(taskDetails.getPriority());
                
                Task updatedTask = taskRepository.save(task);
                return ResponseEntity.ok(updatedTask);
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        return taskRepository.findById(id)
            .map(task -> {
                taskRepository.delete(task);
                return ResponseEntity.ok().build();
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
}