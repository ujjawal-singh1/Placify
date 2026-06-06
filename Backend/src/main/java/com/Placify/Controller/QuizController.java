package com.Placify.Controller;

import com.Placify.Entity.*;
import com.Placify.Service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("quiz")
public class QuizController {

    @Autowired
    private QuizService quizService;

    // --------------------------------------------------------
    // Create Quiz
    // --------------------------------------------------------
    @PostMapping("create")
    public ResponseEntity<String> createQuiz(
            @RequestParam String category,
            @RequestParam int numQ,
            @RequestParam String title,
            @RequestParam int duration   // ⭐ ADD
    ){
        return quizService.createQuiz(category, numQ, title, duration);
    }


    @GetMapping("/details/{id}")
    public ResponseEntity<Quiz> getQuizDetails(@PathVariable String id) {
        Optional<Quiz> quiz = quizService.getQuizDetails(id);
        return quiz.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // --------------------------------------------------------
    // Get Quiz Questions (wrapper)
    // --------------------------------------------------------
    @GetMapping("/get/{id}")
    public ResponseEntity<List<QuestionWrapper>> getQuizQuestions(@PathVariable String id){
        return quizService.getQuizQuestions(id);
    }

    // --------------------------------------------------------
    // Submit Quiz
    // --------------------------------------------------------
    @PostMapping("/submit/{id}")
    public ResponseEntity<Integer> submitQuiz(
            @PathVariable String id,
            @RequestBody List<Response> responses){
        return quizService.calculateResult(id,responses);
    }
    @GetMapping("/category/{cat}")
    public ResponseEntity<List<Quiz>> getQuizByCategory(@PathVariable String cat) {
        return quizService.getQuizByCategory(cat);
    }

    @GetMapping("/title/{title}")
    public ResponseEntity<List<Quiz>> getQuizByTitle(@PathVariable String title) {
        return quizService.getQuizByTitle(title);
    }

    // --------------------------------------------------------
    // Get all categories
    // --------------------------------------------------------
    @GetMapping("category")
    public ResponseEntity<List<String>> getCategory(){
        return quizService.getCategory();
    }

    @GetMapping("titles")
    public ResponseEntity<List<String>> getTitle(){
        return quizService.getTitle();
    }

    // --------------------------------------------------------
    // Get ALL quizzes
    // --------------------------------------------------------
    @GetMapping("/all")
    public ResponseEntity<List<Quiz>> getAllQuizzes() {
        return quizService.getAllQuizzes();
    }

    // --------------------------------------------------------
    // Delete quiz
    // --------------------------------------------------------
    @DeleteMapping("/remove/{id}")
    public ResponseEntity<String> deleteQuiz(@PathVariable String id) {
        return quizService.deleteQuiz(id);
    }

    // --------------------------------------------------------
    // Update quiz title
    // --------------------------------------------------------
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateQuizTitle(
            @PathVariable String id,
            @RequestParam String title) {

        return quizService.updateQuizTitle(id, title);
    }

    @GetMapping("/category/{category}/titles")
    public ResponseEntity<List<String>> getTitlesByCategory(
            @PathVariable String category) {
        return quizService.getTitlesByCategory(category);
    }


    // --------------------------------------------------------
    // ATTEMPTS
    // --------------------------------------------------------
    @PostMapping("/attempt/{quizId}")
    public ResponseEntity<Attempt> saveAttempt(
            @PathVariable String quizId,
            @RequestBody Attempt attempt){
        return quizService.saveAttempt(quizId, attempt);
    }

    @GetMapping("/attempts/quiz/{quizId}")
    public ResponseEntity<List<Attempt>> getAttemptsByQuiz(@PathVariable String quizId){
        return quizService.getAttemptsByQuiz(quizId);
    }

    @GetMapping("/attempts/user/{userId}")
    public ResponseEntity<List<Attempt>> getAttemptsByUser(@PathVariable String userId){
        return quizService.getAttemptsByUser(userId);
    }

    // --------------------------------------------------------
    // PROCTORING
    // --------------------------------------------------------
    @PostMapping("/proctor/upload")
    public ResponseEntity<String> uploadProctor(@RequestBody ProctorLog log) {
        return quizService.saveProctorLog(log);
    }

    @GetMapping("/proctor/attempt/{attemptId}")
    public ResponseEntity<List<ProctorLog>> getProctorByAttempt(@PathVariable String attemptId) {
        return quizService.getProctorLogsByAttempt(attemptId);
    }

}
