import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import API from "../services/api";
import {
  ROOM_STATUS,
  buildStatusMap,
  getRoomStatus,
} from "../utils/roomStatus";
import { Card } from "../components/ui";

const COLORS = ["#eab308", "#22c55e", "#ef4444"];
const ROOM_COLORS = ["#3b82f6", "#f59e0b", "#ef4444"];

const EmployeeDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [summary, setSummary] = useState({
    availableRooms: 0,
    inUseRooms: 0,
    reservedRooms: 0,
    myBookings: 0,
  });
  const [bookingStatusData, setBookingStatusData] = useState([]);
  const [roomStatusData, setRoomStatusData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      API.get("/rooms/get-all-rooms"),
      API.get("/bookings/room-status"),
      API.get(`/bookings/user/${user.id}`),
    ])
      .then(([roomsResponse, statusResponse, bookingsResponse]) => {
        const statusMap = buildStatusMap(statusResponse.data);
        let inUseRooms = 0;
        let reservedRooms = 0;
        let availableRooms = 0;

        roomsResponse.data.forEach((room) => {
          const status = getRoomStatus(room.id, statusMap);
          if (status === ROOM_STATUS.IN_USE) {
            inUseRooms += 1;
          } else if (status === ROOM_STATUS.RESERVED) {
            reservedRooms += 1;
          } else {
            availableRooms += 1;
          }
        });

        const myBookings = bookingsResponse.data;

        setBookingStatusData([
          {
            name: "Pending",
            value: myBookings.filter((b) => b.status === "PENDING").length,
          },
          {
            name: "Approved",
            value: myBookings.filter((b) => b.status === "APPROVED").length,
          },
          {
            name: "Rejected",
            value: myBookings.filter((b) => b.status === "REJECTED").length,
          },
        ]);

        setRoomStatusData([
          {
            name: "Available",
            value: availableRooms,
          },
          {
            name: "Reserved",
            value: reservedRooms,
          },
          {
            name: "In Use",
            value: inUseRooms,
          },
        ]);

        setSummary({
          availableRooms,
          inUseRooms,
          reservedRooms,
          myBookings: myBookings.length,
        });
      })
      .catch((error) =>
        console.error("Unable to load employee dashboard", error),
      );
  }, [user.id]);

  return (
    <main className="portal-page">
      <div className="portal-container">
        <div className="portal-heading">
          <p className="portal-kicker">Employee portal</p>
          <h1 className="portal-title">Welcome, {user.name}</h1>
          <p className="portal-subtitle">
            Find a meeting room and manage your own reservations.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card
            variant="success"
            hover
            className="p-6 sm:p-8 text-left animate-fade-in cursor-pointer"
            onClick={() => navigate("/rooms")}
          >
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide text-gray-700">
              Meeting Rooms
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-400">
              Browse rooms and choose a time slot
            </p>
            <p className="mt-4 text-4xl sm:text-5xl font-bold text-emerald-600">
              {summary.availableRooms}
            </p>
            <p className="mt-2 text-xs sm:text-sm font-medium text-red-500">
              {summary.inUseRooms} in use now, {summary.reservedRooms} reserved
              later today
            </p>
          </Card>

          <Card
            variant="primary"
            hover
            className="p-6 sm:p-8 text-left animate-fade-in cursor-pointer"
            style={{ animationDelay: "0.1s" }}
            onClick={() => navigate("/my-bookings")}
          >
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide text-gray-700">
              My Bookings
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-400">
              View or cancel only your reservations
            </p>
            <p className="mt-4 text-4xl sm:text-5xl font-bold text-blue-600">
              {summary.myBookings}
            </p>
          </Card>
        </div>

        <div className="mt-8 sm:mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="p-4 sm:p-6 shadow-lg animate-fade-in">
            <h2 className="mb-4 sm:mb-6 text-lg sm:text-xl font-bold">My Booking Status</h2>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {bookingStatusData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-4 sm:p-6 shadow-lg animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <h2 className="mb-4 sm:mb-6 text-lg sm:text-xl font-bold">Room Status</h2>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={roomStatusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {roomStatusData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={ROOM_COLORS[index % ROOM_COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default EmployeeDashboard;