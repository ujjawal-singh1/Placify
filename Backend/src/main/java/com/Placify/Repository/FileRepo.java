package com.Placify.Repository;

import com.Placify.Entity.CodeFile;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface FileRepo extends MongoRepository<CodeFile,String> {
    List<CodeFile> findByUserId(String userId);

    Optional<CodeFile> findByUserIdAndFilename(String userId, String filename);

    void deleteByUserIdAndFilename(String userId, String filename);
}
