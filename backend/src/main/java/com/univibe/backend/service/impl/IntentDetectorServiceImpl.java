package com.univibe.backend.service.impl;

import com.univibe.backend.model.ChatbotIntent;
import com.univibe.backend.service.IntentDetectorService;
import org.springframework.stereotype.Service;

@Service
public class IntentDetectorServiceImpl implements IntentDetectorService {

    @Override
    public ChatbotIntent detectIntent(String question) {
        String lowerQuestion = question.toLowerCase().trim();

        if (matchesAny(lowerQuestion,
                "здраво", "добар ден", "добро утро", "добра вечер", "добра ноќ",
                "hello", "hi", "hey", "добра", "ало", "поздрав")) {
            return ChatbotIntent.GREETING;
        }

        if (matchesAny(lowerQuestion,
                "категор", "category", "технологија", "кариера", "наука",
                "култура", "здравје", "спорт", "едукација", "работилниц",
                "кои категории", "категории постојат", "типови настани",
                "какви настани")) {
            return ChatbotIntent.CATEGORIES;
        }

        if (matchesAny(lowerQuestion,
                "кои настани", "идни настани", "настани оваа недела",
                "настани овој месец", "upcoming events", "next events",
                "листа настани", "прикажи настани", "најнови настани")) {
            return ChatbotIntent.EVENTS;
        }

        if (matchesAny(lowerQuestion,
                "универзитет", "факултет", "финки", "феит", "уким",
                "university", "faculty", "кои факултети", "факултети постојат")) {
            return ChatbotIntent.FACULTIES;
        }

        if (matchesAny(lowerQuestion,
                "филтр", "filter", "пребар", "search", "најд", "find",
                "keyword", "датум", "date", "како да најдам",
                "каде се филтри", "како да пребарувам", "како да барам")) {
            return ChatbotIntent.FILTERS;
        }

        if (matchesAny(lowerQuestion,
                "детал", "detail", "опис", "description", "информац",
                "локација", "location", "време", "time",
                "online", "offline", "hybrid", "мод", "mode",
                "што значи", "како да видам", "повеќе информации")) {
            return ChatbotIntent.EVENT_DETAILS;
        }

        if (matchesAny(lowerQuestion,
                "пријав", "register", "регистрац", "signup",
                "како да се пријавам", "дали е бесплатно", "цена",
                "откаж", "cancel", "аплицир", "како да се регистрирам")) {
            return ChatbotIntent.REGISTRATION;
        }

        if (matchesAny(lowerQuestion,
                "профил", "profile", "најав", "login", "sign in",
                "account", "регистрирај се", "мора ли профил",
                "дали треба профил", "како да се најавам", "корисник")) {
            return ChatbotIntent.PROFILE;
        }

        if (matchesAny(lowerQuestion,
                "не можам", "cannot", "нема резултат", "no results",
                "не работи", "not working", "проблем", "problem",
                "грешка", "error", "не наоѓа", "го нема", "зошто нема",
                "помош", "help", "не излегува")) {
            return ChatbotIntent.TROUBLESHOOTING;
        }

        return ChatbotIntent.GENERAL;
    }

    private boolean matchesAny(String text, String... keywords) {
        for (String keyword : keywords) {
            if (text.contains(keyword.toLowerCase())) {
                return true;
            }
        }
        return false;
    }
}