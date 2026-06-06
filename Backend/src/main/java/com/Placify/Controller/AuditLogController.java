package com.Placify.Controller;

import com.Placify.Entity.AuditLog;
import com.Placify.Repository.AuditLogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/audit-logs")
public class AuditLogController {

    private final AuditLogRepository repo;

    public AuditLogController(AuditLogRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public Page<AuditLog> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String action,
            @RequestParam(defaultValue = "") String admin
    ) {
        Pageable pageable =
                PageRequest.of(page, size, Sort.by("timestamp").descending());

        if (!action.isEmpty()) {
            return repo.findByActionContainingIgnoreCase(action, pageable);
        }

        if (!admin.isEmpty()) {
            return repo.findByAdminEmailContainingIgnoreCase(admin, pageable);
        }

        return repo.findAll(pageable);
    }
}
