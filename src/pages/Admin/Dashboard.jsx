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
  FaUserMd,
  FaUsers,
  FaCalendarCheck,
  FaChartLine,
  FaClipboardList,
  FaBell,
} from "react-icons/fa";

const Dashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]); // Assuming we can get appointments count somehow, or just stick to users/doctors for now
  const [loading, setLoading] = useState(true);
  // State for notifications
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorsRes = await api.get("/api/admin/get-all-doctors");
        const usersRes = await api.get("/api/admin/get-all-users");

        // Fetch Admin Profile for Notifications
        const userId = localStorage.getItem("userId");
        const userRes = await api.get(`/api/user/get-user-by-id`, {
          params: { userId },
        });

        // Potential future addition: appointments
        // const appointmentsRes = await axios.get("http://localhost:8001/api/admin/get-all-appointments");

        if (doctorsRes.data.success) {
          setDoctors(doctorsRes.data.data);
        }
        if (usersRes.data.success) {
          setUsers(usersRes.data.data);
        }
        if (userRes.data.success) {
          const adminData = userRes.data.data;
          const allNotifs = [
            ...(adminData.unseenNotifications || []),
            ...(adminData.seenNotifications || []),
          ];
          setNotifications(allNotifs.reverse().slice(0, 20));
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate stats
  const totalDoctors = doctors.length;
  const approvedDoctors = doctors.filter((d) => d.status === "approved").length;
  const pendingDoctors = doctors.filter((d) => d.status === "pending").length;
  const blockedDoctors = doctors.filter((d) => d.status === "blocked").length;
  const totalUsers = users.length;

  // Chart Data
  const doctorStatusData = [
    { name: "Approved", value: approvedDoctors, color: "#10b981" }, // emerald-500
    { name: "Pending", value: pendingDoctors, color: "#facc15" }, // yellow-400
    { name: "Blocked", value: blockedDoctors, color: "#ef4444" }, // red-500
  ];

  const processGrowthData = () => {
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

    const getMonthIndex = (dateString) => new Date(dateString).getMonth();
    const currentYear = new Date().getFullYear();

    months.forEach((month, index) => {
      data.push({
        name: month,
        users: users.filter(
          (u) =>
            getMonthIndex(u.createdAt) === index &&
            new Date(u.createdAt).getFullYear() === currentYear,
        ).length,
        doctors: doctors.filter(
          (d) =>
            getMonthIndex(d.createdAt) === index &&
            new Date(d.createdAt).getFullYear() === currentYear,
        ).length,
      });
    });

    const currentMonthIndex = new Date().getMonth();
    const startMonthIndex = Math.max(0, currentMonthIndex - 5);
    return data.slice(startMonthIndex, currentMonthIndex + 1);
  };

  const userGrowthData = processGrowthData();

  // Recent Activity Feed (New Registrations)
  const recentActivity = [
    ...users.map((u) => ({ ...u, type: "user", date: new Date(u.createdAt) })),
    ...doctors.map((d) => ({
      ...d,
      type: "doctor",
      date: new Date(d.createdAt),
    })),
  ]
    .sort((a, b) => b.date - a.date)
    .slice(0, 5);

  return (
    <Layout>
      <div className="flex flex-col h-full space-y-4 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Overview of system performance and statistics
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
          {/* Total Users */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-800">{totalUsers}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xl">
              <FaUsers />
            </div>
          </div>

          {/* Total Doctors */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Doctors</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {totalDoctors}
              </h3>
            </div>
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center text-xl">
              <FaUserMd />
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm text-gray-500 mb-1">Pending Approvals</p>
              <h3 className="text-2xl font-bold text-amber-600">
                {pendingDoctors}
              </h3>
            </div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center text-xl">
              <FaCalendarCheck />
            </div>
          </div>

          {/* Activity Rate (Mock) */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm text-gray-500 mb-1">System Health</p>
              <h3 className="text-2xl font-bold text-emerald-600">98%</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center text-xl">
              <FaChartLine />
            </div>
          </div>
        </div>

        {/* Charts & Notifications Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          {/* Charts Section - Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-6 h-full overflow-hidden">
            {/* Platform Growth */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-1 min-h-0 flex flex-col">
              <h3 className="text-lg font-bold text-gray-800 mb-2 shrink-0">
                Platform Growth
              </h3>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={userGrowthData}
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
                    <Legend />
                    <Bar
                      dataKey="users"
                      name="New Users"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      barSize={20}
                    />
                    <Bar
                      dataKey="doctors"
                      name="New Doctors"
                      fill="#8b5cf6"
                      radius={[4, 4, 0, 0]}
                      barSize={20}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Doctor Status */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Doctor Status Distribution
                </h3>
                <div className="flex gap-4 text-xs text-gray-500 mt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>{" "}
                    Approved: {approvedDoctors}
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-amber-400"></div>{" "}
                    Pending: {pendingDoctors}
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>{" "}
                    Blocked: {blockedDoctors}
                  </div>
                </div>
              </div>
              <div className="h-[120px] w-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={doctorStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={55}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {doctorStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Notifications - Right Column */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
            <h3 className="text-lg font-bold text-gray-800 mb-4 shrink-0">
              Recent Notifications
            </h3>
            <div className="space-y-4 overflow-y-auto flex-grow pr-2 custom-scrollbar">
              {notifications.length > 0 ? (
                notifications.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs shrink-0 bg-blue-500">
                      <FaClipboardList />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">
                        {item.type === "new-doctor-request"
                          ? "New Doctor Application"
                          : "Notification"}
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
                    No new notifications at the moment
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

export default Dashboard;
