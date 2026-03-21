package com.univibe.backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "supabase")
public class SupabaseProperties {

    private String url = "";

    private String serviceRoleKey = "";

    private String storageBucket = "event-images";
}
