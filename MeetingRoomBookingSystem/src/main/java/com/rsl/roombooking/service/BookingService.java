package com.rsl.roombooking.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.rsl.roombooking.DTO.BookingDTO;
import com.rsl.roombooking.DTO.RoomStatusDTO;
import com.rsl.roombooking.entity.Booking;
import com.rsl.roombooking.entity.MeetingRoom;
import com.rsl.roombooking.entity.User;
import com.rsl.roombooking.exception.InvalidBookingException;
import com.rsl.roombooking.exception.ResourceNotFoundException;
import com.rsl.roombooking.exception.RoomAlreadyBookedException;
import com.rsl.roombooking.repo.BookingRepository;
import com.rsl.roombooking.repo.MeetingRoomRepository;
import com.rsl.roombooking.repo.UserRepository;

import lombok.RequiredArgsConstructor;
import com.rsl.roombooking.enums.BookingStatus;

@Service
@RequiredArgsConstructor
public class BookingService {

	private final UserRepository userRepo;
	private final MeetingRoomRepository meetRepo;
	private final BookingRepository bookingRepo;

	private static final String SYSTEM_ADMIN_EMAIL = "admin@company.com";

	@Value("${app.time-zone}")
	private String appTimeZone;

	@Transactional
	public Booking createBooking(BookingDTO dto, String authenticatedEmail) {

		validateTimeRange(dto);

		User user = userRepo.findByEmail(authenticatedEmail)
				.orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));

		if (!"ADMIN".equals(user.getRole()) && !"EMPLOYEE".equals(user.getRole())) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid role");
		}

		MeetingRoom room = meetRepo.findByIdForUpdate(dto.getRoomId())
				.orElseThrow(() -> new ResourceNotFoundException("Room not found with id " + dto.getRoomId()));

		boolean booked = bookingRepo.isRoomBooked(room.getId(), dto.getBookingDate(), dto.getStartTime(),
				dto.getEndTime());

		if (booked) {
			throw new RoomAlreadyBookedException(
					"Room already has a pending or approved booking for the selected date and time slot");
		}

		Booking booking = new Booking();

		booking.setBookingDate(dto.getBookingDate());
		booking.setStartTime(dto.getStartTime());
		booking.setEndTime(dto.getEndTime());
		booking.setUser(user);
		booking.setRoom(room);
		booking.setStatus(BookingStatus.PENDING);

		return bookingRepo.save(booking);
	}

	// ==========================
	// SYSTEM ADMIN / ADMIN BOOKINGS
	// ==========================

	public List<Booking> getAllBookings(String authenticatedEmail) {

		User loggedInUser = userRepo.findByEmail(authenticatedEmail)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		boolean isSystemAdmin = SYSTEM_ADMIN_EMAIL.equalsIgnoreCase(loggedInUser.getEmail());

		if (isSystemAdmin) {
			return bookingRepo.findAll();
		}

		return bookingRepo.findByUser_CreatedBy(loggedInUser);
	}

	public Booking getBookingById(Long id) {

		return bookingRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Booking not found with id " + id));
	}

	public Booking approveBooking(Long id) {

		Booking booking = bookingRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

		boolean booked = bookingRepo.isRoomBookedExcludingBooking(booking.getId(), booking.getRoom().getId(),
				booking.getBookingDate(), booking.getStartTime(), booking.getEndTime());

		if (booked) {
			throw new RoomAlreadyBookedException("Another booking already exists for the selected room and time slot.");
		}

		booking.setStatus(BookingStatus.APPROVED);

		return bookingRepo.save(booking);
	}

	public Booking rejectBooking(Long id) {

		Booking booking = bookingRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

		booking.setStatus(BookingStatus.REJECTED);

		return bookingRepo.save(booking);
	}

	public String cancelBooking(Long id, String authenticatedEmail) {

		Booking booking = bookingRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Booking not found with id " + id));

		User loggedInUser = userRepo.findByEmail(authenticatedEmail)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		boolean isSystemAdmin = SYSTEM_ADMIN_EMAIL.equalsIgnoreCase(loggedInUser.getEmail());

		// System Admin can cancel any booking
		if (isSystemAdmin) {
			bookingRepo.delete(booking);
			return "Booking Cancelled Successfully";
		}

		// Admin can cancel only bookings of employees created by them
		if ("ADMIN".equals(loggedInUser.getRole())) {

			User employee = booking.getUser();

			if (employee.getCreatedBy() == null || !employee.getCreatedBy().getId().equals(loggedInUser.getId())) {

				throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can cancel only your employees' bookings");
			}

			bookingRepo.delete(booking);
			return "Booking Cancelled Successfully";
		}

		// Employee can cancel only own booking
		if (!booking.getUser().getId().equals(loggedInUser.getId())) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can cancel only your own booking");
		}

		bookingRepo.delete(booking);

		return "Booking Cancelled Successfully";
	}

	public List<Booking> getBookingsByUserId(Long userId) {
		return bookingRepo.findByUser_Id(userId);
	}

	public boolean canAccessUserBookings(Long userId, String authenticatedEmail, boolean admin) {

		if (admin) {
			return true;
		}

		return userRepo.findById(userId).map(user -> user.getEmail().equals(authenticatedEmail)).orElse(false);
	}

	public List<Long> getCurrentlyOccupiedRoomIds() {
		return bookingRepo.findCurrentlyOccupiedRoomIds(currentDate(), currentTime());
	}

	public List<RoomStatusDTO> getTodayRoomStatuses() {

		LocalDate today = currentDate();
		LocalTime now = currentTime();

		Set<Long> inUse = new HashSet<>(bookingRepo.findCurrentlyOccupiedRoomIds(today, now));

		List<RoomStatusDTO> statuses = new ArrayList<>();

		for (Long roomId : inUse) {
			statuses.add(new RoomStatusDTO(roomId, "IN_USE"));
		}

		for (Long roomId : bookingRepo.findReservedLaterTodayRoomIds(today, now)) {

			if (!inUse.contains(roomId)) {
				statuses.add(new RoomStatusDTO(roomId, "RESERVED"));
			}
		}

		return statuses;
	}

	private void validateTimeRange(BookingDTO dto) {

		if (!dto.getStartTime().isBefore(dto.getEndTime())) {
			throw new InvalidBookingException("Start time must be before end time");
		}

		if (dto.getBookingDate().isBefore(currentDate())) {
			throw new InvalidBookingException("Booking date cannot be in the past");
		}

		if (dto.getBookingDate().isEqual(currentDate()) && !dto.getStartTime().isAfter(currentTime())) {

			throw new InvalidBookingException("Cannot book a time slot that has already started");
		}
	}

	private LocalDate currentDate() {
		return LocalDate.now(ZoneId.of(appTimeZone));
	}

	private LocalTime currentTime() {
		return LocalTime.now(ZoneId.of(appTimeZone));
	}
}
