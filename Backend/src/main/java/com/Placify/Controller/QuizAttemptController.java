package com.Placify.Controller;

import com.Placify.Entity.QuizAttempt;
import com.Placify.Service.JwtService;
import com.Placify.Service.QuizAttemptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("quiz-attempt")
@RequiredArgsConstructor
public class QuizAttemptController {

    private final QuizAttemptService quizAttemptService;
    private final JwtService jwtService;

    // -------------------------------------------------------
    // POST /quiz-attempt — Save quiz attempt (called by frontend Quiz.jsx)
    // Extracts userId from JWT Bearer token in Authorization header
    // -------------------------------------------------------
    @PostMapping
    public ResponseEntity<?> saveAttempt(
            @RequestBody QuizAttempt attempt,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        String email = jwtService.extractEmail(token);

        if (email == null) {
            return ResponseEntity.status(401).body("Invalid token");
        }

        attempt.setUserId(email);
        return quizAttemptService.saveAttempt(attempt);
    }

    // -------------------------------------------------------
    // GET /quiz-attempt/check/{quizId} — Check if user already attempted
    // -------------------------------------------------------
    @GetMapping("/check/{quizId}")
    public ResponseEntity<Map<String, Boolean>> checkAttempted(
            @PathVariable String quizId,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        String email = jwtService.extractEmail(token);

        if (email == null) {
            return ResponseEntity.status(401).build();
        }

        boolean attempted = quizAttemptService.hasAttempted(email, quizId);
        return ResponseEntity.ok(Map.of("attempted", attempted));
    }

    // -------------------------------------------------------
    // GET /quiz-attempt/all — Get all attempts (admin)
    // -------------------------------------------------------
    @GetMapping("/all")
    public ResponseEntity<List<QuizAttempt>> getAllAttempts() {
        return ResponseEntity.ok(quizAttemptService.getAllAttempts());
    }

    // -------------------------------------------------------
    // GET /quiz-attempt/quiz/{quizId} — Get attempts by quiz (admin)
    // -------------------------------------------------------
    @GetMapping("/quiz/{quizId}")
    public ResponseEntity<List<QuizAttempt>> getAttemptsByQuiz(@PathVariable String quizId) {
        return ResponseEntity.ok(quizAttemptService.getAttemptsByQuiz(quizId));
    }
}
