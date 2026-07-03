package com.rsl.roombooking.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.rsl.roombooking.DTO.BookingDTO;
import com.rsl.roombooking.entity.MeetingRoom;
import com.rsl.roombooking.entity.User;
import com.rsl.roombooking.exception.InvalidBookingException;
import com.rsl.roombooking.exception.RoomAlreadyBookedException;
import com.rsl.roombooking.repo.BookingRepository;
import com.rsl.roombooking.repo.MeetingRoomRepository;
import com.rsl.roombooking.repo.UserRepository;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

	@Mock
	private UserRepository userRepo;

	@Mock
	private MeetingRoomRepository meetRepo;

	@Mock
	private BookingRepository bookingRepo;

	@InjectMocks
	private BookingService bookingService;

	@Test
	void createBooking_rejectsWhenStartTimeIsNotBeforeEndTime() {
		BookingDTO dto = new BookingDTO();
		dto.setBookingDate(LocalDate.now().plusDays(1));
		dto.setStartTime(LocalTime.of(15, 0));
		dto.setEndTime(LocalTime.of(14, 0));
		dto.setRoomId(1L);

		assertThrows(InvalidBookingException.class,
				() -> bookingService.createBooking(dto, "employee@company.com"));
	}

	@Test
	void createBooking_rejectsWhenRoomAlreadyBooked() {
		BookingDTO dto = new BookingDTO();
		dto.setBookingDate(LocalDate.now().plusDays(1));
		dto.setStartTime(LocalTime.of(10, 0));
		dto.setEndTime(LocalTime.of(11, 0));
		dto.setRoomId(1L);

		User user = new User();
		user.setEmail("employee@company.com");

		MeetingRoom room = new MeetingRoom();
		room.setId(1L);

		when(userRepo.findByEmail("employee@company.com")).thenReturn(Optional.of(user));
		when(meetRepo.findByIdForUpdate(1L)).thenReturn(Optional.of(room));
		when(bookingRepo.isRoomBooked(eq(1L), eq(dto.getBookingDate()), eq(dto.getStartTime()), eq(dto.getEndTime())))
				.thenReturn(true);

		assertThrows(RoomAlreadyBookedException.class,
				() -> bookingService.createBooking(dto, "employee@company.com"));
	}

	@Test
	void createBooking_savesWhenSlotIsAvailable() {
		BookingDTO dto = new BookingDTO();
		dto.setBookingDate(LocalDate.now().plusDays(1));
		dto.setStartTime(LocalTime.of(10, 0));
		dto.setEndTime(LocalTime.of(11, 0));
		dto.setRoomId(1L);

		User user = new User();
		user.setEmail("employee@company.com");

		MeetingRoom room = new MeetingRoom();
		room.setId(1L);

		when(userRepo.findByEmail("employee@company.com")).thenReturn(Optional.of(user));
		when(meetRepo.findByIdForUpdate(1L)).thenReturn(Optional.of(room));
		when(bookingRepo.isRoomBooked(eq(1L), eq(dto.getBookingDate()), eq(dto.getStartTime()), eq(dto.getEndTime())))
				.thenReturn(false);
		when(bookingRepo.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

		var booking = bookingService.createBooking(dto, "employee@company.com");

		assertEquals(dto.getBookingDate(), booking.getBookingDate());
		assertEquals(user, booking.getUser());
		assertEquals(room, booking.getRoom());
		verify(bookingRepo).save(any());
	}

}
