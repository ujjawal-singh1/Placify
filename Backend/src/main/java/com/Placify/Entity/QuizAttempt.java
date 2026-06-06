package com.Placify.Entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "quiz_attempts")
public class QuizAttempt {

    @Id
    private String id;

    private String userId;
    private String quizId;
    private String quizTitle;

    private int score;
    private int totalMarks;

    private boolean attempted;
    private int cheatCount;

    private Instant startedAt;
    private Instant submittedAt;
}
