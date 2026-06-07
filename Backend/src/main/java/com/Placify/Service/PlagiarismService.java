package com.Placify.Service;

import com.Placify.Entity.Attempt;
import com.Placify.Entity.PlagiarismResult;
import com.Placify.Repository.AttemptRepo;
import com.Placify.Repository.PlagiarismResultRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PlagiarismService {

    @Autowired
    private AttemptRepo attemptRepo;

    @Autowired
    private PlagiarismResultRepo plagiarismResultRepo;

    private final WebClient webClient;

    @Value("${ml.service.url:http://localhost:5000}")
    private String mlServiceUrl;

    public PlagiarismService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    // ---------------------------------------------------------------
    // Analyze all attempts for a quiz by calling the ML service
    // ---------------------------------------------------------------
    public List<PlagiarismResult> analyzeQuiz(String quizId) {

        List<Attempt> attempts = attemptRepo.findByQuizId(quizId);

        if (attempts.size() < 2) {
            // need at least two attempts to compare
            return Collections.emptyList();
        }

        // build the payload: list of { userId, responses }
        List<Map<String, Object>> attemptsPayload = attempts.stream()
                .map(a -> {
                    Map<String, Object> entry = new HashMap<>();
                    entry.put("userId", a.getUserId());
                    entry.put("responses", a.getResponses());
                    return entry;
                })
                .collect(Collectors.toList());

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("quizId", quizId);
        requestBody.put("attempts", attemptsPayload);

        // call the FastAPI plagiarism endpoint
        // TODO: add retry / circuit-breaker for production
        List<Map<String, Object>> mlResults = webClient.post()
                .uri(mlServiceUrl + "/api/plagiarism/analyze")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .block(); // blocking here is fine for now, could switch to reactive later

        if (mlResults == null || mlResults.isEmpty()) {
            return Collections.emptyList();
        }

        // parse & persist each result
        List<PlagiarismResult> savedResults = new ArrayList<>();
        for (Map<String, Object> r : mlResults) {
            PlagiarismResult result = PlagiarismResult.builder()
                    .quizId(quizId)
                    .userId1((String) r.get("userId1"))
                    .userId2((String) r.get("userId2"))
                    .similarityScore(((Number) r.get("similarityScore")).doubleValue())
                    .matchedAnswers(((Number) r.get("matchedAnswers")).intValue())
                    .totalQuestions(((Number) r.get("totalQuestions")).intValue())
                    .analyzedAt(Instant.now())
                    .flagged((Boolean) r.getOrDefault("flagged", false))
                    .build();

            savedResults.add(plagiarismResultRepo.save(result));
        }

        return savedResults;
    }

    public List<PlagiarismResult> getResultsByQuiz(String quizId) {
        return plagiarismResultRepo.findByQuizId(quizId);
    }

    public List<PlagiarismResult> getFlaggedResults() {
        return plagiarismResultRepo.findByFlaggedTrue();
    }
}
