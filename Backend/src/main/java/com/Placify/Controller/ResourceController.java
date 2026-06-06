package com.Placify.Controller;

import com.Placify.Entity.Resource;
import com.Placify.Service.ResourceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/resource")
public class ResourceController {
    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addResource(@RequestBody Resource resource){
        return resourceService.addResource(resource);
    }

    @PostMapping("/addAll")
    public ResponseEntity<String> addResources(@RequestBody List<Resource> resources){
        return resourceService.addResources(resources);
    }

    @GetMapping("/subject/{subjectid}")
    public ResponseEntity<List<Resource>> getResourceBySubject(@PathVariable("subjectid") String subjectId){
        return resourceService.getResourceBySubject(subjectId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteResource(@PathVariable String id){
        return resourceService.deleteResource(id);
    }

}
