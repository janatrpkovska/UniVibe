package com.univibe.backend.service.impl;

import com.univibe.backend.model.ChatbotIntent;
import com.univibe.backend.service.IntentDetectorService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.text.Normalizer;
import java.util.Optional;

@Service
public class IntentDetectorServiceImpl implements IntentDetectorService {
    private static final Map<ChatbotIntent, Map<String, Integer>> INTENT_KEYWORDS = new HashMap<>();

    static {
        INTENT_KEYWORDS.put(ChatbotIntent.GREETING, Map.ofEntries(
                Map.entry("здраво", 10),
                Map.entry("добар ден", 10),
                Map.entry("добро утро", 10),
                Map.entry("добра вечер", 10),
                Map.entry("добра ноќ", 10),
                Map.entry("hello", 10),
                Map.entry("hi", 10),
                Map.entry("hey", 10),
                Map.entry("поздрав", 10),
                Map.entry("ало", 8)
        ));

        INTENT_KEYWORDS.put(ChatbotIntent.CATEGORIES, Map.ofEntries(
                Map.entry("кои категории", 10),
                Map.entry("категории постојат", 10),
                Map.entry("листа категории", 9),
                Map.entry("прикажи категории", 9),
                Map.entry("види категории", 9),
                Map.entry("типови настани", 8),
                Map.entry("какви настани", 7),
                Map.entry("категор", 4),
                Map.entry("category", 5)
        ));

        INTENT_KEYWORDS.put(ChatbotIntent.EVENTS, Map.ofEntries(
                Map.entry("кои настани", 10),
                Map.entry("идни настани", 10),
                Map.entry("кои се идните", 10),
                Map.entry("идните настани", 10),
                Map.entry("настани оваа недела", 9),
                Map.entry("настани овој месец", 9),
                Map.entry("upcoming events", 9),
                Map.entry("листа настани", 8),
                Map.entry("прикажи настани", 8),
                Map.entry("најнови настани", 8),
                Map.entry("next events", 7),
                Map.entry("кога има настани", 7),
                Map.entry("има ли настани", 7),
                Map.entry("настани од", 9),
                Map.entry("од технологија", 8),
                Map.entry("од кариера", 8),
                Map.entry("од наука", 8),
                Map.entry("од култура", 8),
                Map.entry("од здравје", 8),
                Map.entry("од спорт", 8)
        ));

        INTENT_KEYWORDS.put(ChatbotIntent.FACULTIES, Map.ofEntries(
                Map.entry("кои факултети", 10),
                Map.entry("факултети постојат", 10),
                Map.entry("кои универзитети", 10),
                Map.entry("универзитет", 7),
                Map.entry("факултет", 7),
                Map.entry("финки", 8),
                Map.entry("феит", 8),
                Map.entry("уким", 8),
                Map.entry("university", 6),
                Map.entry("faculty", 6)
        ));

        INTENT_KEYWORDS.put(ChatbotIntent.FILTERS, Map.ofEntries(
                Map.entry("како да најдам", 10),
                Map.entry("како да пребарувам", 10),
                Map.entry("како да барам", 10),
                Map.entry("каде се филтри", 9),
                Map.entry("филтр", 7),
                Map.entry("filter", 7),
                Map.entry("пребар", 7),
                Map.entry("search", 7),
                Map.entry("најд", 6),
                Map.entry("find", 6),
                Map.entry("keyword", 5),
                Map.entry("датум", 5),
                Map.entry("date", 5)
        ));

        INTENT_KEYWORDS.put(ChatbotIntent.EVENT_DETAILS, Map.ofEntries(
                Map.entry("како да видам детали", 10),
                Map.entry("повеќе информации", 9),
                Map.entry("каде можам да видам", 9),
                Map.entry("каде да ги видам", 9),
                Map.entry("каде да видам", 9),
                Map.entry("што значи", 8),
                Map.entry("детал", 7),
                Map.entry("detail", 7),
                Map.entry("опис", 6),
                Map.entry("description", 6),
                Map.entry("информац", 6),
                Map.entry("локација", 5),
                Map.entry("location", 5),
                Map.entry("време", 5),
                Map.entry("time", 5),
                Map.entry("online", 4),
                Map.entry("offline", 4),
                Map.entry("hybrid", 4)
        ));

        INTENT_KEYWORDS.put(ChatbotIntent.REGISTRATION, Map.ofEntries(
                Map.entry("како да се пријавам", 10),
                Map.entry("како да се регистрирам", 10),
                Map.entry("пријав", 8),
                Map.entry("register", 8),
                Map.entry("регистрац", 8),
                Map.entry("signup", 8),
                Map.entry("дали е бесплатно", 7),
                Map.entry("цена", 6),
                Map.entry("откаж", 6),
                Map.entry("cancel", 6),
                Map.entry("аплицир", 5)
        ));

        INTENT_KEYWORDS.put(ChatbotIntent.PROFILE, Map.ofEntries(
                Map.entry("мора ли профил", 10),
                Map.entry("дали треба профил", 10),
                Map.entry("како да се најавам", 10),
                Map.entry("како да направам профил", 9),
                Map.entry("профил", 6),
                Map.entry("profile", 6),
                Map.entry("најав", 6),
                Map.entry("login", 6),
                Map.entry("sign in", 6),
                Map.entry("account", 5),
                Map.entry("регистрирај се", 5)
        ));

        INTENT_KEYWORDS.put(ChatbotIntent.TROUBLESHOOTING, Map.ofEntries(
                Map.entry("не можам да најдам", 10),
                Map.entry("нема резултат", 10),
                Map.entry("не работи", 10),
                Map.entry("не наоѓа", 9),
                Map.entry("зошто нема", 9),
                Map.entry("го нема", 8),
                Map.entry("не излегува", 8),
                Map.entry("cannot", 7),
                Map.entry("no results", 7),
                Map.entry("not working", 7),
                Map.entry("проблем", 6),
                Map.entry("problem", 6),
                Map.entry("грешка", 6),
                Map.entry("error", 6),
                Map.entry("помош", 5),
                Map.entry("help", 5)
        ));
    }

