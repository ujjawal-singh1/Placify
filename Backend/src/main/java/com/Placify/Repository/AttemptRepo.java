package com.Placify.Repository;

import com.Placify.Entity.Attempt;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AttemptRepo extends MongoRepository<Attempt, String> {
    List<Attempt> findByQuizId(String quizId);
    List<Attempt> findByUserId(String userId);
}
