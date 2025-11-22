package com.IFC.BCC2025.to_do_list.controller;

import com.IFC.BCC2025.to_do_list.model.Dashboard;
import com.IFC.BCC2025.to_do_list.model.User; // <--- 1. IMPORTANTE: Import do User
import com.IFC.BCC2025.to_do_list.repository.DashboardRepository;
import com.IFC.BCC2025.to_do_list.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/dashboards") 
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DashboardRepository dashboardRepository;

    @Autowired 
    private UserRepository userRepository;


    @PostMapping("/user/{userId}")
    public ResponseEntity<Object> createDashboard(@RequestBody Dashboard dashboard, @PathVariable Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        
        if (userOptional.isPresent()) {
            dashboard.setUser(userOptional.get());
            
            Dashboard savedDashboard = dashboardRepository.save(dashboard);
            return ResponseEntity.ok(savedDashboard);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado");
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Dashboard>> getDashboardsByUser(@PathVariable Long userId) {
        List<Dashboard> dashboards = dashboardRepository.findByUserId(userId);
        
        return ResponseEntity.ok(dashboards);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Dashboard> getDashboardById(@PathVariable Long id) {
        Optional<Dashboard> dashboard = dashboardRepository.findById(id);
        
        return dashboard.map(ResponseEntity::ok)
                        .orElseGet(() -> ResponseEntity.notFound().build());
    }
}