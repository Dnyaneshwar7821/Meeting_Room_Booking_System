package com.rsl.roombooking.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.rsl.roombooking.entity.MeetingRoom;
import com.rsl.roombooking.exception.ResourceNotFoundException;
import com.rsl.roombooking.repo.BookingRepository;
import com.rsl.roombooking.repo.MeetingRoomRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MeetingRoomService {

	private final MeetingRoomRepository meetRepo;
	private final BookingRepository bookingRepo;

	public MeetingRoom addRoom(MeetingRoom room) {
		return meetRepo.save(room);
	}

	public List<MeetingRoom> getAllRooms() {
		return meetRepo.findAll();
	}

	public MeetingRoom getRoomById(Long id) {
		return meetRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Room not found with id " + id));
	}

	public MeetingRoom updateRoomById(Long id, MeetingRoom room) {
		MeetingRoom existing = meetRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Room not found with id " + id));

		existing.setRoomName(room.getRoomName());
		existing.setCapacity(room.getCapacity());
		existing.setLocation(room.getLocation());

		return meetRepo.save(existing);
	}

	public String deleteRoomById(Long id) {
		MeetingRoom room = meetRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Room not found with id " + id));

		if (bookingRepo.existsByRoom_Id(id)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT,
					"Cannot delete room with existing bookings. Cancel bookings first.");
		}

		meetRepo.delete(room);

		return "Room Deleted Successfully";
	}

}
