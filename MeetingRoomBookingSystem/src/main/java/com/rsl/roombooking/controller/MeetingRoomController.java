package com.rsl.roombooking.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rsl.roombooking.entity.MeetingRoom;
import com.rsl.roombooking.service.MeetingRoomService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/rooms")
public class MeetingRoomController {

	@Autowired
	private MeetingRoomService roomService;

	@PostMapping("/add-room")
	public MeetingRoom addRoom(@Valid @RequestBody MeetingRoom room) {
		return roomService.addRoom(room);
	}

	@GetMapping("/get-all-rooms")
	public List<MeetingRoom> getAllRooms() {
		return roomService.getAllRooms();
	}

	@GetMapping("/get-room-by-id/{id}")
	public MeetingRoom getRoomById(@PathVariable Long id) {
		return roomService.getRoomById(id);
	}

	@PutMapping("/update-room-by-id/{id}")
	public MeetingRoom updateRoomById(@PathVariable Long id, @Valid @RequestBody MeetingRoom room) {
		return roomService.updateRoomById(id, room);
	}

	@DeleteMapping("/delete-room-by-id/{id}")
	public String deleteRoomById(@PathVariable Long id) {
		return roomService.deleteRoomById(id);
	}

}
