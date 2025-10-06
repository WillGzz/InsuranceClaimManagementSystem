package com.insurance.claims.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
        // @Override
        // public void addViewControllers(ViewControllerRegistry registry) { // Forward
        // non-API routes to Angular's index.html
        // registry.addViewController("/{spring:\\w+}")
        // .setViewName("forward:/index.html");
        // registry.addViewController("/**/{spring:\\w+}") //previous implementation
        // .setViewName("forward:/index.html");
        // registry.addViewController("/{spring:\\w+}/**{spring:?!(\\.js|\\.css)$}")
        // .setViewName("forward:/index.html");
        // }
        @Override     
        public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**") // only your APIs, not static files
                                .allowedOrigins(
                                                "http://localhost:4200",
                                                "https://insurance-claim-management-system1.vercel.app"
                                        
                                )
                                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                                .allowedHeaders("*");
        }
}
