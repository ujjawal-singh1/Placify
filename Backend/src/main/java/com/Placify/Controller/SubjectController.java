package com.Placify.Controller;

import com.Placify.Entity.Subject;
import com.Placify.Service.SubjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("subject")
public class SubjectController {
    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addSubject(@RequestBody Subject subject){
        return subjectService.addSubject(subject);
    }
    @PostMapping("/addAll")
    public ResponseEntity<String> addSubjects(@RequestBody List<Subject> subjects){
        return subjectService.addSubjects(subjects);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Subject>> getAllSubjects() {
        return subjectService.getAllSubjects();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Subject> getSubjectById(@PathVariable String id) {
        return subjectService.getSubjectById(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSubject(@PathVariable String id){
        return subjectService.deleteSubject(id);
    }


}
