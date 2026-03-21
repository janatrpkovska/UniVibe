package com.univibe.backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "supabase")
public class SupabaseProperties {

    /**
     * Project URL, e.g. https://abcdefgh.supabase.co (no trailing slash).
     */
    private String url = "";

    /**
     * Service role key — server-side only; never expose to the browser.
     */
    private String serviceRoleKey = "";

    /**
     * Storage bucket name (must exist in Supabase; can be public for direct image URLs).
     */
    private String storageBucket = "event-images";
}
