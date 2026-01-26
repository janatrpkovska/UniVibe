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

    private String buildGreetingContext() {
        return """
            ПОЗДРАВ:
            Кога корисникот се поздравува (Здраво, Добар ден итн.), одговори топло и пријателски:
            
            "Здраво! Добредојде на UniVibe! 👋
            
            Јас сум твој асистент и тука сум да ти помогнам да најдеш настани, да филтрираш по категорија, датум или универзитет.
            
            Што те интересира?
            • Кои категории постојат?
            • Кои се идните настани?
            • Како да најдам настани?
            • Како да се пријавам на настан?"
            
            Одговори кратко и пријателски.
            """;
    }

    private String buildCategoriesContext() {
        String categoriesList = categoryRepository.findAll()
                .stream()
                .map(c -> "• " + translateCategoryToMacedonian(c.getName()))
                .collect(Collectors.joining("\n"));

        if (categoriesList.isBlank()) {
            categoriesList = "• Моментално нема категории во базата";
        }

        return """
            КАТЕГОРИИ НА UNIVIBE:
            Кога корисникот праша "Кои категории постојат?" или слично, прикажи ја оваа ЦЕЛОСНА листа:
            
            """ + categoriesList + """
            
            
            Потоа додај:
            За да најдеш настани по категорија, оди во „Настани" и избери категорија.
            """;
    }

    private String buildEventsContext() {
        String eventsList = eventRepository.findAllByOrderByStartDateDesc()
                .stream()
                .limit(10)
                .map(e -> "• " + e.getTitle() + " - " + e.getStartDate())
                .collect(Collectors.joining("\n"));

        if (eventsList.isBlank()) {
            return """
                ИДНИ НАСТАНИ:
                Кога корисникот праша "Кои се идните настани?" одговори:
                
                "Моментално нема објавени идни настани на UniVibe. Провери повторно подоцна, нови настани се додаваат редовно."
                
                За да видиш сите достапни настани:
                • Оди во „Настани" од главното мени
                • Или користи ја страната „Пребарај настани"
                """;
        }

        return """
            ИДНИ НАСТАНИ:
            Кога корисникот праша "Кои се идните настани?" прикажи ја оваа ЦЕЛОСНА листа:
            
            """ + eventsList + """
            
            
            Потоа додај:
            За повеќе детали, кликни на настанот и избери „Детали".
            За филтрирање, оди во „Пребарај настани".
            """;
    }

    private String buildFacultiesContext() {
        String facultiesList = facultyRepository.findAll()
                .stream()
                .map(f -> "• " + f.getName())
                .collect(Collectors.joining("\n"));

        return """
            УНИВЕРЗИТЕТИ И ФАКУЛТЕТИ:
            На UniVibe можеш да најдеш настани од следните факултети:
            """ + facultiesList + """
            
            
            За да филтрираш настани по факултет:
            1. Оди во „Пребарај настани"
            2. Избери факултет од dropdown менито
            3. Кликни „Search"
            """;
    }

    private String buildFiltersContext() {
        String categoriesList = categoryRepository.findAll()
                .stream()
                .map(c -> translateCategoryToMacedonian(c.getName()))
                .collect(Collectors.joining(", "));

        String facultiesList = facultyRepository.findAll()
                .stream()
                .map(f -> f.getName())
                .collect(Collectors.joining(", "));

        return """
            ФИЛТРИРАЊЕ И ПРЕБАРУВАЊЕ:
            Филтрите се наоѓаат на страната „Пребарај настани".
            
            Можеш да филтрираш настани според:
            • Категорија: """ + categoriesList + """
            
            • Тип на настан (хакатон, работилница, предавање, забава)
            • Универзитет/Факултет: """ + facultiesList + """
            
            • Датум (од-до период)
            • Клучен збор (keyword во наслов или опис)
            
            Како да користиш филтри:
            1. Отвори ја страната „Пребарај настани"
            2. Избери ги саканите филтри
            3. Внеси клучен збор ако бараш нешто специфично
            4. Кликни „Search" за да ги видиш резултатите
            
            Ако нема резултати:
            - Отстрани некои филтри (кликни Reset)
            - Прошири го периодот на датум
            - Користи пошироки клучни зборови
            """;
    }

    private String buildEventDetailsContext() {
        return """
            ДЕТАЛИ ЗА НАСТАНИ:
            За да видиш детали за настан:
            1. Кликни на картичката за настанот
            2. Кликни копче „Детали"
            3. Ќе се отвори страна со целосни информации
            
            Деталите вклучуваат:
            • Наслов и опис на настанот
            • Датум и време
            • Локација (адреса или „Online")
            • Тип на настан (хакатон, работилница, предавање)
            • Мод (ONLINE, OFFLINE, HYBRID)
            • Организатор
            • Слика (ако има)
            • Линк за регистрација
            
            Модови на настани:
            • ONLINE - настанот е преку интернет (Zoom, Teams, итн.)
            • OFFLINE - физички настан на локација
            • HYBRID - комбинација, може и online и физички
            """;
    }

    private String buildRegistrationContext() {
        return """
            ПРИЈАВА НА НАСТАНИ:
            За да се пријавиш на настан:
            1. Отвори ги деталите за настанот
            2. Кликни на копчето „Register" или „Пријави се"
            3. Следи ги инструкциите за пријава
            
            Важно:
            • Некои настани бараат да си најавен/а на UniVibe
            • Некои настани имаат надворешна регистрација (ќе те однесе на друга страна)
            • Повеќето студентски настани се БЕСПЛАТНИ
            • Ако има цена, ќе биде наведена во описот
            
            Ако нема копче за пријава:
            • Настанот е можеби само информативен
            • Регистрацијата може да е преку организатор
            • Провери во описот за контакт информации или линк
            
            Откажување:
            • Ако се пријавил/а преку надворешна форма, откажувањето се прави таму
            • Контактирај го организаторот ако имаш прашања
            """;
    }

    private String buildProfileContext() {
        return """
            ПРОФИЛ И НАЈАВА:
            Дали ти треба профил?
            • НЕ мора да имаш профил за да разгледуваш настани
            • Можеш да пребаруваш, филтрираш и гледаш детали без профил
            • Профил ти треба само ако сакаш да се пријавиш на настани
            
            Како да се најавиш:
            1. Кликни на „Најави се" горе десно
            2. Внеси ги твоите податоци (email и лозинка)
            3. Ако немаш профил, кликни „Регистрирај се"
            
            Откако ќе се најавиш:
            • Полесно се пријавуваш на настани
            • Можеш да ги следиш твоите пријави
            • Добиваш персонализирани препораки
            """;
    }

    private String buildTroubleshootingContext() {
        return """
            РЕШАВАЊЕ НА ПРОБЛЕМИ:
            
            Не можам да најдам настан:
            1. Отстрани ги сите филтри (кликни Reset)
            2. Користи пошироки keywords (пр. "AI" наместо "AI workshop")
            3. Прошири го периодот на датум (цел месец наместо 1 ден)
            4. Провери дали си избрал правилна категорија
            5. Провери дали филтерот за универзитет/факултет не го крие
            
            Нема резултати при пребарување:
            • Можеби моментално нема настани што се совпаѓаат со твоите филтри
            • Пробај друга категорија или датум
            • Провери повторно подоцна - нови настани се додаваат редовно
            
            Проблеми со пријава:
            • Провери дали си најавен/а
            • Провери дали настанот сè уште е отворен за пријава
            • Ако линкот не работи, контактирај го организаторот
            
            За дополнителна помош:
            • Опиши детално што бараш
            • Наведи ги филтрите што ги користиш
            • Кажи што точно не работи
            """;
    }

    private String buildGeneralContext() {
        String categoriesList = categoryRepository.findAll()
                .stream()
                .map(c -> translateCategoryToMacedonian(c.getName()))
                .collect(Collectors.joining(", "));

        return """
            ЗА UNIVIBE:
            UniVibe е платформа за универзитетски настани во Северна Македонија.
            
            Што можеш да правиш на UniVibe:
            • Пребарување на настани од различни универзитети и факултети
            • Филтрирање по категорија, датум, локација, тип
            • Разгледување на детални информации за секој настан
            • Пријавување/регистрација на настани што те интересираат
            • Следење на идни настани
            
            Достапни категории:
            """ + categoriesList + """
            
            
            Како да започнеш:
            1. Разгледај ги категориите на главната страна
            2. Користи ја страната „Пребарај настани" за филтрирање
            3. Кликни на настан за да видиш детали
            4. Пријави се на настани што те интересираат
            
            Сè е БЕСПЛАТНО и отворено за студенти!
            """;
    }

    private String translateCategoryToMacedonian(String englishName) {
        return switch (englishName.toLowerCase()) {
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