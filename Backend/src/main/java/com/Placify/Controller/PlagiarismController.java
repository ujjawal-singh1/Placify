package com.Placify.Controller;

import com.Placify.Entity.PlagiarismResult;
import com.Placify.Service.PlagiarismService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/plagiarism")
public class PlagiarismController {

    @Autowired
    private PlagiarismService plagiarismService;

    // --------------------------------------------------------
    // Trigger plagiarism analysis for all attempts on a quiz
    // --------------------------------------------------------
    @PostMapping("/analyze/{quizId}")
    public ResponseEntity<List<PlagiarismResult>> analyzeQuiz(@PathVariable String quizId) {
        List<PlagiarismResult> results = plagiarismService.analyzeQuiz(quizId);
        return ResponseEntity.ok(results);
    }

    // --------------------------------------------------------
    // Get plagiarism results for a specific quiz
    // --------------------------------------------------------
    @GetMapping("/results/{quizId}")
    public ResponseEntity<List<PlagiarismResult>> getResults(@PathVariable String quizId) {
        return ResponseEntity.ok(plagiarismService.getResultsByQuiz(quizId));
    }

    // --------------------------------------------------------
    // Get all flagged results across quizzes
    // --------------------------------------------------------
    @GetMapping("/flagged")
    public ResponseEntity<List<PlagiarismResult>> getFlagged() {
        return ResponseEntity.ok(plagiarismService.getFlaggedResults());
    }
}
