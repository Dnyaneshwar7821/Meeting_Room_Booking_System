import { useCallback, useEffect, useState } from "react";
import API from "../services/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { getErrorMessage } from "../utils/errors";
import Swal from "sweetalert2";
import { showSuccess, showError } from "../utils/toast";
import { SearchBar, Pagination, Badge, Button, CheckIcon, XIcon, DownloadIcon, FileIcon } from "../components/ui";

const Bookings = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const [bookings, setBookings] = useState([]);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 10;

  const fetchBookings = useCallback(() => {
    API.get("/bookings/get-all-bookings")
      .then((response) => {
        setBookings(response.data);
      })
      .catch((err) => {
        showError(getErrorMessage(err));
      });
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const cancelBooking = async (id) => {
    const result = await Swal.fire({
      title: "Cancel Booking?",
      text: "This booking will be removed.",
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
        fetchBookings();

        showSuccess("Booking cancelled successfully");
      })
      .catch((err) => {
        showError(getErrorMessage(err));
      });
  };

  const approveBooking = (id) => {
    API.put(`/bookings/approve-booking/${id}`)
      .then(() => {
        fetchBookings();
        showSuccess("Booking approved successfully");
      })
      .catch((err) => showError(getErrorMessage(err)));
  };

  const rejectBooking = (id) => {
    API.put(`/bookings/reject-booking/${id}`)
      .then(() => {
        fetchBookings();
        showSuccess("Booking rejected successfully");
      })
      .catch((err) => showError(getErrorMessage(err)));
  };

  const filteredBookings = bookings.filter((booking) =>
    `${booking.user?.name} ${booking.room?.roomName} ${booking.status} ${booking.bookingDate}`
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
      Employee: booking.user?.name || "N/A",
      Room: booking.room?.roomName || "N/A",
      Date: booking.bookingDate,
      "Start Time": booking.startTime,
      "End Time": booking.endTime,
      Status: booking.status,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bookings");

    ws["!cols"] = [
      { wch: 12 },
      { wch: 25 },
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
    saveAs(blob, `bookings_${new Date().toISOString().split("T")[0]}.xlsx`);
    showSuccess("Excel file downloaded successfully");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const dateTime = new Date().toLocaleString();

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Meeting Room Booking Report", 14, 22);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${dateTime}`, 14, 30);

    const tableColumn = [
      "Booking ID",
      "Employee",
      "Room",
      "Date",
      "Start Time",
      "End Time",
      "Status",
    ];

    const tableRows = filteredBookings.map((booking, index) => [
      firstIndex + index + 1,
      booking.user?.name || "N/A",
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

    doc.save(`bookings_${new Date().toISOString().split("T")[0]}.pdf`);
    showSuccess("PDF file downloaded successfully");
  };

  return (
    <main className="portal-page">
      <div className="portal-container">
        <div className="portal-heading">
          <p className="portal-kicker">
            {loggedInUser?.systemAdmin
              ? "System Admin Workspace"
              : "Admin Workspace"}
          </p>

          <h1 className="portal-title">
            {loggedInUser?.systemAdmin ? "All Bookings" : "Employee Bookings"}
          </h1>

          <p className="portal-subtitle">
            {loggedInUser?.systemAdmin
              ? "Review bookings created by every admin and employee."
              : "Review bookings of employees created by you."}
          </p>
        </div>

        <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <SearchBar
            placeholder="Search bookings..."
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
                <th className="p-4">ID</th>
                <th className="p-4">Employee</th>
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

                  <td className="p-4 text-center">{booking.user?.name}</td>

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
                    {booking.status === "PENDING" ? (
                      <div className="flex flex-col sm:flex-row justify-center gap-2">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => approveBooking(booking.id)}
                          leftIcon={<CheckIcon className="h-4 w-4" />}
                        >
                          Approve
                        </Button>

                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => rejectBooking(booking.id)}
                          leftIcon={<XIcon className="h-4 w-4" />}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : booking.status === "APPROVED" ? (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => cancelBooking(booking.id)}
                      >
                        Cancel
                      </Button>
                    ) : (
                      <span className="text-sm font-semibold text-gray-500">
                        No Action
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan="8" className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-lg font-semibold text-slate-900">No bookings found</p>
                      <p className="text-sm text-slate-500">Try adjusting your search criteria</p>
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

export default Bookings;