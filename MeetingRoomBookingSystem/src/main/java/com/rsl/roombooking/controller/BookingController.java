package com.rsl.roombooking.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;

import com.rsl.roombooking.DTO.BookingDTO;
import com.rsl.roombooking.DTO.RoomStatusDTO;
import com.rsl.roombooking.entity.Booking;
import com.rsl.roombooking.service.BookingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/bookings")
public class BookingController {

	@Autowired
	private BookingService bookService;

	@PostMapping("/create-booking")
	public Booking createBooking(@Valid @RequestBody BookingDTO dto, Authentication authentication) {
		return bookService.createBooking(dto, authentication.getName());
	}

	@GetMapping("/get-all-bookings")
	public List<Booking> getAllBookings(Authentication authentication) {
		return bookService.getAllBookings(authentication.getName());
	}

	@GetMapping("/get-booking-by-id/{id}")
	public Booking getBookingById(@PathVariable Long id) {
		return bookService.getBookingById(id);
	}
	
	@PutMapping("/approve-booking/{id}")
	public Booking approveBooking(@PathVariable Long id) {
		return bookService.approveBooking(id);
	}

	@PutMapping("/reject-booking/{id}")
	public Booking rejectBooking(@PathVariable Long id) {
		return bookService.rejectBooking(id);
	}

	@DeleteMapping("/cancel-booking/{id}")
	public String cancelBooking(@PathVariable Long id, Authentication authentication) {
		return bookService.cancelBooking(id, authentication.getName());
	}

	@GetMapping("/user/{userId}")
	public List<Booking> getBookingsByUserId(@PathVariable Long userId, Authentication authentication) {
		if (!bookService.canAccessUserBookings(userId, authentication.getName(), isAdmin(authentication))) {
			throw new AccessDeniedException("You can view only your own bookings");
		}

		return bookService.getBookingsByUserId(userId);
	}

	@GetMapping("/booked-rooms")
	public List<Long> getCurrentlyOccupiedRoomIds() {
		return bookService.getCurrentlyOccupiedRoomIds();
	}

	@GetMapping("/room-status")
	public List<RoomStatusDTO> getTodayRoomStatuses() {
		return bookService.getTodayRoomStatuses();
	}

	private boolean isAdmin(Authentication authentication) {
		return authentication.getAuthorities().stream()
				.anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
	}

}
