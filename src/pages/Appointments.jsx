import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api";
import {
  FaCalendarCheck,
  FaUserMd,
  FaPhoneAlt,
  FaStethoscope,
  FaClock,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaCalendarAlt,
  FaSearch,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const getAppointmentsData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await api.get(
        `/api/user/get-appointments-by-user-id?userId=${userId}`,
      );
      if (response.data.success) {
        const formattedAppointments = response.data.data.map((appointment) => ({
          ...appointment,
          date: new Date(appointment.date).toLocaleDateString("en-GB"),
        }));
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

  // Filter appointments
  const filteredAppointments = appointments.filter((appointment) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      appointment.doctorInfo.firstName?.toLowerCase().includes(searchLower) ||
      appointment.doctorInfo.lastName?.toLowerCase().includes(searchLower) ||
      appointment.doctorInfo.specialization
        ?.toLowerCase()
        .includes(searchLower);

    const matchesStatus =
      filterStatus === "All" || appointment.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: {
        bg: "bg-gradient-to-br from-emerald-500 to-teal-500",
        text: "text-white",
        icon: <FaCheckCircle className="text-xs" />,
        label: "Approved",
      },
      pending: {
        bg: "bg-gradient-to-br from-card-yellow to-yellow-400",
        text: "text-deep-blue",
        icon: <FaHourglassHalf className="text-xs" />,
        label: "Pending",
      },
      rejected: {
        bg: "bg-gradient-to-br from-red-400 to-red-500",
        text: "text-white",
        icon: <FaTimesCircle className="text-xs" />,
        label: "Rejected",
      },
      cancelled: {
        bg: "bg-gradient-to-br from-gray-400 to-gray-500",
        text: "text-white",
        icon: <FaTimesCircle className="text-xs" />,
        label: "Cancelled",
      },
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    return config;
  };

  // Get unique statuses
  const statuses = ["All", ...new Set(appointments.map((a) => a.status))];

  return (
    <Layout>
      <div className="space-y-4 animate-fadeIn">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-deep-blue to-blue-900 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <FaCalendarCheck className="text-xl" />
                </div>
                <h1 className="text-2xl font-bold">My Appointments</h1>
              </div>
              <p className="text-blue-100 text-sm">
                View and manage all your scheduled appointments
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <p className="text-xs text-blue-200">Total</p>
                <p className="text-2xl font-bold">{appointments.length}</p>
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
                placeholder="Search by doctor name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue transition-all outline-none text-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 overflow-x-auto">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    filterStatus === status
                      ? "bg-deep-blue text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 bg-white rounded-xl">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-card-yellow border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaCalendarCheck className="text-deep-blue text-lg" />
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
              <FaCalendarCheck className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {searchTerm || filterStatus !== "All"
                ? "No Appointments Found"
                : "No Appointments Yet"}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {searchTerm || filterStatus !== "All"
                ? "Try adjusting your search or filters"
                : "Book your first appointment with our expert doctors"}
            </p>
            {(searchTerm || filterStatus !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("All");
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
                    {/* Doctor Info */}
                    <div className="flex-1 flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-deep-blue to-blue-900 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                        <FaUserMd className="text-xl" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 text-base">
                            Dr. {appointment.doctorInfo.firstName}{" "}
                            {appointment.doctorInfo.lastName}
                          </h3>
                          <MdVerified className="text-card-green text-sm" />
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <FaStethoscope className="text-gray-400 text-[10px]" />
                            <span>{appointment.doctorInfo.specialization}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FaPhoneAlt className="text-gray-400 text-[10px]" />
                            <span>{appointment.doctorInfo.phoneNumber}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="flex items-center gap-4">
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

                      {/* Status */}
                      <div
                        className={`flex items-center gap-2 ${statusBadge.bg} ${statusBadge.text} rounded-lg px-3 py-2 min-w-[100px]`}
                      >
                        {statusBadge.icon}
                        <div>
                          <p className="text-[9px] opacity-75">Status</p>
                          <p className="text-xs font-bold">
                            {statusBadge.label}
                          </p>
                        </div>
                      </div>
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
                  {
                    appointments.filter(
                      (a) => a.status?.toLowerCase() === "approved",
                    ).length
                  }
                </p>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-card-yellow to-yellow-400 rounded-lg shadow-sm">
                <p className="text-xs text-deep-blue/90 mb-1 font-medium">
                  Pending
                </p>
                <p className="text-xl font-bold text-deep-blue">
                  {
                    appointments.filter(
                      (a) => a.status?.toLowerCase() === "pending",
                    ).length
                  }
                </p>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-card-pink to-pink-400 rounded-lg shadow-sm">
                <p className="text-xs text-deep-blue/90 mb-1 font-medium">
                  Other
                </p>
                <p className="text-xl font-bold text-deep-blue">
                  {
                    appointments.filter(
                      (a) =>
                        a.status?.toLowerCase() !== "approved" &&
                        a.status?.toLowerCase() !== "pending",
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Appointments;
