import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import { getErrorMessage } from "../utils/errors";
import { showSuccess, showError } from "../utils/toast";
import { Button, BackIcon } from "../components/ui";

const BookRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState({
    bookingDate: "",
    startTime: "",
    endTime: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setError("");
    setBooking({
      ...booking,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (booking.startTime >= booking.endTime) {
      showError("Start time must be before end time.");
      return;
    }

    setIsLoading(true);
    try {
      await API.post("/bookings/create-booking", {
        bookingDate: booking.bookingDate,
        startTime: booking.startTime,
        endTime: booking.endTime,
        roomId: Number(roomId),
      });
      showSuccess("Room booked successfully");
      setTimeout(() => navigate("/my-bookings"), 1000);
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="portal-page">
      <div className="mx-auto max-w-2xl">
        <div className="portal-heading text-center">
          <p className="portal-kicker">Create reservation</p>
          <h1 className="portal-title">Book Meeting Room</h1>
          <p className="portal-subtitle">Choose the date and meeting time for this room.</p>
        </div>
        <div className="portal-panel p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Meeting Date
              </label>
              <input
                type="date"
                name="bookingDate"
                value={booking.bookingDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3.5 text-gray-900 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 hover:border-gray-300 hover:shadow-md"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Start Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={booking.startTime}
                  onChange={handleChange}
                  className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3.5 text-gray-900 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 hover:border-gray-300 hover:shadow-md"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  End Time
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={booking.endTime}
                  onChange={handleChange}
                  className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3.5 text-gray-900 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 hover:border-gray-300 hover:shadow-md"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => navigate("/rooms")}
                className="flex-1"
                leftIcon={<BackIcon className="h-4 w-4" />}
              >
                Back
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isLoading}
                isLoading={isLoading}
                className="flex-1"
              >
                {isLoading ? "Booking..." : "Confirm Booking"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default BookRoom;