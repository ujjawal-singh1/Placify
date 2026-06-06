package com.Placify.Repository;

import com.Placify.Entity.ProctorLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ProctorLogRepo extends MongoRepository<ProctorLog, String> {
    List<ProctorLog> findByUserId(String userId);
    List<ProctorLog> findByAttemptId(String attemptId);
}
