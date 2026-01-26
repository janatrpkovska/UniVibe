package com.univibe.backend.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.univibe.backend.model.Category;
import com.univibe.backend.model.Event;
import com.univibe.backend.model.EventMode;
import com.univibe.backend.service.CategoryService;
import com.univibe.backend.service.EventScraperService;
import com.univibe.backend.service.EventService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
public class EventScraperServiceImpl implements EventScraperService {
    private final EventService eventService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final CategoryService categoryService;

    public EventScraperServiceImpl(EventService eventService, CategoryService categoryService) {
        this.eventService = eventService;
        this.categoryService = categoryService;
    }

    @Override
    @Scheduled(fixedRate = 21600000) // every 6 hours
    public void runScraper() {
        System.out.println("Scraper started");
        runScriptsSequentially();
    }

    public void createScrapedEvents() {
        try {
            File eventsFile = new File("../scraper/events_ai.json");
            if (!eventsFile.exists()) {
                System.out.println("No events_ai.json file found.");
                return;
            }

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            mapper.registerModule(new JavaTimeModule());

            // Deserialize JSON into list of maps
            List<Map<String, Object>> eventsList = mapper.readValue(
                    eventsFile, new TypeReference<List<Map<String, Object>>>() {}
            );

            for (Map<String, Object> map : eventsList) {
                String title = (String) map.get("title");
                String description = (String) map.get("description");
                String startDateStr = (String) map.get("startDate");
                String endDateStr = (String) map.get("endDate");
                String location = (String) map.get("location");
                String categoryName = (String) map.get("category");
                String mode =  (String) map.get("mode");
                String image_url = (String) map.get("image_url");


                // Resolve category from service
                // Create a map
                Map<String, String> categoryMap = new HashMap<>();

                categoryMap.put("tech", "Технологија");
                categoryMap.put("career", "Кариера");
                categoryMap.put("research", "Наука / Истражување");
                categoryMap.put("culture", "Култура");
                categoryMap.put("health", "Здравје");
                categoryMap.put("sport", "Спорт");
                categoryMap.put("education", "Едукација");
                categoryMap.put("workshop", "Работилници");

                Category category = categoryService.getCategoryByName(categoryMap.get(categoryName));

                eventService.createScrapedEvent(
                        title,
                        description,
                        startDateStr!=null?LocalDateTime.parse(startDateStr):null,
                        endDateStr!=null?LocalDate.parse(endDateStr):null,
                        location,
                        image_url,
                        category,
                        null,
                        null,
                        EventMode.valueOf(mode)
                );
            }

            System.out.println("All scraped events created successfully.");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public void removeEventsPresentInDatabase() {
        try {
            File eventsFile = new File("../scraper/events_raw.json");
            if (!eventsFile.exists()) {
                System.out.println("No events_raw.json file found.");
                return;
            }

            // Create a new ObjectMapper configured to ignore unknown properties
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            // Read JSON into a list of Event objects
            List<Event> events = mapper.readValue(eventsFile, new TypeReference<List<Event>>() {});

            // Remove events that are already in the DB (based on title)
            Iterator<Event> iterator = events.iterator();
            while (iterator.hasNext()) {
                Event event = iterator.next();

                if (eventService.existsByTitle(event.getTitle())) {
                    iterator.remove();
                    System.out.println("Removed event: " + event.getTitle());
                }
            }

            // Write the filtered list back to JSON
            mapper.writerWithDefaultPrettyPrinter().writeValue(eventsFile, events);

            System.out.println("Removed events already in DB. Remaining: " + events.size());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    @Async
    public CompletableFuture<Void> runScriptsSequentially() {
        try {
            //First script
            ProcessBuilder pb1 = new ProcessBuilder("python", "../scraper/events_scraper.py");
            pb1.redirectErrorStream(true);
            Process p1 = pb1.start();
            logProcessOutput(p1);
            int exit1 = p1.waitFor();
            System.out.println("First script finished with exit code: " + exit1);

            removeEventsPresentInDatabase();

            //Second script, only after first finishes
            ProcessBuilder pb2 = new ProcessBuilder("python", "../scraper/enrich_events.py");
            pb2.redirectErrorStream(true);
            Process p2 = pb2.start();
            logProcessOutput(p2);
            int exit2 = p2.waitFor();
            System.out.println("Second script finished with exit code: " + exit2);

            createScrapedEvents();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return CompletableFuture.completedFuture(null);
    }

    private void logProcessOutput(Process process) throws Exception {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        }
    }
}
