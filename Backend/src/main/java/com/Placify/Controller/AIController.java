package com.Placify.Controller;

import com.Placify.Service.GeminiService;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final GeminiService service;

    public AIController(GeminiService service) {
        this.service = service;
    }

    @PostMapping(value = "/explain", consumes = "text/plain")
    public Mono<String> chatWithAI(@RequestBody String incomingPayload) {

        // Stricter System Prompt so the AI doesn't get confused by the code
        String systemInstruction = "You are an AI coding assistant. " +
                "Please answer the user's question. " +
                "If the question is about the provided code, use the code context to help them. " +
                "If the question is general (like 'what is AI?' or 'what is an OS?'), answer the question directly and ignore the code context entirely.\n\n---\n";

        return service.generate(systemInstruction + incomingPayload);
    }
}