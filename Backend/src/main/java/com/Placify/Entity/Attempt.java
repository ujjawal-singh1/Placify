package com.Placify.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Document
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Attempt {
    @Id
    private String id;
    private String quizId;
    private String userId;        // store student id/email
    private Instant timestamp;
    private int score;
    private int total;
    // store questionId => chosenAnswer
    private Map<String, String> responses;
}
