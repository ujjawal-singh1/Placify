package com.Placify.Service;


import com.Placify.Entity.Question;
import com.Placify.Repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    public ResponseEntity<List<Question>> getAllQuestions() {
        try{
            return new ResponseEntity<>(questionRepository.findAll(), HttpStatus.OK);
        }
        catch(Exception e){
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(),HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<List<Question>> getQuestionsByCategory(String category) {
        try{
            return new ResponseEntity<>(questionRepository.findByCategory(category), HttpStatus.OK);
        }
        catch(Exception e){
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(),HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<String> addQuestion(Question question) {
       questionRepository.save(question);
       try {
           return new ResponseEntity<>("Success",HttpStatus.CREATED);
       } catch (Exception e) {
           e.printStackTrace();
       }
        return new ResponseEntity<>("Failure",HttpStatus.BAD_REQUEST);
    }
    public ResponseEntity<String> addQuestions(List<Question> questions) {
        if (questions == null || questions.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Request must contain at least 1 question");
        }
        // optional: validate count limit
        if (questions.size() > 200) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Too many questions in one request. Max 200.");
        }

        questionRepository.saveAll(questions);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Saved " + questions.size() + " questions");
    }

    public ResponseEntity<String> deleteQuestion(String id) {
        if(questionRepository.existsById(id)){
            questionRepository.deleteById(id);
            return ResponseEntity.ok("Question deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Question not found");
        }
    }
}
