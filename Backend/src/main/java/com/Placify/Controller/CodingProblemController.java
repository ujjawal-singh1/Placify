package com.Placify.Controller;

import com.Placify.Entity.CodingProblem;
import com.Placify.Entity.CodingSubmission;
import com.Placify.Service.CodingProblemService;
import com.Placify.Service.CodingSubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coding")
public class CodingProblemController {

    @Autowired
    private CodingProblemService problemService;

    @Autowired
    private CodingSubmissionService submissionService;

    // ──────────────── PROBLEMS CRUD ────────────────

    @GetMapping("/problems")
    public ResponseEntity<List<CodingProblem>> getAllProblems() {
        return ResponseEntity.ok(problemService.getAllProblems());
    }

    @GetMapping("/problems/{id}")
    public ResponseEntity<CodingProblem> getProblemById(@PathVariable String id) {
        return problemService.getProblemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/problems/category/{category}")
    public ResponseEntity<List<CodingProblem>> getProblemsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(problemService.getProblemsByCategory(category));
    }

    @GetMapping("/problems/difficulty/{difficulty}")
    public ResponseEntity<List<CodingProblem>> getProblemsByDifficulty(@PathVariable String difficulty) {
        return ResponseEntity.ok(problemService.getProblemsByDifficulty(difficulty));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        return ResponseEntity.ok(problemService.getAllCategories());
    }

    @PostMapping("/problems")
    public ResponseEntity<CodingProblem> createProblem(@RequestBody CodingProblem problem) {
        return ResponseEntity.ok(problemService.createProblem(problem));
    }

    @PutMapping("/problems/{id}")
    public ResponseEntity<CodingProblem> updateProblem(
            @PathVariable String id,
            @RequestBody CodingProblem problem) {
        return ResponseEntity.ok(problemService.updateProblem(id, problem));
    }

    @DeleteMapping("/problems/{id}")
    public ResponseEntity<String> deleteProblem(@PathVariable String id) {
        problemService.deleteProblem(id);
        return ResponseEntity.ok("Deleted successfully");
    }

    // ──────────────── CODE EXECUTION ────────────────

    @PostMapping("/run")
    public ResponseEntity<Map<String, Object>> runCode(@RequestBody Map<String, String> request) {
        String problemId = request.get("problemId");
        String language = request.get("language");
        String code = request.get("code");

        Map<String, Object> result = submissionService.runCode(problemId, language, code);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/submit")
    public ResponseEntity<CodingSubmission> submitSolution(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        String problemId = request.get("problemId");
        String language = request.get("language");
        String code = request.get("code");

        CodingSubmission submission = submissionService.submitSolution(userId, problemId, language, code);
        return ResponseEntity.ok(submission);
    }

    // ──────────────── SUBMISSIONS ────────────────

    @GetMapping("/submissions/user/{userId}")
    public ResponseEntity<List<CodingSubmission>> getUserSubmissions(@PathVariable String userId) {
        return ResponseEntity.ok(submissionService.getUserSubmissions(userId));
    }

    @GetMapping("/submissions/problem/{problemId}")
    public ResponseEntity<List<CodingSubmission>> getProblemSubmissions(@PathVariable String problemId) {
        return ResponseEntity.ok(submissionService.getProblemSubmissions(problemId));
    }

    @GetMapping("/submissions/user/{userId}/problem/{problemId}")
    public ResponseEntity<List<CodingSubmission>> getUserProblemSubmissions(
            @PathVariable String userId,
            @PathVariable String problemId) {
        return ResponseEntity.ok(submissionService.getUserProblemSubmissions(userId, problemId));
    }
}
