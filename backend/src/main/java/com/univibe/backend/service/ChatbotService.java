package com.univibe.backend.service;

import com.univibe.backend.dto.ChatResponse;

public interface ChatbotService {
    ChatResponse askChatbot(String question, boolean aiEnabled);
}