package com.Placify.Config;

import com.Placify.Service.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.core.GrantedAuthorityDefaults;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    // REMOVE default "ROLE_" prefix
    @Bean
    GrantedAuthorityDefaults grantedAuthorityDefaults() {
        return new GrantedAuthorityDefaults("");
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // PUBLIC routes
                        .requestMatchers("/", "/auth/**", "/login", "/signup").permitAll()

                        // Quiz & assessment (mixed: some need auth, quiz-attempt/check needs auth via header)
                        .requestMatchers("/quiz/**").permitAll()
                        .requestMatchers("/quiz-attempt/all", "/quiz-attempt/quiz/**").hasAuthority("ADMIN")
                        .requestMatchers("/quiz-attempt/**").permitAll()

                        // Public data
                        .requestMatchers("/company/**").permitAll()
                        .requestMatchers("/subject/**").permitAll()
                        .requestMatchers("/resource/**").permitAll()
                        .requestMatchers("/question/**").permitAll()
                        .requestMatchers("/feedback/**").permitAll()

                        // Compiler & coding
                        .requestMatchers("/api/compiler/**").permitAll()
                        .requestMatchers("/api/coding/**").permitAll()
                        .requestMatchers("/api/files/**").permitAll()

                        // Dashboard (needs auth)
                        .requestMatchers("/dashboard/**").authenticated()

                        // ADMIN only
                        .requestMatchers("/admin/**").hasAuthority("ADMIN")
                        .requestMatchers("/api/admin/**").hasAuthority("ADMIN")

                        // Everything else requires authentication
                        .anyRequest().authenticated()
                );

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
