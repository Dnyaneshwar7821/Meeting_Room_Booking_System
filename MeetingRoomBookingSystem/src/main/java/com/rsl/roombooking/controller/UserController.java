package com.rsl.roombooking.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rsl.roombooking.DTO.LoginDTO;
import com.rsl.roombooking.DTO.LoginResponseDTO;
import com.rsl.roombooking.DTO.SetPasswordDTO;
import com.rsl.roombooking.DTO.UserRequestDTO;
import com.rsl.roombooking.entity.User;
import com.rsl.roombooking.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;

	@PostMapping("/add-user")
	public User addUser(@Valid @RequestBody UserRequestDTO dto, Principal principal) {
		return userService.addUser(dto, principal.getName());
	}

	@GetMapping("/get-all-users")
	public List<User> getAllUsers(Principal principal) {
		return userService.getAllUsersForLoggedInUser(principal.getName());
	}

	@GetMapping("/get-user-by-id/{id}")
	public User getUserById(@PathVariable Long id, Principal principal) {
		return userService.getUserById(id, principal.getName());
	}

	@PutMapping("/update-user-by-id/{id}")
	public User updateUserById(@Valid @RequestBody UserRequestDTO dto, @PathVariable Long id, Principal principal) {

		return userService.updateUserById(dto, id, principal.getName());
	}

	@DeleteMapping("/delete-user/{id}")
	public String deleteUserById(@PathVariable Long id, Principal principal) {

		return userService.deleteUserById(id, principal.getName());
	}

	@PostMapping("/set-password")
	public User setPassword(@Valid @RequestBody SetPasswordDTO dto) {
		return userService.setPassword(dto);
	}

	@PostMapping("/login")
	public LoginResponseDTO login(@Valid @RequestBody LoginDTO dto) {
		return userService.login(dto);
	}

	@PostMapping("/admin-login")
	public LoginResponseDTO adminLogin(@Valid @RequestBody LoginDTO dto) {
		return userService.adminLogin(dto);
	}

	@PostMapping("/employee-login")
	public LoginResponseDTO employeeLogin(@Valid @RequestBody LoginDTO dto) {
		return userService.employeeLogin(dto);
	}

}
