package org.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

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
            // 1. Habilitamos CORS para que use la configuración de tu WebConfig
            // Esto permite las peticiones desde tu dominio gymshark.com.ar
            .cors(Customizer.withDefaults())
            
            // 2. Deshabilitamos CSRF (necesario para que funcionen los POST desde React)
            .csrf(csrf -> csrf.disable())
            
            // 3. Configuramos los permisos de las rutas
            .authorizeHttpRequests(auth -> auth
                // Permitimos acceso público a autenticación y productos
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/products/**").permitAll()
                
                // IMPORTANTE: Permitir el endpoint de Mercado Pago y órdenes
                .requestMatchers("/api/payments/**").permitAll() 
                .requestMatchers("/api/orders/**").permitAll()
                
                // Cualquier otra ruta requiere estar logueado
                .anyRequest().authenticated()
            );

        return http.build();
    }
}