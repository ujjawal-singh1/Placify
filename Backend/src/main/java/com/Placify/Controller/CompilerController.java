package com.Placify.Controller;

import com.Placify.Dto.CodeRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.nio.file.Files;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/compiler")
public class CompilerController {

    private static final Set<String> ALLOWED_LANGUAGES = Set.of(
            "javascript", "python", "cpp", "c++", "java"
    );

    @PostMapping("/run")
    public String run(@RequestBody CodeRequest req) {
        try {
            // Validate language to prevent command injection
            String lang = req.getLanguage().toLowerCase().trim();
            if (!ALLOWED_LANGUAGES.contains(lang)) {
                return "ERROR: Unsupported language: " + req.getLanguage();
            }

            String extension = getExtension(lang);
            File tempFile = File.createTempFile("code-", extension);
            Files.writeString(tempFile.toPath(), req.getCode());

            ProcessBuilder pb = new ProcessBuilder(
                    "docker", "run", "--rm",
                    "--memory=256m",
                    "--cpus=1",
                    "--network=none",
                    "-v", tempFile.getAbsolutePath() + ":/app/solution" + extension,
                    "code-runner",
                    lang,
                    "/app/solution" + extension
            );

            pb.redirectErrorStream(true);
            Process process = pb.start();

            String result = new String(process.getInputStream().readAllBytes());

            boolean finished = process.waitFor(15, TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                return "ERROR: Execution timed out (15s limit)";
            }

            tempFile.delete();
            return result;

        } catch (Exception e) {
            return "ERROR:\n" + e.getMessage();
        }
    }

    private String getExtension(String lang) {
        return switch (lang) {
            case "cpp", "c++" -> ".cpp";
            case "java" -> ".java";
            case "python" -> ".py";
            case "javascript" -> ".js";
            default -> ".txt";
        };
    }
}