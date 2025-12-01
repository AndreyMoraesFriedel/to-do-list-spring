package com.IFC.BCC2025.to_do_list.model.DTO;

import com.IFC.BCC2025.to_do_list.model.TaskStatus;

public class TaskDTO {
    private String title;
    private String description;
    private Integer priority;
    private TaskStatus taskStatus;
    private String image;

    public TaskDTO(){}

    public TaskDTO(String title, String description, Integer priority, TaskStatus taskStatus, String image) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.taskStatus = taskStatus;
        this.image = image;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public TaskStatus getTaskStatus() {
        return taskStatus;
    }

    public void setTaskStatus(TaskStatus taskStatus) {
        this.taskStatus = taskStatus;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
    
}