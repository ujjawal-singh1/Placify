package com.Placify.Repository;

import com.Placify.Entity.QuizAttempt;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface QuizAttemptRepository extends MongoRepository<QuizAttempt, String> {
    List<QuizAttempt> findByUserId(String userId);
    boolean existsByUserIdAndQuizId(String userId, String quizId);
    List<QuizAttempt> findByQuizId(String quizId);
}

