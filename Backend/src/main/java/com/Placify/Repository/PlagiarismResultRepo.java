package com.Placify.Repository;

import com.Placify.Entity.PlagiarismResult;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface PlagiarismResultRepo extends MongoRepository<PlagiarismResult, String> {
    List<PlagiarismResult> findByQuizId(String quizId);
    List<PlagiarismResult> findByFlaggedTrue();
    List<PlagiarismResult> findByUserId1OrUserId2(String userId1, String userId2);
}
