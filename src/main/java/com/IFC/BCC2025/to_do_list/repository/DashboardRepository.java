package com.IFC.BCC2025.to_do_list.repository;

import com.IFC.BCC2025.to_do_list.model.Dashboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DashboardRepository extends JpaRepository<Dashboard, Long> {
    
    List<Dashboard> findByUserId(Long userId);
}