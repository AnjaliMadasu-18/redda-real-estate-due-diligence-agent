package com.realestate.backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.realestate.backend.Service.ScheduledMonitoringService;

@RestController
@RequestMapping("/api/monitoring")
public class ScheduledMonitoringController {

    @Autowired
    private ScheduledMonitoringService scheduledMonitoringService;

    @PostMapping("/run")
    public String runMonitoring() {

        scheduledMonitoringService.runMonitoring();

        return "Monitoring check completed successfully.";
    }
}