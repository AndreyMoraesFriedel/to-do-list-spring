package com.IFC.BCC2025.to_do_list.model.DTO;

public class DashboardDTO {
    private String dashboardName;

    public DashboardDTO(){}

    public DashboardDTO(String dashboardName){
        this.dashboardName = dashboardName;
    }

    public String getDashboardName() {
        return dashboardName;
    }

    public void setDashboardName(String dashboardName) {
        this.dashboardName = dashboardName;
    }

}
