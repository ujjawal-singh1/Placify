package com.Placify.Controller;

import com.Placify.Entity.CodeFile;
import com.Placify.Service.FileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileService service;

    public FileController(FileService service) {
        this.service = service;
    }

    // Save or update file
    @PostMapping("/save")
    public CodeFile save(@RequestBody CodeFile file) {
        return service.saveFile(file);
    }

    // Get all user files
    @GetMapping("/user/{userId}")
    public List<CodeFile> list(@PathVariable String userId) {
        return service.getUserFiles(userId);
    }

    // Load single file
    @GetMapping("/load")
    public ResponseEntity<CodeFile> load(
            @RequestParam String userId,
            @RequestParam String filename
    ) {
        try {
            return ResponseEntity.ok(service.loadFile(userId, filename));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete file
    @DeleteMapping("/delete")
    public void delete(
            @RequestParam String userId,
            @RequestParam String filename
    ) {
        service.deleteFile(userId, filename);
    }
}
