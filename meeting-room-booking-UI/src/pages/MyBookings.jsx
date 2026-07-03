import { useCallback, useEffect, useState } from "react";
import API from "../services/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { getErrorMessage } from "../utils/errors";
import Swal from "sweetalert2";
import { showSuccess, showError } from "../utils/toast";
import { SearchBar, Pagination, Badge, Button, DownloadIcon, FileIcon } from "../components/ui";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 10;

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchMyBookings = useCallback(() => {
    API.get(`/bookings/user/${user.id}`)
      .then((response) => {
        setBookings(response.data);
      })
      .catch((err) => {
        showError(getErrorMessage(err));
      });
  }, [user.id]);

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  const cancelBooking = async (id) => {
    const result = await Swal.fire({
      title: "Cancel Booking?",
      text: "Your room reservation will be removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Cancel Booking",
    });

    if (!result.isConfirmed) {
      return;
    }

    API.delete(`/bookings/cancel-booking/${id}`)
      .then(() => {
        fetchMyBookings();
        showSuccess("Booking cancelled successfully");
      })
      .catch((err) => {
        showError(getErrorMessage(err));
      });
  };

  const filteredBookings = bookings.filter((booking) =>
    `${booking.room?.roomName} ${booking.bookingDate} ${booking.status}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const lastIndex = currentPage * recordsPerPage;

  const firstIndex = lastIndex - recordsPerPage;

  const currentRecords = filteredBookings.slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(filteredBookings.length / recordsPerPage);

  const exportToExcel = () => {
    const data = filteredBookings.map((booking, index) => ({
      "Booking ID": firstIndex + index + 1,
      Room: booking.room?.roomName || "N/A",
      Date: booking.bookingDate,
      "Start Time": booking.startTime,
      "End Time": booking.endTime,
      Status: booking.status,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "My Bookings");

    ws["!cols"] = [
      { wch: 12 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 },
    ];

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `my_bookings_${new Date().toISOString().split("T")[0]}.xlsx`);
    showSuccess("Excel file downloaded successfully");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const dateTime = new Date().toLocaleString();

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("My Meeting Room Bookings Report", 14, 22);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${dateTime}`, 14, 30);

    const tableColumn = [
      "Booking ID",
      "Room",
      "Date",
      "Start Time",
      "End Time",
      "Status",
    ];

    const tableRows = filteredBookings.map((booking, index) => [
      firstIndex + index + 1,
      booking.room?.roomName || "N/A",
      booking.bookingDate,
      booking.startTime,
      booking.endTime,
      booking.status,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 38,
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
    });

    doc.save(`my_bookings_${new Date().toISOString().split("T")[0]}.pdf`);
    showSuccess("PDF file downloaded successfully");
  };

  return (
    <main className="portal-page">
      <div className="portal-container">
        <div className="portal-heading">
          <p className="portal-kicker">Employee Workspace</p>

          <h1 className="portal-title">My Room Bookings</h1>

          <p className="portal-subtitle">
            View your meeting schedule or cancel a reservation.
          </p>
        </div>

        <div className="mb-6 flex flex-col lg:items-center lg:justify-between gap-4">
          <SearchBar
            placeholder="Search my bookings..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full lg:max-w-sm"
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="success"
              onClick={exportToExcel}
              leftIcon={<DownloadIcon className="h-5 w-5" />}
            >
              Export Excel
            </Button>

            <Button
              variant="danger"
              onClick={exportToPDF}
              leftIcon={<FileIcon className="h-5 w-5" />}
            >
              Export PDF
            </Button>
          </div>
        </div>

        <div className="portal-panel overflow-x-auto">
          <table className="portal-table">
            <thead>
              <tr>
                <th className="p-4">Booking ID</th>
                <th className="p-4">Room</th>
                <th className="p-4">Date</th>
                <th className="p-4">Start Time</th>
                <th className="p-4">End Time</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {currentRecords.map((booking, index) => (
                <tr key={booking.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-center">{firstIndex + index + 1}</td>

                  <td className="p-4 text-center">{booking.room?.roomName}</td>

                  <td className="p-4 text-center">{booking.bookingDate}</td>

                  <td className="p-4 text-center">{booking.startTime}</td>

                  <td className="p-4 text-center">{booking.endTime}</td>

                  <td className="p-4 text-center">
                    <Badge
                      variant={
                        booking.status === "PENDING"
                          ? "pending"
                          : booking.status === "APPROVED"
                            ? "approved"
                            : "rejected"
                      }
                      size="md"
                    >
                      {booking.status}
                    </Badge>
                  </td>

                  <td className="p-4 text-center">
                    {booking.status === "APPROVED" ? (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => cancelBooking(booking.id)}
                      >
                        Cancel
                      </Button>
                    ) : booking.status === "PENDING" ? (
                      <Badge variant="pending" size="md">
                        Waiting for Approval
                      </Badge>
                    ) : (
                      <Badge variant="rejected" size="md">
                        Booking Rejected
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}

              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-lg font-semibold text-slate-900">No bookings found</p>
                      <p className="text-sm text-slate-500">You haven't made any room reservations yet</p>
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

export default MyBookings;