package com.rsl.roombooking.DTO;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingDTO {

	@NotNull(message = "Date is Required")
	@FutureOrPresent(message = "Booking date should not be in the past")
	private LocalDate bookingDate;

	@NotNull(message = "Start Time is Required")
	private LocalTime startTime;

	@NotNull(message = "End Time is Required")
	private LocalTime endTime;

	@NotNull(message = "Room Id is Required")
	private Long roomId;

}
