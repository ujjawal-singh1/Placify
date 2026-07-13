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

        if (attempts.isEmpty()) {
            throw new RuntimeException(
                "No response data found for this quiz. " +
                "Students need to take the quiz first (responses are required for plagiarism analysis)."
            );
        }

        if (attempts.size() < 2) {
            throw new RuntimeException(
                "Need at least 2 attempts to compare. Only " + attempts.size() + " attempt(s) found."
            );
        }

        // build the payload: list of { userId, responses }
        List<Map<String, Object>> attemptsPayload = attempts.stream()
                .filter(a -> a.getResponses() != null && !a.getResponses().isEmpty())
                .map(a -> {
                    Map<String, Object> entry = new HashMap<>();
                    entry.put("userId", a.getUserId());
                    entry.put("responses", a.getResponses());
                    return entry;
                })
                .collect(Collectors.toList());

        if (attemptsPayload.size() < 2) {
            throw new RuntimeException(
                "Not enough attempts with response data. Found " + attempts.size() +
                " attempt(s) but only " + attemptsPayload.size() + " have answer responses."
            );
        }

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("quizId", quizId);
        requestBody.put("attempts", attemptsPayload);

        // call the FastAPI plagiarism endpoint
        // The ML service returns: { quiz_id, results: [...], flagged_count, total_pairs_analyzed }
        // so we need to parse the wrapper and extract the "results" array
        Map<String, Object> mlResponse;
        try {
            mlResponse = webClient.post()
                    .uri(mlServiceUrl + "/api/plagiarism/analyze")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                    .block();
        } catch (Exception e) {
            throw new RuntimeException(
                "ML service is not reachable at " + mlServiceUrl +
                ". Make sure the ML service is running. Error: " + e.getMessage()
            );
        }

        if (mlResponse == null || !mlResponse.containsKey("results")) {
            return Collections.emptyList();
        }

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> mlResults = (List<Map<String, Object>>) mlResponse.get("results");

        if (mlResults == null || mlResults.isEmpty()) {
            return Collections.emptyList();
        }

        // parse & persist each result
        // NOTE: ML service returns snake_case keys (user_id_1, similarity_score, etc.)
        List<PlagiarismResult> savedResults = new ArrayList<>();
        for (Map<String, Object> r : mlResults) {
            PlagiarismResult result = PlagiarismResult.builder()
                    .quizId(quizId)
                    .userId1((String) r.get("user_id_1"))
                    .userId2((String) r.get("user_id_2"))
                    .similarityScore(((Number) r.get("similarity_score")).doubleValue())
                    .matchedAnswers(((Number) r.get("matched_answers")).intValue())
                    .totalQuestions(((Number) r.get("total_questions")).intValue())
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
