package com.univibe.backend.service.impl;

import com.univibe.backend.model.ChatbotIntent;
import com.univibe.backend.repository.CategoryJpaRepository;
import com.univibe.backend.repository.EventJpaRepository;
import com.univibe.backend.repository.FacultyJpaRepository;
import com.univibe.backend.service.ChatbotDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatbotDataServiceImpl implements ChatbotDataService {
    private final CategoryJpaRepository categoryRepository;
    private final EventJpaRepository eventRepository;
    private final FacultyJpaRepository facultyRepository;

    @Override
    public String getContextForIntent(ChatbotIntent intent) {
        return switch (intent) {
            case GREETING -> buildGreetingContext();
            case CATEGORIES -> buildCategoriesContext();
            case EVENTS -> buildEventsContext();
            case FACULTIES -> buildFacultiesContext();
            case FILTERS -> buildFiltersContext();
            case EVENT_DETAILS -> buildEventDetailsContext();
            case REGISTRATION -> buildRegistrationContext();
            case PROFILE -> buildProfileContext();
            case TROUBLESHOOTING -> buildTroubleshootingContext();
            case GENERAL -> buildGeneralContext();
        };
    }

    public String getContextForEventsWithCategory(String question) {
        String category = extractCategoryFromQuestion(question);

        if (category == null) {
            return buildEventsContext();
        }

        String eventsList = eventRepository.findAll()
                .stream()
                .filter(e -> e.getCategory() != null &&
                        translateCategoryToMacedonian(e.getCategory().getName()).equalsIgnoreCase(category))
                .limit(8)
                .map(e -> String.format("• %s - %s", e.getTitle(),
                        e.getStartDate() != null ? e.getStartDate() : "Датум не е наведен"))
                .collect(Collectors.joining("\n"));

        if (eventsList.isBlank()) {
            return String.format("Моментално нема настани од категоријата „%s\".\n\nПробај со друга категорија или провери подоцна! 😊", category);
        }

        return String.format("""
            Еве ги настаните од категоријата „%s":
            
            %s
            
            (Кликни на настан за повеќе детали)
            """, category, eventsList);
    }

    private String extractCategoryFromQuestion(String question) {
        String normalized = question.toLowerCase();

        if (normalized.contains("технологија") || normalized.contains("tech")) {
            return "Технологија";
        }
        if (normalized.contains("кариера") || normalized.contains("career")) {
            return "Кариера";
        }
        if (normalized.contains("наука") || normalized.contains("науч") ||
                normalized.contains("истражување") || normalized.contains("research")) {
            return "Наука/Истражување";
        }
        if (normalized.contains("култура") || normalized.contains("culture")) {
            return "Култура";
        }
        if (normalized.contains("здравје") || normalized.contains("health")) {
            return "Здравје";
        }
        if (normalized.contains("спорт") || normalized.contains("sport")) {
            return "Спорт";
        }
        if (normalized.contains("едукација") || normalized.contains("education")) {
            return "Едукација";
        }
        if (normalized.contains("работилниц") || normalized.contains("workshop")) {
            return "Работилници";
        }

        return null;
    }

    private String buildGreetingContext() {
        return """
            Здраво! Добредојде на UniVibe! 👋
            
            Јас сум твој асистент и можам да ти помогнам со:
            • Пребарување на настани
            • Категории и типови настани
            • Филтрирање и пребарување
            • Пријавување на настани
            """;
    }

    private String buildCategoriesContext() {
        String categoriesList = categoryRepository.findAll()
                .stream()
                .map(c -> "• " + translateCategoryToMacedonian(c.getName()))
                .collect(Collectors.joining("\n"));

        if (categoriesList.isBlank()) {
            return "Моментално нема категории во базата.";
        }

        return String.format("""
            На UniVibe можеш да најдеш настани од овие категории:
            
            %s
            
            (Користи го пребарувањето за да филтрираш по категорија)
            """, categoriesList);
    }

    private String buildEventsContext() {
        String eventsList = eventRepository.findAllByOrderByStartDateDesc()
                .stream()
                .limit(8)
                .map(e -> String.format("• %s - %s", e.getTitle(),
                        e.getStartDate() != null ? e.getStartDate() : "Датум не е наведен"))
                .collect(Collectors.joining("\n"));

        if (eventsList.isBlank()) {
            return "Моментално нема објавени идни настани. Провери повторно наскоро!";
        }

        return String.format("""
            Еве ги идните настани:
            
            %s
            
            (Кликни на настан за повеќе детали)
            """, eventsList);
    }

    private String buildFacultiesContext() {
        String facultiesList = facultyRepository.findAll()
                .stream()
                .map(f -> "• " + f.getName())
                .collect(Collectors.joining("\n"));

        if (facultiesList.isBlank()) {
            return "Моментално нема достапни факултети.";
        }

        return String.format("""
            Достапни факултети на UniVibe:
            
            %s
            
            (Можеш да филтрираш настани по факултет)
            """, facultiesList);
    }

    private String buildFiltersContext() {
        String categoriesList = categoryRepository.findAll()
                .stream()
                .map(c -> translateCategoryToMacedonian(c.getName()))
                .collect(Collectors.joining(", "));

        String facultiesList = facultyRepository.findAll()
                .stream()
                .limit(5)
                .map(f -> f.getName())
                .collect(Collectors.joining(", "));

        return String.format("""
            Можеш да пребаруваш и филтрираш настани според:
            
            • Категорија: %s
            • Тип на настан (хакатон, работилница, предавање, забава)
            • Факултет: %s
            • Датум (од-до)
            • Клучен збор во наслов или опис
            
            (Оди во „Пребарај настани\" и користи ги филтрите)
            """,
                categoriesList.isBlank() ? "Нема достапни" : categoriesList,
                facultiesList.isBlank() ? "Нема достапни" : facultiesList + (facultyRepository.count() > 5 ? " и други" : "")
        );
    }

    private String buildEventDetailsContext() {
        return """
            За да видиш детали за настан:
            
            1. Кликни на настанот што те интересира
            2. Притисни на копчето „Детали\"
            3. Таму ќе најдеш:
               • Наслов и детален опис
               • Датум и време на одржување
               • Локација (Online или физичка адреса)
               • Тип на настан (хакатон, работилница, предавање...)
               • Мод (ONLINE, OFFLINE, или HYBRID)
               • Факултет организатор
               • Слика на настанот
               • Линк за регистрација
            
            Лесно е! 😊
            """;
    }

    private String buildRegistrationContext() {
        return """
            Пријавувањето на настани е многу едноставно:
            
            1. Отвори детали за настанот што те интересира
            2. Кликни на копчето „Пријави се\"
            3. Следи ги инструкциите (понекогаш е надворешен линк)
            
            Важно:
            • Повеќето студентски настани се бесплатни
            • Некои бараат корисничка најава
            • Некои користат надворешни регистрациски линкови
            """;
    }

    private String buildProfileContext() {
        return """
            UniVibe може да се користи и без профил!
            
            Профил е потребен само за пријавување на одредени настани.
            
            За само пребарување и преглед на настани, не треба најава.
            """;
    }

    private String buildTroubleshootingContext() {
        return """
            Ако имаш проблем, еве неколку совети:
            
            • Ако нема резултати - пробај со помалку филтри
            • Ако настанот е полн - некои имаат ограничена регистрација
            • Ако линкот не работи - надворешните линкови зависат од организаторите
            • Ако не можеш да се пријавиш - провери дали е потребна најава
            
            Сè уште имаш проблем? Контактирај го тимот на UniVibe.
            """;
    }

    private String buildGeneralContext() {

        long eventCount = eventRepository.count();

        return String.format("""
            UniVibe е платформа за универзитетски настани во Северна Македонија.
            
            Што можеш да правиш:
            • Пребарување и филтрирање на настани
            • Преглед на детални информации
            • Пријавување на настани
            
            
            Моментално има %d објавени настани.
            """,
                eventCount
        );
    }

    private String translateCategoryToMacedonian(String englishName) {
        return switch (englishName.toLowerCase().trim()) {
            case "technology", "tech" -> "Технологија";
            case "career" -> "Кариера";
            case "science", "research", "science/research" -> "Наука/Истражување";
            case "culture" -> "Култура";
            case "health" -> "Здравје";
            case "sport", "sports" -> "Спорт";
            case "education" -> "Едукација";
            case "workshop", "workshops" -> "Работилници";
            default -> englishName;
        };
    }
}