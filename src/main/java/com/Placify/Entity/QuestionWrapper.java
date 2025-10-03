package com.Placify.Entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@AllArgsConstructor
@Data
public class QuestionWrapper {

    @Id
    private String id;
    private String quetionTitle;
    private String option1;
    private String option2;
    private String option3;
    private String option4;
}
