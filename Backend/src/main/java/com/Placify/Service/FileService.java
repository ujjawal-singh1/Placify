package com.Placify.Service;

import com.Placify.Entity.CodeFile;
import com.Placify.Repository.FileRepo;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FileService {

    private final FileRepo repo;

    public FileService(FileRepo repo) {
        this.repo = repo;
    }

    public CodeFile saveFile(CodeFile file) {

        return repo.findByUserIdAndFilename(file.getUserId(), file.getFilename())
                .map(existing -> {
                    existing.setCode(file.getCode());
                    existing.setLanguage(file.getLanguage());
                    return repo.save(existing);
                })
                .orElseGet(() -> repo.save(file));
    }

    public List<CodeFile> getUserFiles(String userId) {
        return repo.findByUserId(userId);
    }

    public CodeFile loadFile(String userId, String filename) {
        return repo.findByUserIdAndFilename(userId, filename)
                .orElseThrow(() -> new RuntimeException("File not found"));
    }

    public void deleteFile(String userId, String filename) {
        repo.deleteByUserIdAndFilename(userId, filename);
    }
}