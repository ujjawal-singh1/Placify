package com.Placify.Service;

import com.Placify.Entity.QuizAttempt;
import com.Placify.Repository.QuizAttemptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuizAttemptService {

    private final QuizAttemptRepository quizAttemptRepo;

    // Save attempt with duplicate check
    public ResponseEntity<?> saveAttempt(QuizAttempt attempt) {
        if (quizAttemptRepo.existsByUserIdAndQuizId(attempt.getUserId(), attempt.getQuizId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("You have already attempted this quiz.");
        }
        attempt.setAttempted(true);
        attempt.setSubmittedAt(Instant.now());
        QuizAttempt saved = quizAttemptRepo.save(attempt);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // Check if user already attempted
    public boolean hasAttempted(String userId, String quizId) {
        return quizAttemptRepo.existsByUserIdAndQuizId(userId, quizId);
    }

    // Get all attempts (admin)
    public List<QuizAttempt> getAllAttempts() {
        return quizAttemptRepo.findAll();
    }

    // Get attempts by quiz (admin)
    public List<QuizAttempt> getAttemptsByQuiz(String quizId) {
        return quizAttemptRepo.findByQuizId(quizId);
    }

    // Get attempts by user
    public List<QuizAttempt> getAttemptsByUser(String userId) {
        return quizAttemptRepo.findByUserId(userId);
    }
}
