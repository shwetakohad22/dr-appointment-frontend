import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaSave, FaArrowRight } from "react-icons/fa";

const UserProfile = () => {
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const getUserData = async () => {
    try {
      setDataLoading(true);
      const userId = localStorage.getItem("userId");
      const response = await api.get(`/api/user/get-user-by-id`, {
        params: { userId },
      });
      if (response.data.success) {
        setFormData({
          name: response.data.data.name,
          email: response.data.data.email,
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      const response = await api.post("/api/user/update-profile", {
        ...formData,
        userId,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        // navigate("/home");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-deep-blue to-blue-900 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-inner border border-white/10">
              <FaUser className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
              <p className="text-blue-100 text-sm font-medium">
                Manage your personal information and account settings
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Profile Card / Avatar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col items-center text-center h-full">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-xl ring-4 ring-blue-50">
                <span className="text-4xl text-white font-bold">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                {formData.name}
              </h2>
              <p className="text-sm text-gray-500 mb-6">{formData.email}</p>

              <div className="w-full border-t border-gray-100 pt-6 mt-auto">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Account Type</span>
                  <span className="font-semibold text-deep-blue bg-blue-50 px-3 py-1 rounded-full uppercase text-xs tracking-wider">
                    User
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Member Since</span>
                  <span className="font-semibold">2024</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                  <FaUser className="text-sm" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">
                  Edit Details
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-deep-blue focus:ring-4 focus:ring-deep-blue/10 transition-all outline-none text-gray-800 text-sm placeholder:text-gray-400 font-medium"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-400 cursor-not-allowed outline-none text-sm font-medium"
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        Read-only
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end items-center gap-4">
                  <button
                    type="button"
                    onClick={() => navigate("/home")}
                    className="px-6 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-700 font-medium transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-deep-blue to-blue-700 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <FaSave /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
