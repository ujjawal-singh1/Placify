package com.Placify.Service;

import com.Placify.Entity.*;
import com.Placify.Repository.*;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.Map;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AttemptRepo attemptRepo;

    @Autowired
    private ProctorLogRepo proctorLogRepo;

    @Autowired
    private Cloudinary cloudinary;

    // issue types grouped by severity for proctoring classification
    private static final Set<String> HIGH_SEVERITY = Set.of("multiple_faces", "phone_detected");
    private static final Set<String> MEDIUM_SEVERITY = Set.of("no_face", "looking_away", "suspicious_movement");

    // -------------------------------------------------------------
    // CREATE QUIZ
    // -------------------------------------------------------------
    public ResponseEntity<String> createQuiz(String category, int numQ, String title, int duration) {
        try {
            List<Question> questions =
                    questionRepository.findRandomQuestionsByCategory(category, numQ);

            Quiz quiz = new Quiz();
            quiz.setTitle(title);
            quiz.setCategory(category);
            quiz.setQuestion(questions);
            quiz.setDuration(duration); // ⭐ ADD THIS

            quizRepository.save(quiz);

            return new ResponseEntity<>(quiz.getId(), HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>("Failure", HttpStatus.NOT_ACCEPTABLE);
    }

    public Optional<Quiz> getQuizDetails(String id) {
        return quizRepository.findById(id);
    }


    // -------------------------------------------------------------
    // GET QUIZ QUESTIONS (only options, not correct answer)
    // -------------------------------------------------------------
    public ResponseEntity<List<QuestionWrapper>> getQuizQuestions(String id) {
        Optional<Quiz> quiz = quizRepository.findById(id);
        if (quiz.isEmpty()) return ResponseEntity.notFound().build();

        List<Question> questionsFromDb = quiz.get().getQuestion();
        List<QuestionWrapper> finalQuestions = new ArrayList<>();

        for (Question q : questionsFromDb) {
            QuestionWrapper qw = new QuestionWrapper(
                    q.getId(),
                    q.getQuetionTitle(),
                    q.getOption1(),
                    q.getOption2(),
                    q.getOption3(),
                    q.getOption4()
            );
            finalQuestions.add(qw);
        }

        return ResponseEntity.ok(finalQuestions);
    }

    // -------------------------------------------------------------
    // CALCULATE SCORE
    // -------------------------------------------------------------
    public ResponseEntity<Integer> calculateResult(String id, List<Response> responses) {
        Optional<Quiz> quiz = quizRepository.findById(id);
        if (quiz.isEmpty()) return ResponseEntity.notFound().build();

        List<Question> questions = quiz.get().getQuestion();

        int right = 0;
        int index = 0;

        for (Response r : responses) {
            if (index >= questions.size()) break;

            String userAns = r.getResponse();   // can be null
            String correctAns = questions.get(index).getRightAnswer();

            if (userAns != null && userAns.equals(correctAns)) {
                right++;
            }

            index++;
        }

        return ResponseEntity.ok(right);
    }


    // -------------------------------------------------------------
    // GET ALL CATEGORIES (for dropdown)
    // -------------------------------------------------------------
    public ResponseEntity<List<String>> getCategory() {
        List<String> categories = questionRepository.findCategory();
        return ResponseEntity.ok(categories);
    }

    // -------------------------------------------------------------
    // GET ALL QUIZZES
    // -------------------------------------------------------------
    public ResponseEntity<List<Quiz>> getAllQuizzes() {
        return ResponseEntity.ok(quizRepository.findAll());
    }

    // -------------------------------------------------------------
    // DELETE QUIZ
    // -------------------------------------------------------------
    public ResponseEntity<String> deleteQuiz(String id) {
        quizRepository.deleteById(id);
        return ResponseEntity.ok("Quiz deleted successfully");
    }

    public ResponseEntity<List<Quiz>> getQuizByCategory(String cat) {
        return ResponseEntity.ok(quizRepository.findByCategory(cat));
    }

    // -------------------------------------------------------------
    // UPDATE QUIZ TITLE
    // -------------------------------------------------------------
    public ResponseEntity<String> updateQuizTitle(String id, String title) {
        Quiz quiz = quizRepository.findById(id).orElse(null);
        if (quiz == null) return ResponseEntity.badRequest().body("Quiz not found");

        quiz.setTitle(title);
        quizRepository.save(quiz);

        return ResponseEntity.ok("Quiz title updated");
    }


    // -------------------------------------------------------------
    // SAVE ATTEMPT (PROCTORING + SCORE STORAGE)
    // -------------------------------------------------------------
    public ResponseEntity<Attempt> saveAttempt(String quizId, Attempt attempt) {

        attempt.setQuizId(quizId);
        attempt.setTimestamp(Instant.now());

        // Save attempt
        Attempt saved = attemptRepo.save(attempt);

        return ResponseEntity.ok(saved);
    }

    // -------------------------------------------------------------
    // GET ATTEMPTS BY QUIZ ID (for admin analytics)
    // -------------------------------------------------------------
    public ResponseEntity<List<Attempt>> getAttemptsByQuiz(String quizId) {
        return ResponseEntity.ok(attemptRepo.findByQuizId(quizId));
    }

    // -------------------------------------------------------------
    // GET ATTEMPTS BY USER ID (student profile)
    // -------------------------------------------------------------
    public ResponseEntity<List<Attempt>> getAttemptsByUser(String userId) {
        return ResponseEntity.ok(attemptRepo.findByUserId(userId));
    }


    // -------------------------------------------------------------
    // SAVE PROCTOR LOG (screenshots / warnings)
    // Computes severity automatically, uploads image to Cloudinary
    // -------------------------------------------------------------
    public ResponseEntity<String> saveProctorLog(ProctorLog log) {

        log.setTimestamp(Instant.now());

        // figure out the severity from the issue type
        String issue = log.getIssue();
        if (issue != null && HIGH_SEVERITY.contains(issue)) {
            log.setSeverity("high");
        } else if (issue != null && MEDIUM_SEVERITY.contains(issue)) {
            log.setSeverity("medium");
        } else {
            log.setSeverity("low");
        }

        // upload the screenshot to Cloudinary if present, no point keeping base64 in mongo
        if (log.getImageBase64() != null && !log.getImageBase64().isEmpty()) {
            try {
                Map uploadResult = cloudinary.uploader().upload(
                        "data:image/jpeg;base64," + log.getImageBase64(),
                        ObjectUtils.asMap("folder", "proctoring", "resource_type", "image")
                );
                String imageUrl = (String) uploadResult.get("secure_url");
                log.setImageUrl(imageUrl);
                log.setImageBase64(null); // clear base64 to save storage
            } catch (Exception e) {
                // don't fail the whole request if upload didn't work
                // TODO: maybe queue for retry later?
                e.printStackTrace();
            }
        }

        proctorLogRepo.save(log);

        return ResponseEntity.ok("Proctor log saved");
    }

    // -------------------------------------------------------------
    // GET PROCTOR LOGS FOR AN ATTEMPT
    // -------------------------------------------------------------
    public ResponseEntity<List<ProctorLog>> getProctorLogsByAttempt(String attemptId) {
        return ResponseEntity.ok(proctorLogRepo.findByAttemptId(attemptId));
    }

    // -------------------------------------------------------------
    // OPTIONAL: UPDATE QUIZ QUESTIONS
    // -------------------------------------------------------------
    public ResponseEntity<String> updateQuizQuestions(String quizId, List<Question> questions) {

        Quiz quiz = quizRepository.findById(quizId).orElse(null);
        if (quiz == null) return ResponseEntity.badRequest().body("Quiz not found");

        quiz.setQuestion(questions);

        quizRepository.save(quiz);

        return ResponseEntity.ok("Quiz questions updated successfully");
    }

    public ResponseEntity<List<Quiz>> getQuizByTitle(String title) {
        return ResponseEntity.ok(quizRepository.findByTitle(title));
    }

    public ResponseEntity<List<String>> getTitle() {
        List<Quiz> quizzes = quizRepository.findAllTitles();
        List<String> titles = quizzes.stream()
                .map(Quiz::getTitle)
                .distinct()
                .toList();
        return ResponseEntity.ok(titles);
    }

    public ResponseEntity<List<String>> getTitlesByCategory(String category) {
        List<Quiz> quizzes = quizRepository.findByCategory(category);

        List<String> titles = quizzes.stream()
                .map(Quiz::getTitle)
                .distinct()
                .toList();

        return ResponseEntity.ok(titles);
    }


}
