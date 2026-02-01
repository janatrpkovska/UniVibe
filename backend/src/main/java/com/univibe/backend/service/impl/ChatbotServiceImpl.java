package com.univibe.backend.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.univibe.backend.model.ChatbotIntent;
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

    private final ChatbotDataServiceImpl chatbotDataService;
    private final IntentDetectorService intentDetectorService;
    private static final Logger log = LoggerFactory.getLogger(ChatbotServiceImpl.class);

    private final HttpClient httpClient =
            HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(30))
                    .build();

    private static final String HF_API_URL = "https://router.huggingface.co/v1/chat/completions";

    @Override
    public String askChatbot(String question) {
        try {
            log.info("Received question: {}", question);

            if (question == null || question.trim().isEmpty()) {
                return "Ве молам внесете прашање.";
            }

            if (isThankYouMessage(question)) {
                return getThankYouResponse();
            }

            ChatbotIntent intent = intentDetectorService.detectIntent(question);
            log.info("Detected intent: {}", intent);

            String context;
            if (intent == ChatbotIntent.EVENTS && containsCategoryReference(question)) {
                context = chatbotDataService.getContextForEventsWithCategory(question);
                log.info("Using category-filtered events context");
            } else {
                context = chatbotDataService.getContextForIntent(intent);
            }

            log.info("Context length: {} characters", context != null ? context.length() : 0);

            if (context == null || context.isBlank()) {
                log.warn("No context found for intent: {}, using fallback", intent);
                context = buildFallbackContext();
            }

            String systemMessage = buildSystemMessage(context, intent);

            ObjectMapper mapper = new ObjectMapper();
            ObjectNode requestJson = mapper.createObjectNode();

            requestJson.put("model", "meta-llama/Llama-3.1-8B-Instruct");
            requestJson.put("max_tokens", 500);
            requestJson.put("temperature", 0.4);
            requestJson.put("top_p", 0.85);
            requestJson.put("frequency_penalty", 0.5);

            ArrayNode messages = mapper.createArrayNode();

            ObjectNode systemMsg = mapper.createObjectNode();
            systemMsg.put("role", "system");
            systemMsg.put("content", systemMessage);
            messages.add(systemMsg);

            ObjectNode userMsg = mapper.createObjectNode();
            userMsg.put("role", "user");
            userMsg.put("content", question);
            messages.add(userMsg);

            requestJson.set("messages", messages);

            String requestBody = mapper.writeValueAsString(requestJson);
            log.debug("Request body: {}", requestBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(HF_API_URL))
                    .header("Authorization", "Bearer " + huggingFaceToken)
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(30))
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            log.info("Sending request to HuggingFace...");
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            log.info("Response status: {}", response.statusCode());
            log.debug("Response body: {}", response.body());

            if (response.statusCode() != 200) {
                log.error("Hugging Face API returned status {}: {}", response.statusCode(), response.body());
                return "Се извинувам, имам проблем да добијам одговор. Обиди се повторно.";
            }

            JsonNode root = mapper.readTree(response.body());
            JsonNode choices = root.path("choices");

            if (!choices.isArray() || choices.isEmpty()) {
                log.error("Unexpected response format: {}", response.body());
                return "Не добив одговор од AI. Обиди се повторно.";
            }

            String answer = choices.get(0).path("message").path("content").asText();

            if (answer == null || answer.isBlank()) {
                log.warn("Empty answer received");
                return "Не добив одговор од AI. Обиди се повторно.";
            }

            answer = cleanLanguageMix(answer);
            answer = validateAndFixResponse(answer, context, intent);

            log.info("Successfully generated answer");
            return answer.trim();

        } catch (Exception e) {
            log.error("Error calling Hugging Face API", e);
            return "Се извинувам, имав проблем да обработам прашање. Ве молам обидете се повторно.";
        }
    }

    private boolean containsCategoryReference(String question) {
        String normalized = question.toLowerCase();
        return normalized.contains("технологија") || normalized.contains("tech") ||
                normalized.contains("кариера") || normalized.contains("career") ||
                normalized.contains("наука") || normalized.contains("истражување") || normalized.contains("research") ||
                normalized.contains("култура") || normalized.contains("culture") ||
                normalized.contains("здравје") || normalized.contains("health") ||
                normalized.contains("спорт") || normalized.contains("sport") ||
                normalized.contains("едукација") || normalized.contains("education") ||
                normalized.contains("работилниц") || normalized.contains("workshop");
    }

    private String buildSystemMessage(String context, ChatbotIntent intent) {
        return String.format("""
            Ти си UniVibe асистент. Одговарај САМО на македонски кирилица.
            
            КРИТИЧНИ ПРАВИЛА:
            1. Ако контекстот содржи • (куршум), прикажи ги ТОЧНО како што се - БЕЗ ПРОМЕНИ
            2. НЕ додавај текст која веќе е во контекстот во заградите (...)
            3. НЕ измислувај информации - користи САМО што е дадено
            4. НЕ повторувај инструкции од контекстот
            5. Биди краток и директен
            
            ФОРМАТ:
            - Листа со куршуми → Прикажи точно + 1 кратка реченица
            - Инструкции → Прикажи точно БЕЗ дополнителни објаснувања
            - Емотикони: 😊 👋 ✨ (ретко, само на крајот)
            
            ПРИМЕРИ:
            
            Контекст со (напомена):
            "• Технологија\\n• Кариера\\n(Користи го пребарувањето)"
            Точен одговор: "• Технологија\\n• Кариера\\n\\nКоја те интересира? 😊"
            Погрешно: "• Технологија\\n• Кариера\\n\\nКористи го пребарувањето за да филтрираш."
            
            Контекст со готови инструкции:
            "1. Отвори детали\\n2. Кликни\\n3. Следи инструкции\\n\\nВажно: Бесплатно е"
            Точен одговор: "1. Отвори детали\\n2. Кликни\\n3. Следи инструкции\\n\\nВажно: Бесплатно е\\n\\nЛесно е! 😊"
            Погрешно: "Лесно е! Само отвори детали, кликни и следи..."
            
            КОНТЕКСТ (прикажи го ТОЧНО):
            %s
            
            ВАЖНО: НЕ додавај објаснувања за тоа што веќе пишува во заградите!
            """, context, intent);
    }

    private String validateAndFixResponse(String answer, String context, ChatbotIntent intent) {
        boolean contextHasBullets = context.contains("•");
        boolean answerHasBullets = answer.contains("•");

        if (contextHasBullets && !answerHasBullets) {
            log.warn("Response missing expected bullet points, using fallback");
            return getFallbackResponse(intent, context);
        }

        if (context.contains("(Кликни") && answer.contains("Кликни на")) {
            answer = answer.replaceAll("(?i)Кликни на (?:интересниот|интересувачкиот) (?:ти )?настан.*?(?=\\n|$)", "");
        }

        if (context.contains("(Оди во") && answer.contains("Оди во")) {
            answer = answer.replaceAll("(?i)Оди во [\"„].*?[\"\"] (?:секција|страна|мени).*?(?=\\n|$)", "");
        }

        answer = answer.replaceAll("(?i)Моментално е достапен само дел.*?(?=\\n|$)", "");
        answer = answer.replaceAll("(?i)Провери (?:понатаму|повторно|наскоро) за да видиш.*?(?=\\n|$)", "");

        if (answer.length() < 20 && !contextHasBullets) {
            return answer + "\n\nИма ли уште нешто што можам да ти помогнам? 😊";
        }

        long latinCount = answer.chars().filter(c -> (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')).count();
        if (latinCount > 10) {
            log.warn("Response contains {} Latin characters, cleaning further", latinCount);
            answer = cleanLanguageMix(answer);
        }

        answer = answer.replaceAll("\\n{3,}", "\n\n");
        answer = answer.replaceAll("(?m)^\\s+$", "");

        return answer.trim();
    }

    private String getFallbackResponse(ChatbotIntent intent, String context) {
        return switch (intent) {
            case CATEGORIES -> {
                if (context.contains("•")) {
                    yield context + "\n\nКоја категорија те интересира? 😊";
                }
                yield "Моментално нема достапни категории. Провери подоцна! 😊";
            }
            case EVENTS -> {
                if (context.contains("•")) {
                    yield context + "\n\nКликни на настан за повеќе детали! ✨";
                }
                yield "Моментално нема објавени настани. Провери наскоро за нови! 😊";
            }
            case FILTERS -> """
                Можеш да пребаруваш настани користејќи ги овие филтри:
                
                • Категорија (Технологија, Кариера, итн.)
                • Датум (од-до)
                • Факултет
                • Клучен збор
                
                Оди на почетната страна и кликни на копчето „Пребарај настан\" во секцијата „Најнови настани\"! 😊
                """;
            case REGISTRATION -> """
                Пријавувањето е едноставно:
                
                1. Отвори детали за настанот
                2. Кликни на „Пријави се\"
                3. Следи ги инструкциите
                
                Повеќето настани се бесплатни! 🎉
                """;
            case GREETING -> """
                Здраво! Добредојде на UniVibe! 👋
                
                Јас сум твој асистент и можам да ти помогнам со:
                • Пребарување на настани
                • Категории и типови
                • Пријавување
                
                Што те интересира? 😊
                """;
            default -> context.isBlank()
                    ? "Можам да ти помогнам со настани, пребарување и пријавување. Што сакаш да знаеш? 😊"
                    : context;
        };
    }

    private boolean isThankYouMessage(String message) {
        String normalized = message.toLowerCase().trim();
        return normalized.matches(".*\\b(благодарам|фала|хвала|thanks|thank you|merci)\\b.*");
    }

    private String getThankYouResponse() {
        return "Нема на што! Секогаш ми е драго да помогнам! 😊\n\nАко имаш уште прашања, слободно прашај! 👋";
    }

    private String buildFallbackContext() {
        return """
            UniVibe е платформа за универзитетски настани.
            
            Можеш да:
            • Пребаруваш настани
            • Филтрираш по категорија, датум, факултет
            • Се пријавуваш на настани
            """;
    }

    private String cleanLanguageMix(String text) {
        return text
                .replaceAll("(?i)^(Da|Naravno|Razumem|Dobro|Ok|Sure|Yes),\\s*", "")
                .replaceAll("(?i)^(Well|So|Now),\\s*", "")

                .replaceAll("(?i)\\bstrana(?:ta)?\\b", "страната")
                .replaceAll("(?i)\\bstranica(?:ta)?\\b", "страната")
                .replaceAll("(?i)\\bizaber[ie]\\b", "избери")
                .replaceAll("(?i)\\bpron[aā][đd]i\\b", "најди")
                .replaceAll("(?i)\\bpogledaj(?:te)?\\b", "погледни")
                .replaceAll("(?i)\\bklikni\\b", "кликни")
                .replaceAll("(?i)\\bun[eе]si\\b", "внеси")
                .replaceAll("(?i)\\botvor[ie]\\b", "отвори")
                .replaceAll("(?i)\\bvideti\\b", "види")
                .replaceAll("(?i)\\bkoristi\\b", "користи")
                .replaceAll("(?i)\\bprebaruvaj\\b", "пребарувај")
                .replaceAll("(?i)\\bfiltrira[jt]\\b", "филтрирај")
                .replaceAll("(?i)\\bprikaz[ie]\\b", "прикажи")

                .replaceAll("(?i)\\bkeyword\\b", "клучен збор")
                .replaceAll("(?i)\\bcategor(?:y|ies)\\b", "категорија")
                .replaceAll("(?i)\\bfilters?\\b", "филтри")
                .replaceAll("(?i)\\bevents?\\b", "настани")
                .replaceAll("(?i)\\bsearch\\b", "пребарај")
                .replaceAll("(?i)\\bregister\\b", "пријави се")
                .replaceAll("(?i)\\blogin\\b", "најави се")

                .replaceAll("(?i)\\btech(?:nology)?\\b", "Технологија")
                .replaceAll("(?i)\\bcareer\\b", "Кариера")
                .replaceAll("(?i)\\bresearch\\b", "Наука")
                .replaceAll("(?i)\\b(?:science|nauka)\\b", "Наука")
                .replaceAll("(?i)\\bculture\\b", "Култура")
                .replaceAll("(?i)\\bhealth\\b", "Здравје")
                .replaceAll("(?i)\\bsports?\\b", "Спорт")
                .replaceAll("(?i)\\beducation\\b", "Едукација")
                .replaceAll("(?i)\\bworkshops?\\b", "Работилници")

                .replaceAll("(?i)оди (?:во|на) [\"']?(?:мени|секција|категории|настани)[\"']?.*?(?:\\n|и)", "\n")
                .replaceAll("(?i)кликни (?:на|во) [\"']?(?:копче|button|link)[\"']?.*?(?:\\n|и)", "\n")

                .replaceAll("\\n{3,}", "\n\n")
                .replaceAll("(?m)^\\s+", "")
                .trim();
    }
}