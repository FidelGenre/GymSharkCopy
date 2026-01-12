package org.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. Configuración de CORS (Permite que React se comunique)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // 2. Deshabilitamos CSRF (Necesario para APIs REST stateless)
            .csrf(csrf -> csrf.disable())
            
            // 3. Configuración de rutas
            .authorizeHttpRequests(auth -> auth
                // Permitimos acceso público (sin login) a estas rutas:
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/products/**").permitAll()
                .requestMatchers("/api/payments/**").permitAll() 
                .requestMatchers("/api/orders/**").permitAll()
                
                // Cualquier otra ruta requiere estar autenticado (token o sesión)
                .anyRequest().authenticated()
            );

        return http.build();
    }

    // Bean para configurar CORS globalmente
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // PERMITIR TODO (Ideal para desarrollo/pruebas)
        // En producción cambiar "*" por la URL de tu frontend (ej: https://tudominio.com)
        configuration.setAllowedOrigins(List.of("*")); 
        
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}