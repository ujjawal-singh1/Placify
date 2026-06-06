package com.Placify.Service;

import com.Placify.Entity.Subject;
import com.Placify.Repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SubjectService {
    @Autowired
    private SubjectRepository subjectRepository;


    public ResponseEntity<String> addSubject(Subject subject) {
        try {
            subjectRepository.save(subject);
            return ResponseEntity.ok("Subject Added Successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to add subject");
        }
    }

    public ResponseEntity<String> addSubjects(List<Subject> subjects) {
        try {
            subjectRepository.saveAll(subjects);
            return ResponseEntity.ok("Subjects Added Successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to add subjects");
        }
    }

    public ResponseEntity<List<Subject>> getAllSubjects() {
        try {
            List<Subject> subjects = subjectRepository.findAll();
            return ResponseEntity.ok(subjects);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    public ResponseEntity<String> deleteSubject(String id) {
        try {
            subjectRepository.deleteById(id);
            return ResponseEntity.ok("Subject Deleted Successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete subject");
        }
    }

    public ResponseEntity<Subject> getSubjectById(String id) {
        try {
            Subject subject = subjectRepository.findById(id).orElse(null);
            if(subject == null){
                return ResponseEntity.status(404).body(null);
            }
            return ResponseEntity.ok(subject);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
