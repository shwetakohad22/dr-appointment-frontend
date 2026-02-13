import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaBell,
  FaCheckCircle,
  FaTrash,
  FaEye,
  FaInbox,
  FaClock,
  FaCircle,
} from "react-icons/fa";

const Notifications = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("unseen");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/user/get-user-by-id", {
        params: {
          userId: localStorage.getItem("userId"),
        },
      });
      if (res.data.success) {
        setUser(res.data.data);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const markAllAsSeen = async () => {
    try {
      const res = await api.post("/api/user/mark-all-notifications-as-seen", {
        userId: localStorage.getItem("userId"),
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setUser(res.data.data);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const deleteAll = async () => {
    try {
      const res = await api.post("/api/user/delete-all-notifications", {
        userId: localStorage.getItem("userId"),
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setUser(res.data.data);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const unseenCount = user?.unseenNotifications?.length || 0;
  const seenCount = user?.seenNotifications?.length || 0;

  return (
    <Layout>
      <div className="space-y-4 animate-fadeIn">
        {/* Header Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Notifications
              </h1>
              <p className="text-sm text-gray-500">
                Manage your notifications and stay updated
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-500">Unread</p>
                <p className="text-2xl font-bold text-deep-blue">
                  {unseenCount}
                </p>
              </div>
              <div className="h-12 w-px bg-gray-200"></div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-700">
                  {unseenCount + seenCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200 px-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveTab("unseen")}
                  className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === "unseen"
                      ? "border-deep-blue text-deep-blue"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Unread
                  {unseenCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-deep-blue text-white rounded-full text-xs font-bold">
                      {unseenCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("seen")}
                  className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === "seen"
                      ? "border-deep-blue text-deep-blue"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Read
                  {seenCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-gray-300 text-gray-700 rounded-full text-xs font-bold">
                      {seenCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Action Buttons */}
              <div>
                {activeTab === "unseen" && unseenCount > 0 && (
                  <button
                    onClick={markAllAsSeen}
                    className="flex items-center gap-2 px-4 py-2 text-deep-blue hover:bg-blue-50 text-sm font-medium rounded-lg transition-colors"
                  >
                    <FaCheckCircle className="text-xs" />
                    Mark all as read
                  </button>
                )}

                {activeTab === "seen" && seenCount > 0 && (
                  <button
                    onClick={deleteAll}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg transition-colors"
                  >
                    <FaTrash className="text-xs" />
                    Delete all
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex flex-col justify-center items-center py-20">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-deep-blue rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-500 mt-3 text-sm">
                  Loading notifications...
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {activeTab === "unseen" ? (
                  user?.unseenNotifications?.length > 0 ? (
                    user.unseenNotifications.map((notification, index) => (
                      <div
                        key={index}
                        onClick={() => navigate(notification.onClickPath)}
                        className="group relative bg-blue-50 hover:bg-blue-100 border border-blue-100 p-4 rounded-lg cursor-pointer transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            <FaCircle className="text-deep-blue text-xs" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900 text-sm font-medium leading-relaxed">
                              {notification.message}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <FaClock className="text-gray-400 text-xs" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaInbox className="text-gray-400 text-2xl" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        All caught up!
                      </h3>
                      <p className="text-sm text-gray-500">
                        You have no unread notifications
                      </p>
                    </div>
                  )
                ) : user?.seenNotifications?.length > 0 ? (
                  user.seenNotifications.map((notification, index) => (
                    <div
                      key={index}
                      onClick={() => navigate(notification.onClickPath)}
                      className="group relative bg-white hover:bg-gray-50 border border-gray-200 p-4 rounded-lg cursor-pointer transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {notification.message}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <FaClock className="text-gray-400 text-xs" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaEye className="text-gray-400 text-2xl" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      No read notifications
                    </h3>
                    <p className="text-sm text-gray-500">
                      Your read notifications will appear here
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Notifications;
