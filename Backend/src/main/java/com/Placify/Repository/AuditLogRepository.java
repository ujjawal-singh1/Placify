package com.Placify.Repository;

import com.Placify.Entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AuditLogRepository extends MongoRepository<AuditLog, String> {

    Page<AuditLog> findByActionContainingIgnoreCase(
            String action,
            Pageable pageable
    );

    Page<AuditLog> findByAdminEmailContainingIgnoreCase(
            String adminEmail,
            Pageable pageable
    );
}

