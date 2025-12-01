package com.IFC.BCC2025.to_do_list.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty; // Adicionado para consistência

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;

@Entity
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private Integer priority;

    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    @ManyToOne
    @JoinColumn(name = "fk_user_id")
    @JsonIgnore
    private User user;

    @ManyToOne
    @JoinColumn(name = "fk_dashboard_id")
    @JsonIgnore
    private Dashboard dashboard;

    @Lob
    @Column(name = "Image", columnDefinition = "LONGTEXT")
    private String image; 

    public Task() {}

    public Task(String title, String description, Integer priority, TaskStatus status, User user, Dashboard dashboard, String image) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.user = user;
        this.dashboard = dashboard;
        this.image = image; 
    }

    @JsonProperty("imageBase64")
    public String getImageBase64ForDisplay() {
        return this.image; 
    }
    
    public String getImage() {
        return this.image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getPriority() { return priority; }
    public void setPriority(Integer priority) { this.priority = priority; }
    
    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Dashboard getDashboard() { return this.dashboard; }
    public void setDashboard(Dashboard dashboard) { this.dashboard = dashboard; }
} 