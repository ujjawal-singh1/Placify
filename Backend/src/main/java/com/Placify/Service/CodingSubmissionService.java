package com.Placify.Service;

import com.Placify.Entity.CodingProblem;
import com.Placify.Entity.CodingSubmission;
import com.Placify.Entity.TestCase;
import com.Placify.Repository.CodingProblemRepository;
import com.Placify.Repository.CodingSubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Files;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CodingSubmissionService {

    @Autowired
    private CodingSubmissionRepository submissionRepository;

    @Autowired
    private CodingProblemRepository problemRepository;

    /**
     * Run code against VISIBLE (non-hidden) test cases only.
     * Used for the "Run" button — lets user test before submitting.
     */
    public Map<String, Object> runCode(String problemId, String language, String code) {
        CodingProblem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException("Problem not found: " + problemId));

        List<TestCase> visibleCases = problem.getTestCases() == null
                ? Collections.emptyList()
                : problem.getTestCases().stream()
                    .filter(tc -> !tc.isHidden())
                    .collect(Collectors.toList());

        List<Map<String, Object>> results = new ArrayList<>();
        int passed = 0;

        for (int i = 0; i < visibleCases.size(); i++) {
            TestCase tc = visibleCases.get(i);
            Map<String, Object> result = new LinkedHashMap<>();
            result.put("testCase", i + 1);
            result.put("input", tc.getInput());
            result.put("expectedOutput", tc.getExpectedOutput());

            try {
                String actual = executeCode(language, code, tc.getInput());
                String actualTrimmed = actual.trim();
                String expectedTrimmed = tc.getExpectedOutput().trim();
                boolean pass = actualTrimmed.equals(expectedTrimmed);

                result.put("actualOutput", actual.trim());
                result.put("passed", pass);
                result.put("error", false);

                if (pass) passed++;
            } catch (Exception e) {
                result.put("actualOutput", e.getMessage());
                result.put("passed", false);
                result.put("error", true);
            }
            results.add(result);
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("passed", passed);
        response.put("total", visibleCases.size());
        response.put("results", results);
        return response;
    }

    /**
     * Submit solution — runs against ALL test cases (including hidden).
     * Saves and returns a CodingSubmission.
     */
    public CodingSubmission submitSolution(String userId, String problemId, String language, String code) {
        CodingProblem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException("Problem not found: " + problemId));

        List<TestCase> allCases = problem.getTestCases() == null
                ? Collections.emptyList()
                : problem.getTestCases();

        int passed = 0;
        int total = allCases.size();
        String lastOutput = "";
        String status = "ACCEPTED";

        for (TestCase tc : allCases) {
            try {
                String actual = executeCode(language, code, tc.getInput());
                lastOutput = actual.trim();
                String expectedTrimmed = tc.getExpectedOutput().trim();

                if (lastOutput.equals(expectedTrimmed)) {
                    passed++;
                } else {
                    status = "WRONG_ANSWER";
                }
            } catch (Exception e) {
                lastOutput = e.getMessage();
                if (lastOutput != null && (lastOutput.toLowerCase().contains("compilation")
                        || lastOutput.toLowerCase().contains("error:"))) {
                    status = "COMPILATION_ERROR";
                } else {
                    status = "RUNTIME_ERROR";
                }
            }
        }

        // If at least one test passed but not all, it's WRONG_ANSWER
        if (passed > 0 && passed < total && !status.equals("COMPILATION_ERROR") && !status.equals("RUNTIME_ERROR")) {
            status = "WRONG_ANSWER";
        }
        // If all passed
        if (passed == total && total > 0) {
            status = "ACCEPTED";
        }

        CodingSubmission submission = CodingSubmission.builder()
                .userId(userId)
                .problemId(problemId)
                .language(language)
                .code(code)
                .status(status)
                .passedTestCases(passed)
                .totalTestCases(total)
                .output(lastOutput)
                .submittedAt(Instant.now())
                .build();

        return submissionRepository.save(submission);
    }

    public List<CodingSubmission> getUserSubmissions(String userId) {
        return submissionRepository.findByUserId(userId);
    }

    public List<CodingSubmission> getProblemSubmissions(String problemId) {
        return submissionRepository.findByProblemId(problemId);
    }

    public List<CodingSubmission> getUserProblemSubmissions(String userId, String problemId) {
        return submissionRepository.findByUserIdAndProblemId(userId, problemId);
    }

    // ──────────────────────────────────────────────
    // Docker-based code execution with stdin support
    // ──────────────────────────────────────────────

    private String executeCode(String language, String code, String input) throws Exception {
        String extension = getExtension(language);

        // Create temp file for code
        File codeFile = File.createTempFile("code-", extension);
        Files.writeString(codeFile.toPath(), code);

        // Create temp file for stdin input
        File inputFile = File.createTempFile("input-", ".txt");
        Files.writeString(inputFile.toPath(), input != null ? input : "");

        try {
            ProcessBuilder pb = new ProcessBuilder(
                    "docker", "run", "--rm",
                    "--memory=256m",
                    "--cpus=1",
                    "--network=none",
                    "-v", codeFile.getAbsolutePath() + ":/app/solution" + extension,
                    "-v", inputFile.getAbsolutePath() + ":/app/input.txt",
                    "code-runner",
                    language,
                    "/app/solution" + extension,
                    "/app/input.txt"
            );

            pb.redirectErrorStream(true);
            Process process = pb.start();

            // Read output with a timeout
            String result = new String(process.getInputStream().readAllBytes());

            boolean finished = process.waitFor(15, java.util.concurrent.TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                throw new RuntimeException("TIME_LIMIT_EXCEEDED: Execution took more than 15 seconds");
            }

            return result;
        } finally {
            codeFile.delete();
            inputFile.delete();
        }
    }

    private String getExtension(String lang) {
        return switch (lang.toLowerCase()) {
            case "cpp", "c++" -> ".cpp";
            case "java" -> ".java";
            case "python" -> ".py";
            case "javascript" -> ".js";
            default -> ".txt";
        };
    }
}
