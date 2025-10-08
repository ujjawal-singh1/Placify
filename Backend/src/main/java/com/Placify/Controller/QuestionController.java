package com.Placify.Controller;


import com.Placify.Entity.Question;
import com.Placify.Service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("question")
public class QuestionController {

    @Autowired
    private QuestionService questionService;


    @GetMapping
    public ResponseEntity<List<Question>> getAllQuestions(){
        return questionService.getAllQuestions();
    }

    @GetMapping("/category/{cat}")

    public ResponseEntity<List<Question>> getQuestionsByCategory(@PathVariable("cat") String category){
        return questionService.getQuestionsByCategory(category);
    }

    @PostMapping("add")
    public ResponseEntity<String> addQuestion(@RequestBody Question question){
        return questionService.addQuestion(question);
    }
    @PostMapping("addAll")
    public ResponseEntity<String> addQuestions(@RequestBody List<Question> questions){
        return questionService.addQuestions(questions);
    }


    @DeleteMapping("/remove/{id}")
    public ResponseEntity<String> deleteQuestion(@PathVariable String id){
        return questionService.deleteQuestion(id);
    }
}
