package com.Placify.Service;

import com.Placify.Dto.DashboardStatsDto;
import com.Placify.Entity.QuizAttempt;
import com.Placify.Repository.QuizAttemptRepository;
import com.Placify.Repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final QuizAttemptRepository quizAttemptRepo;
    private final QuizRepository quizRepository;

    public DashboardStatsDto getStats(String userId) {

        // ✅ TOTAL quizzes in system
        int totalQuizzes = (int) quizRepository.count();

        // ✅ Attempts by this user
        List<QuizAttempt> attempts =
                quizAttemptRepo.findByUserId(userId);

        int attempted = attempts.size();
        int pending = totalQuizzes - attempted;

        double avgScore = attempts.stream()
                .filter(a -> a.getTotalMarks() > 0)
                .mapToDouble(a ->
                        (a.getScore() * 100.0) / a.getTotalMarks()
                )
                .average()
                .orElse(0);

        return new DashboardStatsDto(
                totalQuizzes,
                attempted,
                Math.max(pending, 0),
                Math.round(avgScore) + "%"
        );
    }
}
