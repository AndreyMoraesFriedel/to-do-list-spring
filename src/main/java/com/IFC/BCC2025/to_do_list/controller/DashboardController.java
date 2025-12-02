package com.IFC.BCC2025.to_do_list.controller;

import com.IFC.BCC2025.to_do_list.model.Dashboard;
import com.IFC.BCC2025.to_do_list.model.DTO.DashboardDTO;
import com.IFC.BCC2025.to_do_list.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboards") 
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService){
        this.dashboardService = dashboardService;
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<Dashboard> createDashboard(@RequestBody DashboardDTO dashDTO, @PathVariable Long userId) {
        Dashboard dash = dashboardService.createDashboard(dashDTO.getDashboardName(), userId);
        return ResponseEntity.ok(dash);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Dashboard>> getDashboardsByUser(@PathVariable Long userId) {
        List<Dashboard> dashboards = dashboardService.getDashboardByUserId(userId);        
        return ResponseEntity.ok(dashboards);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Dashboard> getDashboardById(@PathVariable Long id) {
        Dashboard dash = dashboardService.getDashboardById(id);
        return ResponseEntity.ok(dash);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Dashboard> updateDashboardName(@RequestBody DashboardDTO dashDTO, @PathVariable Long id) {
        Dashboard dash = dashboardService.updateDashboardName(id, dashDTO.getDashboardName());
        return ResponseEntity.ok(dash);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDashboard(@PathVariable Long id) {
        dashboardService.deleteDashboard(id);
        return ResponseEntity.ok().build();
    }
}