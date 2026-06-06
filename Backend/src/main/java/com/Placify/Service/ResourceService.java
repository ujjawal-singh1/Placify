package com.Placify.Service;

import com.Placify.Entity.Resource;
import com.Placify.Repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ResourceService  {
    @Autowired
    private ResourceRepository resourceRepository;

    public ResponseEntity<String> addResource(Resource resource) {
        try {
            resourceRepository.save(resource);
            return ResponseEntity.ok("Resource Added Successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to add resource");
        }
    }

    public ResponseEntity<String> addResources(List<Resource> resources) {
        try {
            resourceRepository.saveAll(resources);
            return ResponseEntity.ok("All Resources Added Successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to add resources");
        }
    }

    public ResponseEntity<List<Resource>> getResourceBySubject(String subjectId) {
        try {
            List<Resource> resources = resourceRepository.findBySubjectId(subjectId);
            return ResponseEntity.ok(resources);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    public ResponseEntity<String> deleteResource(String id) {
        try {
            resourceRepository.deleteById(id);
            return ResponseEntity.ok("Resource Deleted Successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete resource");
        }
    }
}
