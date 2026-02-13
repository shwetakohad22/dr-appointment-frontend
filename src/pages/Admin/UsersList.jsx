import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaSearch,
  FaUsers,
} from "react-icons/fa";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const getUsersData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/admin/get-all-users");
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsersData();
  }, []);

  // Filter users
  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Layout>
      <div className="space-y-3 animate-fadeIn">
        {/* Header Section - COMPACT */}
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-0.5">
                Users Management
              </h1>
              <p className="text-xs text-gray-500">
                View and manage all registered users
              </p>
            </div>

            {/* Stats Card - Compact */}
            <div className="text-center p-2 bg-gradient-to-br from-deep-blue to-blue-900 rounded-lg shadow-sm min-w-[100px]">
              <p className="text-[10px] text-white/90 mb-0.5 font-medium">
                Total Users
              </p>
              <p className="text-xl font-bold text-white">{users.length}</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400 text-sm" />
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue transition-all outline-none text-sm"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 bg-white rounded-xl border border-gray-100">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-deep-blue rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-500 mt-3 text-sm">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-xl p-16 text-center border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No Users Found
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {searchTerm
                ? `No results found for "${searchTerm}"`
                : "No users registered yet"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-5 py-2 bg-deep-blue text-white text-sm font-medium rounded-lg hover:bg-blue-900 transition-colors shadow-md"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          /* Users Table */
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Registered
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* User Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-deep-blue to-blue-900 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                            <span className="font-bold text-sm">
                              {user.name?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {user.name}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <FaEnvelope className="text-gray-400 text-xs" />
                          <span>{user.email}</span>
                        </div>
                      </td>

                      {/* Created At */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <FaCalendarAlt className="text-gray-400 text-xs" />
                          <span>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Count */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-700">
                  {filteredUsers.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-700">
                  {users.length}
                </span>{" "}
                users
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UsersList;
