package com.Placify.Service;

import com.Placify.Entity.CodingProblem;
import com.Placify.Repository.CodingProblemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CodingProblemService {

    @Autowired
    private CodingProblemRepository codingProblemRepository;

    public List<CodingProblem> getAllProblems() {
        return codingProblemRepository.findAll();
    }

    public Optional<CodingProblem> getProblemById(String id) {
        return codingProblemRepository.findById(id);
    }

    public List<CodingProblem> getProblemsByCategory(String category) {
        return codingProblemRepository.findByCategory(category);
    }

    public List<CodingProblem> getProblemsByDifficulty(String difficulty) {
        return codingProblemRepository.findByDifficulty(difficulty);
    }

    public List<String> getAllCategories() {
        return codingProblemRepository.findAll()
                .stream()
                .map(CodingProblem::getCategory)
                .filter(c -> c != null && !c.isBlank())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    public CodingProblem createProblem(CodingProblem problem) {
        problem.setCreatedAt(Instant.now());
        problem.setUpdatedAt(Instant.now());
        return codingProblemRepository.save(problem);
    }

    public CodingProblem updateProblem(String id, CodingProblem problem) {
        Optional<CodingProblem> existing = codingProblemRepository.findById(id);
        if (existing.isEmpty()) {
            throw new RuntimeException("Problem not found: " + id);
        }
        CodingProblem p = existing.get();
        p.setTitle(problem.getTitle());
        p.setDescription(problem.getDescription());
        p.setDifficulty(problem.getDifficulty());
        p.setCategory(problem.getCategory());
        p.setConstraints(problem.getConstraints());
        p.setSampleInput(problem.getSampleInput());
        p.setSampleOutput(problem.getSampleOutput());
        p.setTestCases(problem.getTestCases());
        p.setStarterCode(problem.getStarterCode());
        p.setUpdatedAt(Instant.now());
        return codingProblemRepository.save(p);
    }

    public void deleteProblem(String id) {
        codingProblemRepository.deleteById(id);
    }
}
