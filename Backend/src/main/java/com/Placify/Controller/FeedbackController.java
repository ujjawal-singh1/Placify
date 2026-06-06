package com.Placify.Controller;

import com.Placify.Entity.Feedback;
import com.Placify.Service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedback")
@CrossOrigin
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    // -------------------------------
    // USER: SUBMIT FEEDBACK
    // -------------------------------
    @PostMapping("/submit")
    public ResponseEntity<String> submitFeedback(
            @RequestBody Feedback feedback) {
        return feedbackService.saveFeedback(feedback);
    }

    // -------------------------------
    // ADMIN: VIEW ALL FEEDBACK
    // -------------------------------
    @GetMapping("/all")
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        return feedbackService.getAllFeedback();
    }
}
