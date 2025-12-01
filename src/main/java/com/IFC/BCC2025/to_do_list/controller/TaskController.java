package com.IFC.BCC2025.to_do_list.controller;

import com.IFC.BCC2025.to_do_list.model.Task;
import com.IFC.BCC2025.to_do_list.model.DTO.TaskDTO;
import com.IFC.BCC2025.to_do_list.service.TaskService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService){
        this.taskService = taskService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) throws Exception{
        Task task = taskService.getTaskById(id);
        return ResponseEntity.ok(task);
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks(@RequestParam(name = "dashboardId") Long dashboardId) throws Exception {
    List<Task> tasks = taskService.getAllTasks(dashboardId);
    return ResponseEntity.ok(tasks);
    }

    @PostMapping("/{userId}/{dashId}")
    public ResponseEntity<Task> createTask(@PathVariable Long userId, @PathVariable Long dashId, @RequestBody TaskDTO taskDto) throws Exception {
        Task task = taskService.createTask(
            taskDto.getTitle(), 
            taskDto.getDescription(), 
            taskDto.getPriority(), 
            taskDto.getTaskStatus(), 
            userId, 
            dashId, 
            taskDto.getImage() 
        );
        return ResponseEntity.ok(task);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody TaskDTO body) throws Exception {
        Task task = taskService.updateTask(
            id, 
            body.getTitle(),
            body.getDescription(), 
            body.getPriority(), 
            body.getTaskStatus(), 
            body.getImage()
        );
        return ResponseEntity.ok(task);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) throws Exception{
        taskService.deleteTask(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/dashboard/{id}")
    public ResponseEntity<Void> deleteTaskByDashId(@PathVariable Long dashId) throws Exception{
        taskService.deleteTaskByDashId(dashId);
        return ResponseEntity.ok().build();
    }
}