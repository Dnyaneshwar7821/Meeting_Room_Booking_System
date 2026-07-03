package com.rsl.roombooking.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.rsl.roombooking.security.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {

	@Value("${cors.allowed-origins}")
	private String allowedOrigin;

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtFilter) throws Exception {

		return http.csrf(csrf -> csrf.disable()).cors(cors -> cors.configurationSource(corsConfigurationSource()))
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

				.authorizeHttpRequests(auth -> auth

						.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

						.requestMatchers("/users/login", "/users/admin-login", "/users/employee-login",
								"/users/set-password")
						.permitAll()

						.requestMatchers(HttpMethod.POST, "/users/add-user", "/rooms/add-room").hasRole("ADMIN")

						.requestMatchers(HttpMethod.PUT, "/users/**", "/rooms/**").hasRole("ADMIN")

						.requestMatchers(HttpMethod.DELETE, "/users/**", "/rooms/**").hasRole("ADMIN")

						.requestMatchers(HttpMethod.GET, "/users/get-all-users", "/users/get-user-by-id/**",
								"/users/employees", "/bookings/get-all-bookings", "/bookings/get-booking-by-id/**")
						.hasRole("ADMIN")

						.requestMatchers(HttpMethod.POST, "/bookings/create-booking").hasAnyRole("ADMIN", "EMPLOYEE")

						.anyRequest().authenticated())

				.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)

				.build();
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	CorsConfigurationSource corsConfigurationSource() {

		CorsConfiguration configuration = new CorsConfiguration();

		configuration.setAllowedOrigins(List.of(allowedOrigin));
		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

		source.registerCorsConfiguration("/**", configuration);

		return source;
	}

}
