import { useCallback, useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  ROOM_STATUS,
  buildStatusMap,
  getRoomStatus,
} from "../utils/roomStatus";
import { Card, DashboardSkeleton, PanelMessage } from "../components/ui";

const COLORS = ["#eab308", "#22c55e", "#ef4444"];
const ROOM_COLORS = ["#3b82f6", "#f59e0b", "#ef4444"];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [summary, setSummary] = useState({
    employees: 0,
    admins: 0,
    rooms: 0,
    availableRooms: 0,
    inUseRooms: 0,
    reservedRooms: 0,
    bookings: 0,
  });

  const [bookingStatusData, setBookingStatusData] = useState([]);

  const [roomStatusData, setRoomStatusData] = useState([]);

  const [userDistributionData, setUserDistributionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadDashboard = useCallback(() => {
    setLoading(true);
    setLoadError("");

    Promise.all([
      API.get("/users/get-all-users"),
      API.get("/rooms/get-all-rooms"),
      API.get("/bookings/room-status"),
      API.get("/bookings/get-all-bookings"),
    ])
      .then(
        ([usersResponse, roomsResponse, statusResponse, bookingsResponse]) => {
          const statusMap = buildStatusMap(statusResponse.data);

          const bookings = bookingsResponse.data;

          setBookingStatusData([
            {
              name: "Pending",
              value: bookings.filter((b) => b.status === "PENDING").length,
            },
            {
              name: "Approved",
              value: bookings.filter((b) => b.status === "APPROVED").length,
            },
            {
              name: "Rejected",
              value: bookings.filter((b) => b.status === "REJECTED").length,
            },
          ]);

          let inUseRooms = 0;
          let reservedRooms = 0;
          let availableRooms = 0;

          roomsResponse.data.forEach((room) => {
            const status = getRoomStatus(room.id, statusMap);

            if (status === ROOM_STATUS.IN_USE) {
              inUseRooms++;
            } else if (status === ROOM_STATUS.RESERVED) {
              reservedRooms++;
            } else {
              availableRooms++;
            }
          });

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

          const adminsCount = usersResponse.data.filter(
            (u) => u.role === "ADMIN",
          ).length;
          const employeesCount = usersResponse.data.filter(
            (u) => u.role === "EMPLOYEE",
          ).length;

          setUserDistributionData([
            {
              name: "Admins",
              count: adminsCount,
            },
            {
              name: "Employees",
              count: employeesCount,
            },
          ]);

          setSummary({
            employees: employeesCount,
            admins: adminsCount,
            rooms: roomsResponse.data.length,
            availableRooms,
            inUseRooms,
            reservedRooms,
            bookings: bookingsResponse.data.length,
          });
        },
      )
      .catch((error) => {
        console.error("Unable to load dashboard", error);
        setLoadError("Dashboard data could not be loaded. Please check your connection and try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(loadDashboard, 0);
    return () => window.clearTimeout(timerId);
  }, [loadDashboard]);

  const cards = [
    {
      title: user?.systemAdmin ? "Admins & Employees" : "My Employees",

      description: user?.systemAdmin
        ? "Manage all admins and employees"
        : "Manage employees created by you",

      value: user?.systemAdmin
        ? summary.admins + summary.employees
        : summary.employees,

      path: "/users",

      variant: "primary",
      valueColor: "text-blue-600",
    },

    {
      title: "Meeting Rooms",

      description: `${summary.availableRooms} available, ${summary.inUseRooms} in use, ${summary.reservedRooms} reserved`,

      value: summary.rooms,

      path: "/rooms",

      variant: "success",
      valueColor: "text-emerald-600",
    },

    {
      title: "Bookings",

      description: "View all booking records",

      value: summary.bookings,

      path: "/bookings",

      variant: "default",
      valueColor: "text-violet-600",
    },
  ];

  if (loading) {
    return (
      <main className="portal-page">
        <div className="portal-container">
          <div className="portal-heading">
            <p className="portal-kicker">
              {user?.systemAdmin ? "System Admin Portal" : "Admin Portal"}
            </p>

            <h1 className="portal-title">
              {user?.systemAdmin ? "System Admin Dashboard" : "Admin Dashboard"}
            </h1>

            <p className="portal-subtitle">
              {user?.systemAdmin
                ? "Manage admins, employees, rooms and bookings."
                : "Manage your employees, rooms and bookings."}
            </p>
          </div>

          <DashboardSkeleton />
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="portal-page">
        <div className="portal-container">
          <div className="portal-heading">
            <p className="portal-kicker">
              {user?.systemAdmin ? "System Admin Portal" : "Admin Portal"}
            </p>

            <h1 className="portal-title">
              {user?.systemAdmin ? "System Admin Dashboard" : "Admin Dashboard"}
            </h1>

            <p className="portal-subtitle">
              {user?.systemAdmin
                ? "Manage admins, employees, rooms and bookings."
                : "Manage your employees, rooms and bookings."}
            </p>
          </div>

          <PanelMessage
            title="Unable to load dashboard"
            description={loadError}
            actionLabel="Retry"
            onAction={loadDashboard}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="portal-page">
      <div className="portal-container">
        <div className="portal-heading">
          <p className="portal-kicker">
            {user?.systemAdmin ? "System Admin Portal" : "Admin Portal"}
          </p>

          <h1 className="portal-title">
            {user?.systemAdmin ? "System Admin Dashboard" : "Admin Dashboard"}
          </h1>

          <p className="portal-subtitle">
            {user?.systemAdmin
              ? "Manage admins, employees, rooms and bookings."
              : "Manage your employees, rooms and bookings."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Card
              key={card.title}
              variant={card.variant}
              hover
              className="p-6 sm:p-8 text-left animate-fade-in cursor-pointer"
              onClick={() => navigate(card.path)}
            >
              <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide text-gray-700">
                {card.title}
              </h2>

              <p className="mt-1 text-xs sm:text-sm text-gray-400">{card.description}</p>

              <p className={`mt-4 text-4xl sm:text-5xl font-bold ${card.valueColor}`}>
                {card.value}
              </p>
            </Card>
          ))}
        </div>

        <div className="mt-8 sm:mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="p-4 sm:p-6 shadow-lg animate-fade-in">
            <h2 className="mb-4 sm:mb-6 text-lg sm:text-xl font-bold">Booking Status</h2>

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

          <Card className="p-4 sm:p-6 shadow-lg animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h2 className="mb-4 sm:mb-6 text-lg sm:text-xl font-bold">User Distribution</h2>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={userDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="count"
                  fill="#8b5cf6"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
