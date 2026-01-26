package com.univibe.backend.web;

import com.univibe.backend.dto.ChatRequest;
import com.univibe.backend.dto.ChatResponse;
import com.univibe.backend.service.ChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chatbot")
public class ChatbotController {
    private final ChatbotService chatbotService;

    @PostMapping("/ask")
    public ChatResponse askChatbot(@RequestBody ChatRequest request) {
        System.out.println("Received question: " + request.getQuestion());
        String answer = chatbotService.askChatbot(request.getQuestion());

        return new ChatResponse(answer);
    }
}
