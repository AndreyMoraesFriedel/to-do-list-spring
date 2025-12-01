package com.IFC.BCC2025.to_do_list.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.IFC.BCC2025.to_do_list.model.Dashboard;
import com.IFC.BCC2025.to_do_list.model.User;
import com.IFC.BCC2025.to_do_list.repository.DashboardRepository;
import com.IFC.BCC2025.to_do_list.repository.UserRepository;

@Service
public class DashboardService {
    private final DashboardRepository dashboardRepository;
    private final UserRepository userRepository;

    public DashboardService(DashboardRepository dashboardRepository, UserRepository userRepository){
        this.dashboardRepository = dashboardRepository;
        this.userRepository = userRepository;
    }

    public Dashboard createDashboard(String dashboardName, Long userId) throws Exception{
        User user = getUserById(userId);
        Dashboard dash = new Dashboard(dashboardName, user);      
        Dashboard savedDashboard = dashboardRepository.save(dash);
        return savedDashboard;
    }

    public List<Dashboard> getDashboardByUserId(Long userId) throws Exception{
        User user = getUserById(userId);
        return dashboardRepository.findByUserId(user.getId());
    }

    public Dashboard getDashboardById(Long dashId) throws Exception{
        java.util.Objects.requireNonNull(dashId, "dashId must not be null");
        Optional<Dashboard> dash = dashboardRepository.findById(dashId);
        if(!dash.isPresent()){
            throw new SecurityException("Dashboard não encontrada");
        }
        return dash.get();
    }

    public Dashboard updateDashboardName(Long dashId, String dashName) throws Exception{
        Dashboard dash = getDashboardById(dashId);
        dash.setDashboardName(dashName);
        return dashboardRepository.save(dash);
    }

    public void deleteDashboard(Long dashId) throws Exception{
        java.util.Objects.requireNonNull(dashId, "dashId must not be null");
        getDashboardById(dashId);
        dashboardRepository.deleteById(dashId);
    }

    public User getUserById(Long userId) throws Exception{
        java.util.Objects.requireNonNull(userId, "dashId must not be null");
        Optional<User> user = userRepository.findById(userId);
        if(!user.isPresent()){
            throw new SecurityException("Usuário não encontrado");
        }
        return user.get();
    }
}