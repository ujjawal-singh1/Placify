package com.Placify.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "resources")
public class Resource {

    @Id
    private String id;

    private String subjectId;
    private String topicName;

    private String materialType; // 🔥 VIDEO, PDF, DRIVE
    private String videoLink;
    private String pdfLink;
    private String driveLink; // 🔥 UI requires this
}
