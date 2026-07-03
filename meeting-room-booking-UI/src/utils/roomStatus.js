export const ROOM_STATUS = {
  AVAILABLE: "AVAILABLE",
  IN_USE: "IN_USE",
  RESERVED: "RESERVED",
};

export function buildStatusMap(statusList) {
  const map = {};
  for (const item of statusList) {
    map[item.roomId] = item.status;
  }
  return map;
}

export function getRoomStatus(roomId, statusMap) {
  return statusMap[roomId] || ROOM_STATUS.AVAILABLE;
}

export function getStatusLabel(status) {
  if (status === ROOM_STATUS.IN_USE) {
    return "Booked - In Use";
  }
  if (status === ROOM_STATUS.RESERVED) {
    return "Reserved Today";
  }
  return "Available";
}

export function getRowClassName(status) {
  if (status === ROOM_STATUS.IN_USE) {
    return "bg-red-50/80 opacity-65 blur-[0.5px]";
  }
  if (status === ROOM_STATUS.RESERVED) {
    return "bg-amber-50/60 opacity-90";
  }
  return "";
}

export function getBadgeClassName(status) {
  if (status === ROOM_STATUS.IN_USE) {
    return "rounded-full bg-red-100 px-3 py-1 font-semibold text-red-700";
  }
  if (status === ROOM_STATUS.RESERVED) {
    return "rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-700";
  }
  return "rounded-full bg-green-100 px-3 py-1 font-semibold text-green-600";
}
