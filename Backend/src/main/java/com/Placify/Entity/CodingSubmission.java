package com.Placify.Entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document(collection = "coding_submissions")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodingSubmission {

    @Id
    private String id;
    private String userId;
    private String problemId;
    private String language;
    private String code;
    private String status;
    private int passedTestCases;
    private int totalTestCases;
    private String output;

    @CreatedDate
    private Instant submittedAt;
}
