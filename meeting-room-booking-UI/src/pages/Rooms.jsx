import { useCallback, useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../utils/errors";
import {
  ROOM_STATUS,
  buildStatusMap,
  getRoomStatus,
  getRowClassName,
  getStatusLabel,
} from "../utils/roomStatus";
import Swal from "sweetalert2";
import { showSuccess, showError } from "../utils/toast";
import { SearchBar, Pagination, Badge, Button, EditIcon, DeleteIcon } from "../components/ui";

const STATUS_REFRESH_MS = 30000;

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const [statusMap, setStatusMap] = useState({});

  const [room, setRoom] = useState({
    roomName: "",
    capacity: "",
    location: "",
  });

  const [editId, setEditId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const fetchRoomStatuses = useCallback(() => {
    API.get("/bookings/room-status")
      .then((response) => {
        setStatusMap(buildStatusMap(response.data));
      })
      .catch((err) => {
        showError(getErrorMessage(err));
      });
  }, []);

  useEffect(() => {
    fetchRooms();
    fetchRoomStatuses();

    const intervalId = setInterval(fetchRoomStatuses, STATUS_REFRESH_MS);
    return () => clearInterval(intervalId);
  }, [fetchRoomStatuses]);

  function fetchRooms() {
    API.get("/rooms/get-all-rooms")
      .then((response) => {
        setRooms(response.data);
      })
      .catch((err) => {
        showError(getErrorMessage(err));
      });
  }

  const handleChange = (e) => {
    setRoom({
      ...room,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      updateRoom();
    } else {
      addRoom();
    }
  };

  const addRoom = () => {
    API.post("/rooms/add-room", {
      ...room,
      capacity: Number(room.capacity),
    })
      .then(() => {
        fetchRooms();
        setRoom({ roomName: "", capacity: "", location: "" });

        showSuccess("Room added successfully");
      })
      .catch((err) => {
        showError(getErrorMessage(err));
      });
  };

  const updateRoom = () => {
    API.put(`/rooms/update-room-by-id/${editId}`, {
      ...room,
      capacity: Number(room.capacity),
    })
      .then(() => {
        fetchRooms();
        setEditId(null);
        setRoom({ roomName: "", capacity: "", location: "" });

        showSuccess("Room updated successfully");
      })
      .catch((err) => {
        showError(getErrorMessage(err));
      });
  };

  const editRoom = (selectedRoom) => {
    setEditId(selectedRoom.id);
    setRoom({
      roomName: selectedRoom.roomName,
      capacity: selectedRoom.capacity,
      location: selectedRoom.location,
    });
  };

  const deleteRoom = async (id) => {
    const result = await Swal.fire({
      title: "Delete Room?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) {
      return;
    }

    API.delete(`/rooms/delete-room-by-id/${id}`)
      .then(() => {
        fetchRooms();
        fetchRoomStatuses();

        showSuccess("Room deleted successfully");
      })
      .catch((err) => {
        showError(getErrorMessage(err));
      });
  };

  const filteredRooms = rooms.filter((room) =>
    `${room.roomName} ${room.location} ${room.capacity}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;

  const currentRecords = filteredRooms.slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(filteredRooms.length / recordsPerPage);

  return (
    <main className="portal-page">
      <div className="portal-container">
        <div className="portal-heading">
          <p className="portal-kicker">
            {user?.role === "EMPLOYEE"
              ? "Room Directory"
              : user?.systemAdmin
                ? "System Admin Workspace"
                : "Admin Workspace"}
          </p>

          <h1 className="portal-title">
            {user?.role === "EMPLOYEE"
              ? "Available Meeting Rooms"
              : "Meeting Room Management"}
          </h1>

          <p className="portal-subtitle">
            {user?.role === "EMPLOYEE"
              ? "Booked rooms are dimmed. In-use rooms cannot be booked right now."
              : "Live room status updates every 30 seconds."}
          </p>
        </div>

        {user?.role === "ADMIN" && (
          <div className="portal-panel mb-8 p-6 sm:p-8">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Room Name
                </label>
                <input
                  type="text"
                  name="roomName"
                  placeholder="Enter room name"
                  value={room.roomName}
                  onChange={handleChange}
                  className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3.5 text-gray-900 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 hover:border-gray-300 hover:shadow-md"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  placeholder="Enter capacity"
                  min="1"
                  value={room.capacity}
                  onChange={handleChange}
                  className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3.5 text-gray-900 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 hover:border-gray-300 hover:shadow-md"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="Enter location"
                  value={room.location}
                  onChange={handleChange}
                  className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3.5 text-gray-900 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 hover:border-gray-300 hover:shadow-md"
                  required
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3.5 font-bold text-white shadow-xl shadow-blue-600/30 transition-all duration-300 hover:from-blue-700 hover:to-violet-700 hover:shadow-2xl hover:-translate-y-0.5"
                >
                  {editId ? "Update Room" : "Add Room"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <SearchBar
            placeholder="Search rooms..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:max-w-sm"
          />
        </div>

        <div className="portal-panel overflow-x-auto">
          <table className="portal-table">
            <thead>
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Room Name</th>
                <th className="p-4">Capacity</th>
                <th className="p-4">Location</th>
                <th className="p-4">Status</th>
                {user?.role === "EMPLOYEE" && <th className="p-4">Book</th>}
                {user?.role === "ADMIN" && (
                  <>
                    <th className="p-4">Edit</th>
                    <th className="p-4">Delete</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody>
              {currentRecords.map((roomItem, index) => {
                const status = getRoomStatus(roomItem.id, statusMap);
                const isInUse = status === ROOM_STATUS.IN_USE;

                return (
                  <tr
                    key={roomItem.id}
                    className={`transition-all duration-300 ${getRowClassName(status)}`}
                  >
                    <td className="p-4 text-center">
                      {firstIndex + index + 1}
                    </td>

                    <td className="p-4 text-center font-medium">
                      {roomItem.roomName}
                    </td>

                    <td className="p-4 text-center">{roomItem.capacity}</td>

                    <td className="p-4 text-center">{roomItem.location}</td>

                    <td className="p-4 text-center">
                      <Badge
                        variant={
                          status === ROOM_STATUS.AVAILABLE
                            ? "available"
                            : status === ROOM_STATUS.RESERVED
                              ? "reserved"
                              : "inUse"
                        }
                        size="md"
                      >
                        {getStatusLabel(status)}
                      </Badge>
                    </td>

                    {user?.role === "EMPLOYEE" && (
                      <td className="p-4 text-center">
                        <Button
                          variant={isInUse ? "ghost" : "primary"}
                          size="sm"
                          onClick={() => navigate(`/book-room/${roomItem.id}`)}
                          disabled={isInUse}
                          title={
                            isInUse
                              ? "Room is in a meeting right now"
                              : "Book this room"
                          }
                        >
                          {isInUse ? "Unavailable" : "Book Room"}
                        </Button>
                      </td>
                    )}

                    {user?.role !== "EMPLOYEE" && (
                      <>
                        <td className="p-4 text-center">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => editRoom(roomItem)}
                            leftIcon={<EditIcon className="h-4 w-4" />}
                          >
                            Edit
                          </Button>
                        </td>

                        <td className="p-4 text-center">
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => deleteRoom(roomItem.id)}
                            leftIcon={<DeleteIcon className="h-4 w-4" />}
                          >
                            Delete
                          </Button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}

              {filteredRooms.length === 0 && (
                <tr>
                  <td
                    colSpan={user?.role === "EMPLOYEE" ? 6 : 7}
                    className="p-12 text-center"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <p className="text-lg font-semibold text-slate-900">No rooms found</p>
                      <p className="text-sm text-slate-500">Try adjusting your search or add new rooms</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages || 1}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Rooms;
