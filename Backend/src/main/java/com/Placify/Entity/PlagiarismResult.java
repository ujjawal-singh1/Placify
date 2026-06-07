package com.Placify.Entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "plagiarism_results")
public class PlagiarismResult {
    @Id
    private String id;
    private String quizId;
    private String userId1;
    private String userId2;
    private double similarityScore;
    private int matchedAnswers;
    private int totalQuestions;
    private Instant analyzedAt;
    private boolean flagged;
}
