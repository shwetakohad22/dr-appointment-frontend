import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api";
import toast from "react-hot-toast";
import {
  FaCalendarAlt,
  FaUser,
  FaEnvelope,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaCheck,
  FaTimes,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const changeAppointmentStatus = async (appointmentId, status) => {
    try {
      const response = await api.post("/api/doctor/change-appointment-status", {
        appointmentId,
        status,
      });
      toast.success(response.data.message);
      getAppointmentsData();
    } catch (error) {
      toast.error("Error changing appointment status");
      console.log(error);
    }
  };

  const getAppointmentsData = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      const response = await api.get(
        `/api/doctor/get-appointments-by-doctor-id`,
        {
          params: {
            userId: userId,
          },
        },
      );
      if (response.data.success) {
        const formattedAppointments = await Promise.all(
          response.data.data.map(async (appointment) => {
            const userResponse = await api.get(`/api/user/get-user-by-id`, {
              params: {
                userId: appointment.userId,
              },
            });
            const user = userResponse.data.data;
            return {
              ...appointment,
              user: user ? { name: user.name, email: user.email } : null,
              date: new Date(appointment.date).toLocaleDateString("en-GB"),
            };
          }),
        );
        formattedAppointments.sort(
          (a, b) => new Date(b.date) - new Date(a.date),
        );
        setAppointments(formattedAppointments);
      } else {
        console.error("Error fetching appointments:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAppointmentsData();
  }, []);

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: {
        bg: "bg-gradient-to-br from-emerald-500 to-teal-500",
        text: "text-white",
        icon: <FaCheckCircle className="text-xs" />,
      },
      pending: {
        bg: "bg-gradient-to-br from-card-yellow to-yellow-400",
        text: "text-deep-blue",
        icon: <FaHourglassHalf className="text-xs" />,
      },
      rejected: {
        bg: "bg-gradient-to-br from-red-400 to-red-500",
        text: "text-white",
        icon: <FaTimesCircle className="text-xs" />,
      },
    };
    return statusConfig[status?.toLowerCase()] || statusConfig.pending;
  };

  // Filter appointments
  const filteredAppointments = appointments.filter((app) => {
    const matchesFilter =
      filter === "all" || app.status.toLowerCase() === filter;
    const matchesSearch =
      app.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Get counts
  const counts = {
    all: appointments.length,
    pending: appointments.filter((a) => a.status.toLowerCase() === "pending")
      .length,
    approved: appointments.filter((a) => a.status.toLowerCase() === "approved")
      .length,
    rejected: appointments.filter((a) => a.status.toLowerCase() === "rejected")
      .length,
  };

  return (
    <Layout>
      <div className="space-y-4 animate-fadeIn">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-deep-blue to-blue-900 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <FaCalendarAlt className="text-xl" />
                </div>
                <h1 className="text-2xl font-bold">Patient Appointments</h1>
              </div>
              <p className="text-blue-100 text-sm">
                Manage and review your patient appointments
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <p className="text-xs text-blue-200">Total</p>
                <p className="text-2xl font-bold">{counts.all}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 text-sm" />
              </div>
              <input
                type="text"
                placeholder="Search by patient name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue transition-all outline-none text-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  filter === "all"
                    ? "bg-deep-blue text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All ({counts.all})
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  filter === "pending"
                    ? "bg-gradient-to-br from-card-yellow to-yellow-400 text-deep-blue shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Pending ({counts.pending})
              </button>
              <button
                onClick={() => setFilter("approved")}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  filter === "approved"
                    ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Approved ({counts.approved})
              </button>
              <button
                onClick={() => setFilter("rejected")}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  filter === "rejected"
                    ? "bg-gradient-to-br from-red-400 to-red-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Rejected ({counts.rejected})
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 bg-white rounded-xl">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-card-yellow border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaCalendarAlt className="text-deep-blue text-lg" />
              </div>
            </div>
            <p className="text-gray-500 mt-3 text-sm font-medium">
              Loading appointments...
            </p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-xl p-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCalendarAlt className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No Appointments Found
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {searchTerm || filter !== "all"
                ? "Try adjusting your search or filters"
                : "You don't have any appointments yet"}
            </p>
            {(searchTerm || filter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilter("all");
                }}
                className="px-5 py-2 bg-deep-blue text-white text-sm font-medium rounded-lg hover:bg-blue-900 transition-colors shadow-md"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          /* Appointments Grid */
          <div className="grid grid-cols-1 gap-4">
            {filteredAppointments.map((appointment) => {
              const statusBadge = getStatusBadge(appointment.status);
              return (
                <div
                  key={appointment._id}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Patient Info */}
                    <div className="flex-1 flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-deep-blue to-blue-900 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                        <span className="text-xl font-bold">
                          {appointment.user?.name?.charAt(0)?.toUpperCase() ||
                            "?"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 text-base">
                            {appointment.user?.name || "N/A"}
                          </h3>
                          <MdVerified className="text-card-green text-sm" />
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <FaEnvelope className="text-gray-400 text-[10px]" />
                            <span className="truncate">
                              {appointment.user?.email || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="flex items-center gap-3">
                      {/* Date */}
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                        <FaCalendarAlt className="text-card-pink text-sm" />
                        <div>
                          <p className="text-[9px] text-gray-500">Date</p>
                          <p className="text-xs font-bold text-gray-800">
                            {appointment.date}
                          </p>
                        </div>
                      </div>

                      {/* Time (if available) */}
                      {appointment.time && (
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                          <FaClock className="text-card-yellow text-sm" />
                          <div>
                            <p className="text-[9px] text-gray-500">Time</p>
                            <p className="text-xs font-bold text-gray-800">
                              {appointment.time}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Status */}
                      <div
                        className={`flex items-center gap-2 ${statusBadge.bg} ${statusBadge.text} rounded-lg px-3 py-2 min-w-[100px]`}
                      >
                        {statusBadge.icon}
                        <div>
                          <p className="text-[9px] opacity-75">Status</p>
                          <p className="text-xs font-bold capitalize">
                            {appointment.status}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons - Only for Pending */}
                      {appointment.status.toLowerCase() === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              changeAppointmentStatus(
                                appointment._id,
                                "approved",
                              )
                            }
                            className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-bold px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-1.5 text-sm"
                            title="Approve"
                          >
                            <FaCheck className="text-xs" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() =>
                              changeAppointmentStatus(
                                appointment._id,
                                "rejected",
                              )
                            }
                            className="bg-gradient-to-br from-red-400 to-red-500 text-white font-bold px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-1.5 text-sm"
                            title="Reject"
                          >
                            <FaTimes className="text-xs" />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary Stats */}
        {!loading && appointments.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 mb-1 font-medium">Total</p>
                <p className="text-xl font-bold text-gray-800">
                  {appointments.length}
                </p>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg shadow-sm">
                <p className="text-xs text-white/90 mb-1 font-medium">
                  Approved
                </p>
                <p className="text-xl font-bold text-white">
                  {counts.approved}
                </p>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-card-yellow to-yellow-400 rounded-lg shadow-sm">
                <p className="text-xs text-deep-blue/90 mb-1 font-medium">
                  Pending
                </p>
                <p className="text-xl font-bold text-deep-blue">
                  {counts.pending}
                </p>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-red-400 to-red-500 rounded-lg shadow-sm">
                <p className="text-xs text-white/90 mb-1 font-medium">
                  Rejected
                </p>
                <p className="text-xl font-bold text-white">
                  {counts.rejected}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DoctorAppointments;
