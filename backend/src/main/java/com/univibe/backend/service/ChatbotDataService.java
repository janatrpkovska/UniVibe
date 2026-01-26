package com.univibe.backend.service;

import com.univibe.backend.model.ChatbotIntent;

public interface ChatbotDataService {
    String getContextForIntent(ChatbotIntent intent);
}
