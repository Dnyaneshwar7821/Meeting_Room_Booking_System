package com.rsl.roombooking.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.rsl.roombooking.DTO.LoginDTO;
import com.rsl.roombooking.DTO.LoginResponseDTO;
import com.rsl.roombooking.DTO.SetPasswordDTO;
import com.rsl.roombooking.DTO.UserRequestDTO;
import com.rsl.roombooking.entity.User;
import com.rsl.roombooking.exception.ResourceNotFoundException;
import com.rsl.roombooking.repo.BookingRepository;
import com.rsl.roombooking.repo.UserRepository;
import com.rsl.roombooking.security.CustomUserDetailsService;
import com.rsl.roombooking.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepo;
	private final BookingRepository bookingRepo;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final CustomUserDetailsService userDetailsService;

	private static final String SYSTEM_ADMIN_EMAIL = "admin@company.com";

	public User addUser(UserRequestDTO dto, String loggedInEmail) {

		User loggedInUser = userRepo.findByEmail(loggedInEmail)
				.orElseThrow(() -> new ResourceNotFoundException("Logged in user not found"));

		if (userRepo.findByEmail(dto.getEmail()).isPresent()) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
		}

		if (!"ADMIN".equals(dto.getRole()) && !"EMPLOYEE".equals(dto.getRole())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role must be ADMIN or EMPLOYEE");
		}

		boolean isSystemAdmin = SYSTEM_ADMIN_EMAIL.equalsIgnoreCase(loggedInUser.getEmail());

		if (!isSystemAdmin && "ADMIN".equals(dto.getRole())) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only System Admin can create Admins");
		}

		User user = new User();

		user.setName(dto.getName());
		user.setEmail(dto.getEmail());
		user.setRole(dto.getRole());
		user.setPassword(null);

		if (!isSystemAdmin) {
			user.setCreatedBy(loggedInUser);
		}

		return userRepo.save(user);
	}

	public List<User> getAllUsers() {
		return userRepo.findAll();
	}

	public List<User> getAllUsersExcludingSystemAdmin() {
		return userRepo.findAll().stream().filter(u -> !SYSTEM_ADMIN_EMAIL.equalsIgnoreCase(u.getEmail())).toList();
	}

	public User getUserById(Long id, String loggedInEmail) {

		User loggedInUser = userRepo.findByEmail(loggedInEmail)
				.orElseThrow(() -> new ResourceNotFoundException("Logged in user not found"));

		User targetUser = userRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));

		boolean isSystemAdmin = SYSTEM_ADMIN_EMAIL.equalsIgnoreCase(loggedInUser.getEmail());

		if (isSystemAdmin) {
			return targetUser;
		}

		if (targetUser.getCreatedBy() == null || !targetUser.getCreatedBy().getId().equals(loggedInUser.getId())) {

			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can access only your employees");
		}

		return targetUser;
	}

	public User updateUserById(UserRequestDTO dto, Long id, String loggedInEmail) {

		User loggedInUser = userRepo.findByEmail(loggedInEmail)
				.orElseThrow(() -> new ResourceNotFoundException("Logged in user not found"));

		User existing = userRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));

		boolean isSystemAdmin = SYSTEM_ADMIN_EMAIL.equalsIgnoreCase(loggedInUser.getEmail());

		if (SYSTEM_ADMIN_EMAIL.equalsIgnoreCase(existing.getEmail())) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "System Admin cannot be modified");
		}

		if (!isSystemAdmin) {

			if (existing.getCreatedBy() == null || !existing.getCreatedBy().getId().equals(loggedInUser.getId())) {

				throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can update only your employees");
			}
		}

		if (!existing.getEmail().equals(dto.getEmail()) && userRepo.findByEmail(dto.getEmail()).isPresent()) {

			throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
		}

		existing.setName(dto.getName());
		existing.setEmail(dto.getEmail());
		existing.setRole(dto.getRole());

		return userRepo.save(existing);
	}

	public String deleteUserById(Long id, String loggedInEmail) {

		User loggedInUser = userRepo.findByEmail(loggedInEmail)
				.orElseThrow(() -> new ResourceNotFoundException("Logged in user not found"));

		User user = userRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));

		boolean isSystemAdmin = SYSTEM_ADMIN_EMAIL.equalsIgnoreCase(loggedInUser.getEmail());

		if (SYSTEM_ADMIN_EMAIL.equalsIgnoreCase(user.getEmail())) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "System Admin cannot be deleted");
		}

		if (!isSystemAdmin) {

			if (user.getCreatedBy() == null || !user.getCreatedBy().getId().equals(loggedInUser.getId())) {

				throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can delete only your employees");
			}
		}

		if (bookingRepo.existsByUser_Id(id)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Cannot delete user with existing bookings");
		}

		userRepo.delete(user);

		return "User Deleted Successfully";
	}

	public User setPassword(SetPasswordDTO dto) {

		User user = userRepo.findByEmail(dto.getEmail())
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		if (user.getPassword() != null && !user.getPassword().isBlank()) {

			throw new ResponseStatusException(HttpStatus.CONFLICT, "Password is already created");
		}

		user.setPassword(passwordEncoder.encode(dto.getPassword()));

		return userRepo.save(user);
	}

	public LoginResponseDTO login(LoginDTO dto) {
		return authenticateUser(dto, null);
	}

	public LoginResponseDTO adminLogin(LoginDTO dto) {
		return authenticateUser(dto, "ADMIN");
	}

	public LoginResponseDTO employeeLogin(LoginDTO dto) {
		return authenticateUser(dto, "EMPLOYEE");
	}

	private LoginResponseDTO authenticateUser(LoginDTO dto, String expectedRole) {

		User user = userRepo.findByEmail(dto.getEmail())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

		if (user.getPassword() == null || user.getPassword().isBlank()) {

			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please set password first");
		}

		if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {

			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
		}

		if (expectedRole != null && !expectedRole.equals(user.getRole())) {

			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
		}

		var userDetails = userDetailsService.loadUserByUsername(user.getEmail());

		String token = jwtService.generateToken(userDetails);

		boolean isSystemAdmin = SYSTEM_ADMIN_EMAIL.equalsIgnoreCase(user.getEmail());

		return new LoginResponseDTO(user.getId(), user.getName(), user.getEmail(), user.getRole(), token,
				isSystemAdmin);
	}

	public List<User> getAllUsersForLoggedInUser(String email) {

		User loggedInUser = userRepo.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		boolean isSystemAdmin = SYSTEM_ADMIN_EMAIL.equalsIgnoreCase(loggedInUser.getEmail());

		if (isSystemAdmin) {

			return userRepo.findAll().stream().filter(u -> !SYSTEM_ADMIN_EMAIL.equalsIgnoreCase(u.getEmail())).toList();
		}

		return userRepo.findByCreatedBy(loggedInUser);
	}
}