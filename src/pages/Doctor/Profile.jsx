import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { TimePicker } from "antd";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaStethoscope,
  FaBriefcase,
  FaDollarSign,
  FaClock,
  FaSave,
  FaUserMd,
  FaArrowRight,
} from "react-icons/fa";

const Profile = () => {
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const navigate = useNavigate();

  const getDoctorData = async () => {
    try {
      setDataLoading(true);
      const userId = localStorage.getItem("userId");
      const response = await axios.post(
        "http://localhost:8001/api/doctor/get-doctor-info-by-id",
        {
          userId: userId,
        },
      );
      setDoctorInfo(response.data.data);
    } catch (error) {
      console.error("Error fetching doctor data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    specialization: "",
    experience: "",
    feePerCunsultation: "",
    timing: [],
  });

  useEffect(() => {
    if (doctorInfo) {
      setFormData(doctorInfo);
    }
  }, [doctorInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTimeChange = (value) => {
    setFormData({
      ...formData,
      timing: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "/api/doctor/update-doctor-profile",
        formData,
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/home");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating doctor profile:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center py-20 bg-white rounded-xl">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-card-yellow border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaUserMd className="text-deep-blue text-lg" />
            </div>
          </div>
          <p className="text-gray-500 mt-3 text-sm font-medium">
            Loading profile...
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4 animate-fadeIn">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-deep-blue to-blue-900 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FaUserMd className="text-xl" />
            </div>
            <h1 className="text-2xl font-bold">Doctor Profile</h1>
          </div>
          <p className="text-blue-100 text-sm">
            Update your professional information and settings
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Personal Information Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-card-pink rounded-lg flex items-center justify-center">
                  <FaUser className="text-deep-blue text-sm" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">
                  Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="text-sm font-semibold text-gray-800 block mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-deep-blue focus:ring-4 focus:ring-deep-blue/10 transition-all outline-none text-gray-800 text-sm placeholder:text-gray-400 shadow-sm hover:border-gray-400"
                    placeholder="Enter first name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="text-sm font-semibold text-gray-800 block mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-deep-blue focus:ring-4 focus:ring-deep-blue/10 transition-all outline-none text-gray-800 text-sm placeholder:text-gray-400 shadow-sm hover:border-gray-400"
                    placeholder="Enter last name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Phone Number */}
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-800 block mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-deep-blue focus:ring-4 focus:ring-deep-blue/10 transition-all outline-none text-gray-800 text-sm placeholder:text-gray-400 shadow-sm hover:border-gray-400"
                    placeholder="Enter phone number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-800 block mb-2">
                    Clinic Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows="3"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-deep-blue focus:ring-4 focus:ring-deep-blue/10 transition-all outline-none text-gray-800 text-sm placeholder:text-gray-400 resize-none shadow-sm hover:border-gray-400"
                    placeholder="Enter your clinic address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Professional Information Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <FaStethoscope className="text-white text-sm" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">
                  Professional Details
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Specialization */}
                <div>
                  <label className="text-sm font-semibold text-gray-800 block mb-2">
                    Specialization <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-deep-blue focus:ring-4 focus:ring-deep-blue/10 transition-all outline-none text-gray-800 text-sm placeholder:text-gray-400 shadow-sm hover:border-gray-400"
                    placeholder="e.g., Cardiology, Pediatrics"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="text-sm font-semibold text-gray-800 block mb-2">
                    Experience (Years) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-deep-blue focus:ring-4 focus:ring-deep-blue/10 transition-all outline-none text-gray-800 text-sm placeholder:text-gray-400 shadow-sm hover:border-gray-400"
                    placeholder="Enter years of experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Fee per Consultation */}
                <div>
                  <label className="text-sm font-semibold text-gray-800 block mb-2">
                    Consultation Fee ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-deep-blue focus:ring-4 focus:ring-deep-blue/10 transition-all outline-none text-gray-800 text-sm placeholder:text-gray-400 shadow-sm hover:border-gray-400"
                    placeholder="Enter consultation fee"
                    name="feePerCunsultation"
                    value={formData.feePerCunsultation}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Timings */}
                <div>
                  <label className="text-sm font-semibold text-gray-800 block mb-2">
                    Available Timings <span className="text-red-500">*</span>
                  </label>
                  <TimePicker.RangePicker
                    className="w-full custom-time-picker"
                    value={formData.timing}
                    onChange={(value) => handleTimeChange(value)}
                    format="HH:mm"
                    size="large"
                  />
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border-l-4 border-deep-blue rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FaUserMd className="text-deep-blue text-lg mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-deep-blue mb-1">
                    Profile Update
                  </h3>
                  <p className="text-xs text-gray-600">
                    Make sure all your information is accurate and up-to-date.
                    Changes will be reflected in your public profile immediately
                    after saving.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/home")}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-deep-blue text-white font-bold rounded-lg hover:bg-blue-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg text-sm"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FaSave className="text-xs" />
                    <span>Save Changes</span>
                    <div className="bg-white/20 p-0.5 rounded-full">
                      <FaArrowRight className="text-xs" />
                    </div>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Custom TimePicker Styles */}
      <style jsx global>{`
        .custom-time-picker .ant-picker {
          width: 100% !important;
          padding: 12px 16px !important;
          background: white !important;
          border: 1px solid #d1d5db !important;
          border-radius: 12px !important;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
          transition: all 0.2s !important;
        }
        .custom-time-picker .ant-picker:hover {
          border-color: #9ca3af !important;
        }
        .custom-time-picker .ant-picker-focused {
          border-color: #1e3a5f !important;
          box-shadow: 0 0 0 4px rgba(30, 58, 95, 0.1) !important;
        }
        .custom-time-picker .ant-picker-input > input {
          font-size: 14px !important;
          color: #1f2937 !important;
        }
        .custom-time-picker .ant-picker-input > input::placeholder {
          color: #9ca3af !important;
        }
        .custom-time-picker .ant-picker-suffix {
          color: #6b7280 !important;
        }
      `}</style>
    </Layout>
  );
};

export default Profile;
