package com.Placify.Entity;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document
@Data
public class ProctorLog {
    @Id
    private String id;
    private String attemptId; // link to an attempt if available
    private String userId;
    private Instant timestamp;
    private String imageBase64; // or store file path / S3 URL
    private String issue; // e.g., "multiple_faces", "tab_switch"

    // ML proctoring fields
    private String severity;        // "low", "medium", "high"
    private String detectedObjects; // comma-separated, e.g. "phone, book"
    private Double confidence;      // ML model confidence score (0.0 - 1.0)
    private String imageUrl;        // Cloudinary URL (replaces base64 after upload)
}

