package com.univibe.backend.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.univibe.backend.model.ChatbotIntent;
import com.univibe.backend.service.ChatbotDataService;
import com.univibe.backend.service.ChatbotService;
import com.univibe.backend.service.IntentDetectorService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import java.time.Duration;

@Service
@RequiredArgsConstructor
public class ChatbotServiceImpl implements ChatbotService {
    @Value("${HUGGINGFACE_API_TOKEN}")
    private String huggingFaceToken;

    private final ChatbotDataService chatbotDataService;
    private final IntentDetectorService intentDetectorService;
    private static final Logger log = LoggerFactory.getLogger(ChatbotServiceImpl.class);

    private final HttpClient httpClient =
            HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(20))
                    .build();

    private static final String HF_API_URL = "https://router.huggingface.co/v1/chat/completions";

    @Override
    public String askChatbot(String question) {
        try {
            log.info("Received question: {}", question);

            ChatbotIntent intent = intentDetectorService.detectIntent(question);
            log.info("Detected intent: {}", intent);

            String context = chatbotDataService.getContextForIntent(intent);
            log.info("Context length: {} characters", context != null ? context.length() : 0);

            if (context == null || context.isBlank()) {
                log.warn("No context found for intent: {}, using fallback", intent);
                context = """
                    UniVibe е платформа за универзитетски настани.
                    Корисниците можат да пребаруваат настани по категорија, датум, универзитет и факултет.
                    Достапни категории: Технологија, Кариера, Наука/Истражување, Култура, Здравје, Спорт, Едукација, Работилници.
                    Корисниците можат да се пријават на настани преку копчето "Register".
                    Филтрите се наоѓаат на страната "Пребарај настани".
                    """;
            }

            String systemMessage =
                    "You are a helpful assistant for UniVibe, a university events platform.\n" +
                            "CRITICAL RULES:\n" +
                            "1. Answer ONLY using the exact information provided in the Context below\n" +
                            "2. DO NOT invent features, pages, or information not in the Context\n" +
                            "3. DO NOT make assumptions or add extra details\n" +
                            "4. If asked to list items (categories, events, faculties), show the COMPLETE list from Context\n" +
                            "5. Respond ONLY in Macedonian Cyrillic\n" +
                            "6. Use Macedonian words: оди, избери, кликни, најди, страна, настан\n" +
                            "7. DO NOT use Serbian/Croatian words: izaberi, pronađi, pogledajte, strana\n" +
                            "8. Keep responses clear and concise\n\n" +
                            "Context:\n" + context;

            ObjectMapper mapper = new ObjectMapper();
            ObjectNode requestJson = mapper.createObjectNode();

            requestJson.put("model", "meta-llama/Llama-3.1-8B-Instruct");
            requestJson.put("max_tokens", 400);
            requestJson.put("temperature", 0.1);

            ArrayNode messages = mapper.createArrayNode();

            ObjectNode systemMsg = mapper.createObjectNode();
            systemMsg.put("role", "system");
            systemMsg.put("content", systemMessage);
            messages.add(systemMsg);

            ObjectNode exampleUser = mapper.createObjectNode();
            exampleUser.put("role", "user");
            exampleUser.put("content", "Кои категории постојат?");
            messages.add(exampleUser);

            ObjectNode exampleAssistant = mapper.createObjectNode();
            exampleAssistant.put("role", "assistant");
            exampleAssistant.put("content", "UniVibe има следните категории настани:\n• Технологија\n• Кариера\n• " +
                    "Наука/Истражување\n• Култура\n• Здравје\n• Спорт\n• Едукација\n• Работилници\n" +
                    "\nЗа да најдеш настани по категорија, оди во „Настани\" и избери категорија.");
                    messages.add(exampleAssistant);

            ObjectNode userMsg = mapper.createObjectNode();
            userMsg.put("role", "user");
            userMsg.put("content", question);
            messages.add(userMsg);

            requestJson.set("messages", messages);

            String requestBody = mapper.writeValueAsString(requestJson);
            log.info("Request body: {}", requestBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(HF_API_URL))
                    .header("Authorization", "Bearer " + huggingFaceToken)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            log.info("Sending request to HuggingFace...");
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            log.info("Response status: {}", response.statusCode());
            log.info("Response body: {}", response.body());

            if (response.statusCode() != 200) {
                log.error("Hugging Face API returned status {}: {}", response.statusCode(), response.body());
                return "Се извинувам, имам проблем да добијам одговор. Пробај повторно.";
            }

            JsonNode root = mapper.readTree(response.body());

            JsonNode choices = root.path("choices");
            if (!choices.isArray() || choices.isEmpty()) {
                log.error("Unexpected response format: {}", response.body());
                return "Не добив одговор од AI. Пробај повторно.";
            }

            String answer = choices.get(0).path("message").path("content").asText();

            if (answer == null || answer.isBlank()) {
                log.warn("Empty answer received");
                return "Не добив одговор од AI. Пробај повторно.";
            }

            answer = cleanLanguageMix(answer);

            log.info("Successfully generated answer");
            return answer.trim();

        } catch (Exception e) {
            log.error("Error calling Hugging Face API", e);
            return "Се извинувам, имав проблем да обработам прашање. Ве молам обидете се повторно.";
        }
    }

    private String cleanLanguageMix(String text) {
        return text
                .replaceAll("(?i)\\bstrana(?:ta)?\\b", "страната")
                .replaceAll("(?i)\\bizaber[ie]\\b", "избери")
                .replaceAll("(?i)\\bpron[aā][đd]i\\b", "најди")
                .replaceAll("(?i)\\bpogledaj(?:te)?\\b", "погледни")
                .replaceAll("(?i)\\bklikni\\b", "кликни")
                .replaceAll("(?i)\\bun[eе]si\\b", "внеси")
                .replaceAll("(?i)\\botvor[ie]\\b", "отвори")
                .replaceAll("(?i)\\bodliku(?:ju|vaат)\\b", "се одликуваат")
                .replaceAll("(?i)^Da,\\s*", "")
                .replaceAll("\\bkeyword\\b", "клучен збор")
                .replaceAll("\\bKeyword\\b", "Клучен збор")
                .replaceAll("\\bcategories\\b", "категории")
                .replaceAll("\\btech\\b", "Технологија")
                .replaceAll("\\bcareer\\b", "Кариера")
                .replaceAll("\\bresearch\\b", "Наука/Истражување")
                .replaceAll("\\bculture\\b", "Култура")
                .replaceAll("\\bhealth\\b", "Здравје")
                .replaceAll("\\bsport\\b", "Спорт")
                .replaceAll("\\beducation\\b", "Едукација")
                .replaceAll("\\bworkshop\\b", "Работилници");
    }
}