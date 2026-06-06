package com.Placify.Service;

import com.Placify.Entity.Feedback;
import com.Placify.Repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    // SAVE FEEDBACK (USER)
    public ResponseEntity<String> saveFeedback(Feedback feedback) {
        feedback.setCreatedAt(Instant.now());
        feedbackRepository.save(feedback);
        return ResponseEntity.ok("Feedback submitted successfully");
    }

    // GET ALL FEEDBACK (ADMIN)
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        return ResponseEntity.ok(feedbackRepository.findAll());
    }
}
