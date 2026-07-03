package com.rsl.roombooking.entity;

import java.time.LocalDate;
import java.time.LocalTime;

import com.rsl.roombooking.enums.BookingStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Table(name = "Bookings")
@Data
public class Booking {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull(message = "Booking Date is Required")
	@FutureOrPresent(message = "Booking Date Cannot be in the Past")
	private LocalDate bookingDate;

	@NotNull(message = "Start Time is Required")
	private LocalTime startTime;

	@NotNull(message = "End Time is Required")
	private LocalTime endTime;

	@Enumerated(EnumType.STRING)
	private BookingStatus status;

	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;

	@ManyToOne
	@JoinColumn(name = "room_id")
	private MeetingRoom room;

	@PrePersist
	public void setDefaultStatus() {
		if (status == null) {
			status = BookingStatus.PENDING;
		}
	}
}