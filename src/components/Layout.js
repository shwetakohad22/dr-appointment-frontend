import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaClipboardList,
  FaHome,
  FaRegHospital,
  FaStethoscope,
  FaBars,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { IoMdLogOut, IoIosNotificationsOutline } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import axios from "axios";
import { Badge } from "antd";

const Layout = ({ children }) => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState("user");
  const [menuItems, setMenuItems] = useState([]);
  const [userName, setUserName] = useState("");
  const [unseenNotifications, setUnseenNotifications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(
        `http://localhost:8001/api/user/get-user-by-id`,
        {
          params: {
            userId,
          },
        },
      );
      setUserRole(
        response.data.data.isAdmin
          ? "admin"
          : response.data.data.isDoctor
            ? "doctor"
            : "user",
      );
      setUserName(response.data.data.name);
      setUnseenNotifications(response.data.data.unseenNotifications);
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  useEffect(() => {
    const userMenu = [
      {
        name: "Home",
        path: "/home",
        icon: <FaHome />,
      },
      {
        name: "Appointments",
        path: "/appointments",
        icon: <FaClipboardList />,
      },
      {
        name: "Apply Doctor",
        path: "/apply-doctor",
        icon: <FaRegHospital />,
      },
    ];

    const adminMenu = [
      {
        name: "Dashboard",
        path: "/admin/dashboard",
        icon: <FaHome />,
      },
      {
        name: "Users",
        path: "/admin-userslist",
        icon: <FaUserFriends />,
      },
      {
        name: "Doctors",
        path: "/admin-doctorslist",
        icon: <FaRegHospital />,
      },
    ];

    const doctorMenu = [
      {
        name: "Home",
        path: "/doctor/dashboard",
        icon: <FaHome />,
      },
      {
        name: "Appointments",
        path: "/doctor/appointments",
        icon: <FaClipboardList />,
      },
      {
        name: "Profile",
        path: `/doctor/profile/${localStorage.getItem("userId")}`,
        icon: <CgProfile />,
      },
    ];

    setMenuItems(
      userRole === "admin"
        ? adminMenu
        : userRole === "doctor"
          ? doctorMenu
          : userMenu,
    );
  }, [userRole]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getRoleColor = () => {
    switch (userRole) {
      case "admin":
        return "from-purple-500 to-pink-500";
      case "doctor":
        return "from-teal-500 to-cyan-600";
      default:
        return "from-blue-500 to-indigo-600";
    }
  };

  const getRoleBadgeColor = () => {
    switch (userRole) {
      case "admin":
        return "bg-purple-100 text-purple-700";
      case "doctor":
        return "bg-teal-100 text-teal-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const getRoleIcon = () => {
    switch (userRole) {
      case "admin":
        return "👑";
      case "doctor":
        return "👨‍⚕️";
      default:
        return "👤";
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins text-text">
      {/* Mobile Menu Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-deep-blue text-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col rounded-r-[2rem] lg:rounded-r-none lg:rounded-br-[2rem] relative overflow-hidden`}
        >
          {/* Decorational Circle */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          {/* Logo & Brand */}
          <div className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate("/")}
              >
                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-inner">
                  <FaStethoscope className="text-card-green text-xl" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-white">
                    MEDICINA
                  </h1>
                </div>
              </div>
              {/* Close button for mobile */}
              <button
                className="lg:hidden text-white/70 hover:text-white transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <FaTimes className="text-lg" />
              </button>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-4 overflow-y-auto overflow-x-hidden relative z-10">
            <div className="space-y-1">
              {menuItems.map((menu, index) => {
                const isActive = location.pathname === menu.path;
                return (
                  <Link
                    key={index}
                    to={menu.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                      isActive
                        ? "bg-white text-deep-blue shadow-md translate-x-1"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span
                      className={`text-lg relative z-10 transition-transform duration-300 ${isActive ? "scale-105" : "group-hover:scale-105"}`}
                    >
                      {menu.icon}
                    </span>
                    <span className="font-medium tracking-wide relative z-10 text-sm">
                      {menu.name}
                    </span>

                    {/* Active Indicator Dot */}
                    {isActive && (
                      <div className="absolute right-3 w-1.5 h-1.5 bg-card-green rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Logout Button */}
          <div className="p-4 relative z-10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-200 hover:bg-red-500/10 hover:text-red-100 rounded-xl transition-all duration-300 group border border-transparent hover:border-red-500/20"
            >
              <IoMdLogOut className="text-lg group-hover:rotate-12 transition-transform" />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 relative">
          {/* Top Navbar */}
          <header
            className={`bg-transparent z-30 transition-all duration-300 pt-4 px-6`}
          >
            <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 px-6 py-2.5 flex items-center justify-between">
              {/* Left: Mobile Menu Button */}
              <button
                className="lg:hidden text-deep-blue hover:text-deep-blue/80 p-1.5 mr-3"
                onClick={() => setSidebarOpen(true)}
              >
                <FaBars className="text-xl" />
              </button>

              {/* Center: Page Title - Hidden on Mobile */}
              <div className="hidden lg:block">
                <h2 className="text-lg font-bold text-deep-blue">
                  Welcome back,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-deep-blue to-blue-600">
                    {userName}
                  </span>
                </h2>
              </div>

              {/* Right: Notifications & Profile */}
              <div className="flex items-center gap-4">
                {/* Notifications */}
                <button
                  onClick={() => navigate("/notifications")}
                  className="relative p-2 text-gray-500 hover:text-deep-blue hover:bg-blue-50 rounded-xl transition-all group"
                >
                  <Badge
                    count={unseenNotifications.length}
                    style={{
                      backgroundColor: "#ff6b6b",
                      boxShadow: "0 0 0 2px white",
                      transform: "scale(0.8)",
                    }}
                  >
                    <IoIosNotificationsOutline className="text-2xl group-hover:scale-105 transition-transform" />
                  </Badge>
                </button>

                {/* Vertical Divider */}
                <div className="h-6 w-[1px] bg-gray-200 hidden md:block"></div>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-full hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                  >
                    {/* Avatar */}
                    <div
                      className={`w-9 h-9 bg-gradient-to-br ${getRoleColor()} rounded-full flex items-center justify-center text-sm text-white shadow-md ring-2 ring-white`}
                    >
                      {getRoleIcon()}
                    </div>

                    {/* Name & Role - Hidden on Mobile */}
                    <div className="hidden md:block text-left">
                      <p className="text-xs font-bold text-gray-800 leading-tight">
                        {userName}
                      </p>
                      <p className="text-[10px] text-gray-500 capitalize font-medium">
                        {userRole}
                      </p>
                    </div>

                    {/* Dropdown Icon */}
                    <FaChevronDown
                      className={`text-gray-400 text-[10px] transition-transform duration-200 ${profileDropdown ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100 py-2 z-50 overflow-hidden ring-1 ring-black/5">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 bg-gradient-to-br ${getRoleColor()} rounded-lg flex items-center justify-center text-sm text-white shadow-sm`}
                          >
                            {getRoleIcon()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-xs">
                              {userName}
                            </p>
                            <span
                              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${getRoleBadgeColor()}`}
                            >
                              {userRole}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="px-2 py-2 space-y-0.5">
                        <Link
                          to="/home"
                          onClick={() => setProfileDropdown(false)}
                          className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-deep-blue hover:bg-blue-50 rounded-xl transition-all group"
                        >
                          <div className="bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-deep-blue p-1.5 rounded-md transition-colors">
                            <FaHome className="text-xs" />
                          </div>
                          <span className="text-xs font-medium">Dashboard</span>
                        </Link>

                        {userRole === "doctor" ? (
                          <Link
                            to={`/doctor/profile/${localStorage.getItem("userId")}`}
                            onClick={() => setProfileDropdown(false)}
                            className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-deep-blue hover:bg-blue-50 rounded-xl transition-all group"
                          >
                            <div className="bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-deep-blue p-1.5 rounded-md transition-colors">
                              <CgProfile className="text-xs" />
                            </div>
                            <span className="text-xs font-medium">
                              My Profile
                            </span>
                          </Link>
                        ) : (
                          <Link
                            to={`/user/profile/${localStorage.getItem("userId")}`}
                            onClick={() => setProfileDropdown(false)}
                            className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-deep-blue hover:bg-blue-50 rounded-xl transition-all group"
                          >
                            <div className="bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-deep-blue p-1.5 rounded-md transition-colors">
                              <CgProfile className="text-xs" />
                            </div>
                            <span className="text-xs font-medium">
                              My Profile
                            </span>
                          </Link>
                        )}
                      </div>

                      {/* Logout */}
                      <div className="px-2 pb-2">
                        <button
                          onClick={() => {
                            setProfileDropdown(false);
                            handleLogout();
                          }}
                          className="flex items-center gap-3 w-full px-3 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-all group"
                        >
                          <div className="bg-red-50 text-red-400 group-hover:bg-white group-hover:text-red-500 p-1.5 rounded-md transition-colors">
                            <IoMdLogOut className="text-xs" />
                          </div>
                          <span className="text-xs font-bold">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4">
            <div className="h-full">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
