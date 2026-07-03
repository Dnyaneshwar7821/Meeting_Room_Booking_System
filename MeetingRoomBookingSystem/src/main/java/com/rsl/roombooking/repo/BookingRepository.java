package com.rsl.roombooking.repo;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.rsl.roombooking.entity.Booking;
import com.rsl.roombooking.entity.User;
import com.rsl.roombooking.enums.BookingStatus;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

	@Query("""
			SELECT COUNT(b) > 0
			FROM Booking b
			WHERE b.room.id = :roomId
			AND b.bookingDate = :bookingDate
			AND :startTime < b.endTime
			AND :endTime > b.startTime
			AND b.status IN ('PENDING','APPROVED')
			""")
	boolean isRoomBooked(@Param("roomId") Long roomId, @Param("bookingDate") LocalDate bookingDate,
			@Param("startTime") LocalTime startTime, @Param("endTime") LocalTime endTime);

	@Query("""
			SELECT COUNT(b) > 0
			FROM Booking b
			WHERE b.id <> :bookingId
			AND b.room.id = :roomId
			AND b.bookingDate = :bookingDate
			AND :startTime < b.endTime
			AND :endTime > b.startTime
			AND b.status IN ('PENDING','APPROVED')
			""")
	boolean isRoomBookedExcludingBooking(@Param("bookingId") Long bookingId, @Param("roomId") Long roomId,
			@Param("bookingDate") LocalDate bookingDate, @Param("startTime") LocalTime startTime,
			@Param("endTime") LocalTime endTime);

	@Query("""
			SELECT DISTINCT b.room.id
			FROM Booking b
			WHERE b.bookingDate = :today
			AND b.startTime <= :now
			AND b.endTime > :now
			AND b.status = 'APPROVED'
			""")
	List<Long> findCurrentlyOccupiedRoomIds(@Param("today") LocalDate today, @Param("now") LocalTime now);

	@Query("""
			SELECT DISTINCT b.room.id
			FROM Booking b
			WHERE b.bookingDate = :today
			AND b.startTime > :now
			AND b.status = 'APPROVED'
			""")
	List<Long> findReservedLaterTodayRoomIds(@Param("today") LocalDate today, @Param("now") LocalTime now);

	List<Booking> findByUser_Id(Long userId);

	List<Booking> findByUser_CreatedBy(User admin);

	List<Booking> findByStatus(BookingStatus status);

	List<Booking> findByUser_CreatedByAndStatus(User admin, BookingStatus status);

	boolean existsByRoom_Id(Long roomId);

	boolean existsByUser_Id(Long userId);

}