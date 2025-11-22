package com.IFC.BCC2025.to_do_list.repository;

import com.IFC.BCC2025.to_do_list.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    List<Task> findByDashboardId(Long dashboardId);
}