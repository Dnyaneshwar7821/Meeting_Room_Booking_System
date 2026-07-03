package com.rsl.roombooking.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoomStatusDTO {

	private Long roomId;
	private String status;

}
