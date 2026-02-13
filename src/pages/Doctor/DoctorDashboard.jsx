import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FaUserInjured,
  FaCalendarCheck,
  FaRupeeSign,
  FaClipboardList,
  FaBell,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");

        // 1. Get Doctor Info
        const doctorRes = await api.post("/api/doctor/get-doctor-info-by-id", {
          userId,
        });

        // 2. Get User Info (for notifications)
        const userRes = await api.get(`/api/user/get-user-by-id`, {
          params: { userId },
        });

        if (doctorRes.data.success) {
          setDoctor(doctorRes.data.data);
          // 3. Get Appointments (using doctorId)
          if (doctorRes.data.data) {
            const appointmentsRes = await api.get(
              `/api/doctor/get-appointments-by-doctor-id`,
              { params: { userId } }, // Logic in backend uses userId to find doctor
            );
            if (appointmentsRes.data.success) {
              setAppointments(appointmentsRes.data.data);
            }
          }
        }

        if (userRes.data.success) {
          const userData = userRes.data.data;
          const allNotifs = [
            ...(userData.unseenNotifications || []),
            ...(userData.seenNotifications || []),
          ];
          setNotifications(allNotifs.reverse().slice(0, 20));
        }
      } catch (error) {
        console.error("Error fetching doctor dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // calculations
  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter(
    (a) => a.status === "pending",
  ).length;
  const approvedAppointments = appointments.filter(
    (a) => a.status === "approved",
  ).length;
  const patientsCount = new Set(appointments.map((a) => a.userId)).size;
  const totalEarnings =
    approvedAppointments * (doctor?.feePerCunsultation || 0);

  // Charts Data
  const appointmentStatusData = [
    { name: "Approved", value: approvedAppointments, color: "#10b981" },
    { name: "Pending", value: pendingAppointments, color: "#facc15" },
    {
      name: "Rejected",
      value: appointments.filter((a) => a.status === "rejected").length,
      color: "#ef4444",
    },
  ];

  const processAppointmentTrends = () => {
    const data = [];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentYear = new Date().getFullYear();

    months.forEach((month, index) => {
      data.push({
        name: month,
        appointments: appointments.filter((a) => {
          const d = new Date(a.date); // Assuming date is ISO string or accessible
          // Note: appointment date might be stored differently, adjusting for 'date' field
          return (
            new Date(a.createdAt).getMonth() === index &&
            new Date(a.createdAt).getFullYear() === currentYear
          );
        }).length,
      });
    });

    const currentMonthIndex = new Date().getMonth();
    const startMonthIndex = Math.max(0, currentMonthIndex - 5);
    return data.slice(startMonthIndex, currentMonthIndex + 1);
  };

  const appointmentTrendsData = processAppointmentTrends();

  return (
    <Layout>
      <div className="flex flex-col h-full space-y-4 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Doctor Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Welcome back, Dr. {doctor?.firstName} {doctor?.lastName}
            </p>
          </div>
          <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-medium">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
          {/* Total Earnings */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Earnings</p>
              <h3 className="text-2xl font-bold text-gray-800">
                ₹{totalEarnings}
              </h3>
            </div>
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center text-xl">
              <FaRupeeSign />
            </div>
          </div>

          {/* Total Appointments */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm text-gray-500 mb-1">Appointments</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {totalAppointments}
              </h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xl">
              <FaClipboardList />
            </div>
          </div>

          {/* Total Patients */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm text-gray-500 mb-1">Patients</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {patientsCount}
              </h3>
            </div>
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center text-xl">
              <FaUserInjured />
            </div>
          </div>

          {/* Pending Appointments */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm text-gray-500 mb-1">Pending</p>
              <h3 className="text-2xl font-bold text-amber-600">
                {pendingAppointments}
              </h3>
            </div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center text-xl">
              <FaCalendarCheck />
            </div>
          </div>
        </div>

        {/* content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          {/* Charts */}
          <div className="lg:col-span-2 flex flex-col gap-6 h-full overflow-hidden">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-1 min-h-0 flex flex-col">
              <h3 className="text-lg font-bold text-gray-800 mb-2 shrink-0">
                Appointment Trends
              </h3>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={appointmentTrendsData}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f0f0f0"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9ca3af", fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9ca3af", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="appointments"
                      name="Appointments"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      barSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Appointment Status
                </h3>
                <div className="flex gap-4 text-xs text-gray-500 mt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>{" "}
                    Approved: {approvedAppointments}
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-amber-400"></div>{" "}
                    Pending: {pendingAppointments}
                  </div>
                </div>
              </div>
              <div className="h-[120px] w-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={appointmentStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={55}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {appointmentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
            <h3 className="text-lg font-bold text-gray-800 mb-4 shrink-0">
              Recent Notifications
            </h3>
            <div className="space-y-4 overflow-y-auto flex-grow pr-2 custom-scrollbar">
              {notifications.length > 0 ? (
                notifications.map((item, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      item.onClickPath && navigate(item.onClickPath)
                    }
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs shrink-0 bg-blue-500">
                      <FaBell />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">
                        Notification
                      </p>
                      <p className="text-[10px] text-gray-500 text-ellipsis break-all line-clamp-2">
                        {item.message}
                      </p>
                      <p className="text-[9px] text-gray-400 mt-1">Recent</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FaBell className="text-gray-400 text-2xl" />
                  </div>
                  <h4 className="text-base font-semibold text-gray-800 mb-2">
                    All Caught Up!
                  </h4>
                  <p className="text-sm text-gray-500 text-center">
                    No new notifications
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorDashboard;
