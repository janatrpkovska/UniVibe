package com.univibe.backend.web;

import com.univibe.backend.dto.ChatRequest;
import com.univibe.backend.dto.ChatResponse;
import com.univibe.backend.service.ChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chatbot")
@CrossOrigin
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping
    public ChatResponse ask(@RequestBody ChatRequest request) {
        return chatbotService.askChatbot(
                request.getQuestion(),
                request.isAiEnabled()
        );
    }
}