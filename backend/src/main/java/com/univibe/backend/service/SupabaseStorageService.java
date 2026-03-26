package com.univibe.backend.service;

import com.univibe.backend.config.SupabaseProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SupabaseStorageService {

    private static final long MAX_BYTES = 5 * 1024 * 1024;
    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp", "image/gif"
    );

    private final SupabaseProperties props;
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(30))
            .build();

    public String uploadPublicImage(MultipartFile file) {
        if (props.getUrl() == null || props.getUrl().isBlank()
                || props.getServiceRoleKey() == null || props.getServiceRoleKey().isBlank()) {
            throw new IllegalStateException(
                    "Supabase storage is not configured. Set environment variables SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
            );
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Дозволени се само JPEG, PNG, WebP и GIF.");
        }
        if (file.getSize() > MAX_BYTES) {
            throw new IllegalArgumentException("Сликата мора да биде најмногу 5MB.");
        }
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Празна датотека.");
        }

        String ext = extensionFor(contentType);
        String objectPath = "events/" + UUID.randomUUID() + ext;
        String base = props.getUrl().replaceAll("/$", "");
        String bucket = props.getStorageBucket();
        String uploadUrl = base + "/storage/v1/object/" + bucket + "/" + objectPath;

        byte[] body;
        try {
            body = file.getBytes();
        } catch (IOException e) {
            throw new IllegalStateException("Не можев да ја прочитам датотеката.", e);
        }

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(uploadUrl))
                .timeout(Duration.ofMinutes(2))
                .header("Authorization", "Bearer " + props.getServiceRoleKey())
                .header("apikey", props.getServiceRoleKey())
                .header("Content-Type", contentType)
                .header("x-upsert", "true")
                .POST(HttpRequest.BodyPublishers.ofByteArray(body))
                .build();

        HttpResponse<String> response;
        try {
            response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        } catch (IOException e) {
            throw new IllegalStateException("Мрежна грешка при upload.", e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Upload прекинат.", e);
        }

        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new IllegalStateException(
                    "Upload failed (" + response.statusCode() + "): " + truncate(response.body(), 500)
            );
        }

        return base + "/storage/v1/object/public/" + bucket + "/" + objectPath;
    }

    private static String extensionFor(String contentType) {
        return switch (contentType) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            default -> ".bin";
        };
    }

    private static String truncate(String s, int max) {
        if (s == null) return "";
        return s.length() <= max ? s : s.substring(0, max) + "...";
    }
}
