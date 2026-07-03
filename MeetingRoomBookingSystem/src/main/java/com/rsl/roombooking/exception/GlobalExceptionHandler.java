package com.rsl.roombooking.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(InvalidBookingException.class)
	public ResponseEntity<Map<String, String>> handleInvalidBookingException(InvalidBookingException ex) {
		Map<String, String> response = new HashMap<>();
		response.put("status", HttpStatus.BAD_REQUEST.toString());
		response.put("message", ex.getMessage());
		return ResponseEntity.badRequest().body(response);
	}

	@ExceptionHandler(RoomAlreadyBookedException.class)
	public ResponseEntity<Map<String, String>> handleRoomAlreadyBookedException(RoomAlreadyBookedException ex) {

		Map<String, String> response = new HashMap<>();

		response.put("status", HttpStatus.CONFLICT.toString());
		response.put("message", ex.getMessage());

		return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
	}

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<Map<String, String>> handleResourceNotFoundException(ResourceNotFoundException ex) {

		Map<String, String> response = new HashMap<>();

		response.put("status", HttpStatus.NOT_FOUND.toString());
		response.put("message", ex.getMessage());

		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, String>> handleValidationException(MethodArgumentNotValidException ex) {

		Map<String, String> errors = new HashMap<>();

		ex.getBindingResult().getFieldErrors().forEach(error -> {
			errors.put(error.getField(), error.getDefaultMessage());
		});

		return ResponseEntity.badRequest().body(errors);
	}

	@ExceptionHandler(ResponseStatusException.class)
	public ResponseEntity<Map<String, String>> handleResponseStatusException(ResponseStatusException ex) {
		Map<String, String> response = new HashMap<>();
		response.put("status", ex.getStatusCode().toString());
		response.put("message", ex.getReason());
		return ResponseEntity.status(ex.getStatusCode()).body(response);
	}

	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<Map<String, String>> handleAccessDeniedException(AccessDeniedException ex) {
		Map<String, String> response = new HashMap<>();
		response.put("status", HttpStatus.FORBIDDEN.toString());
		response.put("message", ex.getMessage());
		return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
	}
}
