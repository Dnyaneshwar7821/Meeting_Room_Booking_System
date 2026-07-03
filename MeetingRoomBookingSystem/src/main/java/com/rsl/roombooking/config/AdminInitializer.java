package com.rsl.roombooking.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.rsl.roombooking.entity.User;
import com.rsl.roombooking.repo.UserRepository;

@Component
public class AdminInitializer implements CommandLineRunner {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final String adminName;
	private final String adminEmail;
	private final String adminPassword;

	public AdminInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder,
			@Value("${app.admin.name}") String adminName, @Value("${app.admin.email}") String adminEmail,
			@Value("${app.admin.password}") String adminPassword) {

		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.adminName = adminName;
		this.adminEmail = adminEmail;
		this.adminPassword = adminPassword;
	}

	@Override
	public void run(String... args) {

		User existingAdmin = userRepository.findByEmail(adminEmail).orElse(null);

		if (existingAdmin != null) {

			if (existingAdmin.getPassword() == null || existingAdmin.getPassword().isBlank()) {

				existingAdmin.setPassword(passwordEncoder.encode(adminPassword));

				userRepository.save(existingAdmin);
			}

			return;
		}

		User admin = new User();
		admin.setName(adminName);
		admin.setEmail(adminEmail);
		admin.setPassword(passwordEncoder.encode(adminPassword));
		admin.setRole("ADMIN");

		userRepository.save(admin);

		System.out.println("System Admin Initialized Successfully");
	}

}
