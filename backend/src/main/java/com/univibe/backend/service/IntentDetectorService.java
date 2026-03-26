package com.univibe.backend.service;

import com.univibe.backend.model.ChatbotIntent;

public interface IntentDetectorService {
    ChatbotIntent detectIntent(String question);
}
