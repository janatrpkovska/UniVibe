package com.univibe.backend.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.univibe.backend.dto.ChatResponse;
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
    public ChatResponse askChatbot(String question, boolean aiEnabled) {
        try {
            log.info("Received question: {}", question);

            if (question == null || question.trim().isEmpty()) {
                return new ChatResponse("Ве молам внесете прашање.", "NONE");
            }

            if (!question.matches(".*[а-шA-Za-z0-9].*")) {
                return new ChatResponse(
                        "Не го разбирам барањето. Те молам постави прашање поврзано со UniVibe.",
                        "NONE"
                );
            }

            String lower = question.toLowerCase().trim();
            log.info("LOWER VALUE >>> [{}]", lower);

            if (isThankYouMessage(lower)) {
                return new ChatResponse(getThankYouResponse(), "NONE");
            }

            if (lower.contains("најав")
                    || lower.contains("login")
                    || lower.contains("log in")) {

                return new ChatResponse("Внеси email 📧", "LOGIN_EMAIL");
            }

            if (lower.contains("регистра")
                    || lower.contains("register")
                    || lower.contains("акаунт")
                    || lower.contains("account")) {

                return new ChatResponse(
                        "Можеш да се регистрираш директно тука во чатот 😊\n\nВнеси име:",
                        "REGISTER"
                );
            }

            if (lower.contains("newsletter") || lower.contains("новости")) {
                return new ChatResponse("Внеси email за новости 💌", "NEWSLETTER");
            }

            if (isGreeting(lower)) {
                return new ChatResponse("""
                        Здраво! 😊
    
                        Можам да ти помогнам со:
                        • Пребарување на настани
                        • Категории
                        • Најава/Регистрација
    
                        Што те интересира?
                        """, "NONE");
            }

            if (!aiEnabled) {
                return handleStrictStaticMode(lower);
            }

            ChatbotIntent intent = intentDetectorService.detectIntent(question);
            log.info("Detected intent: {}", intent);

            String context;
            if (intent == ChatbotIntent.EVENTS && containsCategoryReference(question)) {
                context = chatbotDataService.getContextForEventsWithCategory(question);
            } else {
                context = chatbotDataService.getContextForIntent(intent);
            }

            if (context == null || context.isBlank()) {
                return new ChatResponse(
                        "Не се пронајдени релевантни настани за твоето барање.",
                        "NONE"
                );
            }

            String systemMessage = buildSystemMessage(context, intent);

            ObjectMapper mapper = new ObjectMapper();
            ObjectNode requestJson = mapper.createObjectNode();

            requestJson.put("model", "meta-llama/Llama-3.1-8B-Instruct");
            requestJson.put("max_tokens", 500);
            requestJson.put("temperature", 0.3);
            requestJson.put("top_p", 0.8);

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

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(HF_API_URL))
                    .header("Authorization", "Bearer " + huggingFaceToken)
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(30))
                    .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(requestJson)))
                    .build();

            HttpResponse<String> response =
                    httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                log.error("HF API error: {}", response.body());
                return new ChatResponse(
                        "Се извинувам, имам проблем да добијам одговор. Обиди се повторно.",
                        "NONE"
                );
            }

            JsonNode root = mapper.readTree(response.body());
            JsonNode choices = root.path("choices");

            if (!choices.isArray() || choices.isEmpty()) {
                return new ChatResponse(
                        "Не добив одговор од AI. Обиди се повторно.",
                        "NONE"
                );
            }

            String answer = choices.get(0)
                    .path("message")
                    .path("content")
                    .asText();

            if (answer == null || answer.isBlank()) {
                return new ChatResponse(
                        "Не добив одговор од AI. Обиди се повторно.",
                        "NONE"
                );
            }

            answer = cleanLanguageMix(answer);
            answer = validateAndFixResponse(answer, context, intent);

            return new ChatResponse(answer.trim(), "NONE");

        } catch (Exception e) {
            log.error("Error calling Hugging Face API", e);
            return new ChatResponse(
                    "Се извинувам, имав проблем да го обработам прашањето. Ве молам обидете се повторно.",
                    "NONE"
            );
        }
    }

    private ChatResponse handleStrictStaticMode(String lower) {

        if (isGreeting(lower)) {
            return new ChatResponse("""
                    Здраво! 👋
    
                    Можам да ти помогнам со:
                    • Пребарување на настани
                    • Категории (Спорт, Наука, Кариера...)
                    • Регистрација/Најава
    
                    Што те интересира?
                    """, "NONE");
        }

        if (lower.contains("спорт")) return getCategoryResponse("Спорт");
        if (lower.contains("технолог")) return getCategoryResponse("Технологија");
        if (lower.contains("кариера")) return getCategoryResponse("Кариера");
        if (lower.contains("наука")) return getCategoryResponse("Наука");
        if (lower.contains("истражува")) return getCategoryResponse("Истражување");
        if (lower.contains("култура")) return getCategoryResponse("Култура");
        if (lower.contains("здравје")) return getCategoryResponse("Здравје");
        if (lower.contains("едукац")) return getCategoryResponse("Едукација");
        if (lower.contains("работилниц")) return getCategoryResponse("Работилници");

        if (lower.contains("како да објав")) {
            return new ChatResponse("""
                    Доколку сакате да објавите настан на UniVibe,
                    испратете ни краток опис, датум и локација на:
    
                    📩 univibe@contact.mk
    
                    Ќе ве контактираме со дополнителни информации.
                    """, "NONE");
        }

        return new ChatResponse(
                "Можам да одговорам само на прашања поврзани со UniVibe и универзитетски настани.",
                "NONE"
        );
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
            Ти си UniVibe асистент.
            
            КРИТИЧНО:
            - Одговарај САМО на македонски кирилица.
            - Користи САМО информации од дадениот контекст.
            - Ако контекстот е празен → кажи дека нема такви настани.
            - НЕ измислувај.
            - НЕ додавај нови информации.
            - Ако прашањето не е поврзано со UniVibe → љубезно одбиј.
            
            Ако корисникот бара:
            - настан по датум → провери од контекстот
            - online / hybrid → провери од контекстот
            - локација → провери од контекстот
            - клучен збор → филтрирај од контекстот
            
            Контекст:
            %s
            """, context);
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
        if (context != null && context.contains("•")) {
            return context + "\n\nИзбери настан за повеќе информации 😊";
        }

        return "Моментално нема достапни информации за ова барање.";
    }

    private boolean isThankYouMessage(String message) {
        String normalized = message.toLowerCase().trim();
        return normalized.matches(".*\\b(благодарам|фала|хвала|thanks|thank you|merci)\\b.*");
    }

    private ChatResponse getCategoryResponse(String category) {
        String context = chatbotDataService.getContextForEventsWithCategory(category);

        if (context == null || context.isBlank()) {
            return new ChatResponse(
                    "Моментално нема објавени настани во категоријата \"" + category + "\". 😊",
                    "NONE"
            );
        }

    return new ChatResponse(context, "NONE");
    }

    private boolean isGreeting(String text) {
        String t = text.toLowerCase();

        return t.contains("здраво") ||
               t.contains("добар ден") ||
               t.contains("добро утро") ||
               t.contains("добра вечер") ||
               t.equals("hi") ||
               t.equals("hello") ||
               t.equals("hey");
    }

    private boolean isSimplePolite(String text) {
        String t = text.toLowerCase().trim();

        return t.equals("ок") ||
               t.equals("океј") ||
               t.equals("оки") ||
               t.equals("оке") ||
               t.equals("окк") ||
               t.equals("супер") ||
               t.equals("топ") ||
               t.equals("важи") ||
               t.equals("пријатно") ||
               t.equals("чао");
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