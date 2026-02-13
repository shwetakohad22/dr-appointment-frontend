import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaUserMd,
  FaPhone,
  FaStethoscope,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSearch,
  FaBan,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const getDoctorsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8001/api/admin/get-all-doctors");
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  const changeDoctorStatus = async (doctorId, status) => {
    try {
      const response = await axios.post("http://localhost:8001/api/admin/change-doctor-status", {
        doctorId,
        status,
      });
      toast.success(response.data.message);
      getDoctorsData();
    } catch (error) {
      toast.error("Error changing doctor account status");
      console.log(error);
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  // Filter doctors
  const filteredDoctors = doctors.filter((doctor) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      doctor.firstName?.toLowerCase().includes(searchLower) ||
      doctor.lastName?.toLowerCase().includes(searchLower) ||
      doctor.specialization?.toLowerCase().includes(searchLower) ||
      doctor.phoneNumber?.includes(searchLower);
    
    const matchesStatus = 
      filterStatus === "All" || 
      doctor.status?.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Get status badge
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
        icon: <FaClock className="text-xs" />,
      },
      blocked: {
        bg: "bg-gradient-to-br from-red-400 to-red-500",
        text: "text-white",
        icon: <FaBan className="text-xs" />,
      },
    };
    return statusConfig[status?.toLowerCase()] || statusConfig.pending;
  };

  // Get unique statuses
  const statuses = ["All", ...new Set(doctors.map((d) => d.status))];

  // Get counts
  const counts = {
    all: doctors.length,
    pending: doctors.filter(d => d.status?.toLowerCase() === 'pending').length,
    approved: doctors.filter(d => d.status?.toLowerCase() === 'approved').length,
    blocked: doctors.filter(d => d.status?.toLowerCase() === 'blocked').length,
  };

  return (
    <Layout>
      <div className="space-y-3 animate-fadeIn">
        {/* Header Section with Stats */}
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Doctors Management</h1>
              <p className="text-sm text-gray-500">
                Manage and review all doctor accounts
              </p>
            </div>
            
            {/* Stats Cards - Moved to Header */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 mb-1 font-medium">Total</p>
                <p className="text-2xl font-bold text-gray-800">{counts.all}</p>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg shadow-sm">
                <p className="text-xs text-white/90 mb-1 font-medium">Approved</p>
                <p className="text-2xl font-bold text-white">{counts.approved}</p>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-card-yellow to-yellow-400 rounded-lg shadow-sm">
                <p className="text-xs text-deep-blue/90 mb-1 font-medium">Pending</p>
                <p className="text-2xl font-bold text-deep-blue">{counts.pending}</p>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-red-400 to-red-500 rounded-lg shadow-sm">
                <p className="text-xs text-white/90 mb-1 font-medium">Blocked</p>
                <p className="text-2xl font-bold text-white">{counts.blocked}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 text-sm" />
              </div>
              <input
                type="text"
                placeholder="Search by name, specialization, or phone..."
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
          <div className="flex flex-col justify-center items-center py-20 bg-white rounded-xl border border-gray-100">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-deep-blue rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-500 mt-3 text-sm">Loading doctors...</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-xl p-16 text-center border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUserMd className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No Doctors Found
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {searchTerm || filterStatus !== "All"
                ? "Try adjusting your search or filters"
                : "No doctors registered yet"}
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
          /* Doctors List */
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Specialization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Registered
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDoctors.map((doctor, index) => {
                    const statusBadge = getStatusBadge(doctor.status);
                    return (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        {/* Doctor Name */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-deep-blue to-blue-900 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                              <span className="font-bold text-sm">
                                {doctor.firstName?.charAt(0)}{doctor.lastName?.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="text-sm font-semibold text-gray-900">
                                  Dr. {doctor.firstName} {doctor.lastName}
                                </p>
                                {doctor.status?.toLowerCase() === "approved" && (
                                  <MdVerified className="text-emerald-500 text-sm" />
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <FaPhone className="text-gray-400 text-xs" />
                            <span>{doctor.phoneNumber}</span>
                          </div>
                        </td>

                        {/* Specialization */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <FaStethoscope className="text-gray-400 text-xs" />
                            <span className="text-sm text-gray-700">{doctor.specialization}</span>
                          </div>
                        </td>

                        {/* Created At */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <FaCalendarAlt className="text-gray-400 text-xs" />
                            <span>{new Date(doctor.createdAt).toLocaleDateString()}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${statusBadge.bg} ${statusBadge.text} rounded-lg text-xs font-bold`}>
                            {statusBadge.icon}
                            <span className="capitalize">{doctor.status}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {doctor.status?.toLowerCase() === "pending" && (
                              <button
                                onClick={() => changeDoctorStatus(doctor._id, "approved")}
                                className="px-3 py-1.5 bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-xs font-medium rounded-lg hover:shadow-lg transition-all flex items-center gap-1"
                              >
                                <FaCheckCircle className="text-[10px]" />
                                Approve
                              </button>
                            )}
                            {doctor.status?.toLowerCase() === "approved" && (
                              <button
                                onClick={() => changeDoctorStatus(doctor._id, "blocked")}
                                className="px-3 py-1.5 bg-gradient-to-br from-red-400 to-red-500 text-white text-xs font-medium rounded-lg hover:shadow-lg transition-all flex items-center gap-1"
                              >
                                <FaBan className="text-[10px]" />
                                Block
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DoctorsList;