    @Override
    public ChatbotIntent detectIntent(String question) {
        if (question == null || question.trim().isEmpty()) {
            return ChatbotIntent.GENERAL;
        }

        String normalized = normalize(question);

        if (normalized.matches(".*\\b(кои|какви|прикажи|покажи|листа)\\s+(категории|category|categories).*")) {
            return ChatbotIntent.CATEGORIES;
        }

        if (normalized.matches(".*\\b(кои се|идни|идните)\\s+настани.*") ||
                normalized.matches(".*\\b(прикажи|види|кои|покажи)\\s+настани\\s+(од|по|за|from).*")) {
            return ChatbotIntent.EVENTS;
        }

        Map<ChatbotIntent, Integer> scores = new HashMap<>();
        for (ChatbotIntent intent : ChatbotIntent.values()) {
            scores.put(intent, calculateScore(normalized, intent));
        }

        Optional<Map.Entry<ChatbotIntent, Integer>> bestMatch = scores.entrySet().stream()
                .max(Map.Entry.comparingByValue());

        if (bestMatch.isPresent() && bestMatch.get().getValue() >= 5) {
            return bestMatch.get().getKey();
        }

        return detectFallbackIntent(normalized);
    }

    private int calculateScore(String text, ChatbotIntent intent) {
        Map<String, Integer> keywords = INTENT_KEYWORDS.get(intent);
        if (keywords == null) {
            return 0;
        }

        int score = 0;
        for (Map.Entry<String, Integer> entry : keywords.entrySet()) {
            String keyword = normalize(entry.getKey());
            int weight = entry.getValue();

            if (text.contains(keyword)) {
                score += weight;

                if (text.startsWith(keyword)) {
                    score += 2;
                }

                if (text.equals(keyword)) {
                    score += 5;
                }
            }
        }

        return score;
    }

    private ChatbotIntent detectFallbackIntent(String text) {
        if (text.matches(".*\\b(категории)\\s+(на\\s+)?настани.*")) {
            return ChatbotIntent.CATEGORIES;
        }

        if (text.matches(".*\\b(катего|category).*\\b(постој|exist|има|has).*") ||
                text.matches(".*\\b(постој|exist|има|has).*\\b(катего|category).*")) {
            return ChatbotIntent.CATEGORIES;
        }

        if (text.matches(".*\\b(како|how).*\\b(најд|пребар|барам|find|search).*\\b(настан|event).*")) {
            return ChatbotIntent.FILTERS;
        }

        if (text.matches(".*\\b(како|how).*\\b(пријав|регистр|register|signup).*")) {
            return ChatbotIntent.REGISTRATION;
        }

        if (text.matches(".*\\b(универзитет|факултет|university|faculty).*\\b(постој|exist|има|has|кои|which).*")) {
            return ChatbotIntent.FACULTIES;
        }

        if (text.matches(".*\\b(детал|опис|detail|description|информац|information).*\\b(настан|event).*") ||
                text.matches(".*\\b(каде|where|како|how).*\\b(видам|видиш|see|view).*\\b(детал|detail|информац|info).*")) {
            return ChatbotIntent.EVENT_DETAILS;
        }

        if (text.matches(".*\\b(не можам|cannot|нема|no).*\\b(најд|find|резултат|result).*")) {
            return ChatbotIntent.TROUBLESHOOTING;
        }

        return ChatbotIntent.GENERAL;
    }

    private String normalize(String text) {
        if (text == null) {
            return "";
        }

        text = text.toLowerCase();

        text = Normalizer.normalize(text, Normalizer.Form.NFD);
        text = text.replaceAll("\\p{M}", "");

        text = text.replaceAll("[.,!?;:()\"'`]", " ");

        text = text.replaceAll("\\s+", " ").trim();

        return text;
    }
}