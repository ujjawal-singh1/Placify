package com.Placify.Service;

import com.Placify.Entity.Question;
import com.Placify.Entity.QuestionWrapper;
import com.Placify.Entity.Quiz;
import com.Placify.Entity.Response;
import com.Placify.Repository.QuestionRepository;
import com.Placify.Repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;


    public ResponseEntity<String> createQuiz(String category, int numQ, String title) {
        try{
            List<Question> questions=questionRepository.findRandomQuestionsByCategory(category,numQ);
            Quiz quiz=new Quiz();
            quiz.setTitle(title);
            quiz.setQuestion(questions);
            quizRepository.save(quiz);
            return new ResponseEntity<>("Success", HttpStatus.CREATED);
        }
        catch (Exception e){
            e.printStackTrace();
        }
        return new ResponseEntity<>("Failure", HttpStatus.NOT_ACCEPTABLE);
    }

    public ResponseEntity<List<QuestionWrapper>> getQuizQuestions(String id) {
        Optional<Quiz> quiz=quizRepository.findById(id);
        List<Question> questionsFromDb=quiz.get().getQuestion();
        List<QuestionWrapper> questionsForUser=new ArrayList<>();

        for(Question q:questionsFromDb){
            QuestionWrapper qw=new QuestionWrapper(q.getId(),q.getQuetionTitle(),q.getOption1(),q.getOption2(),q.getOption3(),q.getOption4());
            questionsForUser.add(qw);
        }

        return new ResponseEntity<>(questionsForUser,HttpStatus.OK);
    }

    public ResponseEntity<Integer> calculateResult(String id, List<Response> responses) {
        Optional<Quiz> quiz=quizRepository.findById(id);
        List<Question> questions=quiz.get().getQuestion();
        int right=0;
        int i=0;
        for(Response response:responses){
            if(response.getResponse().equals(questions.get(i).getRightAnswer()))
                right++;
            i++;
        }

        return new ResponseEntity<>(right,HttpStatus.OK);
    }

    public ResponseEntity<List<String>> getCategory() {
        List<String> categories=questionRepository.findCategory();

        return new ResponseEntity<>(categories,HttpStatus.OK);
    }
}
