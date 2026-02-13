import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  FaArrowRight,
  FaClipboardCheck,
  FaStethoscope,
  FaUser,
  FaUserMd,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const ApplyDoctor = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    specialization: "",
    experience: "",
    feePerCunsultation: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = localStorage.getItem("userId");

      // Create FormData object for file upload
      const formDataToSend = new FormData();

      // Append all form fields
      formDataToSend.append("userId", userId);
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("phoneNumber", formData.phoneNumber);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("specialization", formData.specialization);
      formDataToSend.append("experience", formData.experience);
      formDataToSend.append("feePerCunsultation", formData.feePerCunsultation);

      // Append image if provided
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await axios.post(
        "http://localhost:8001/api/user/apply-doctor-account",
        formDataToSend,
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/home");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error applying for doctor:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-4 animate-fadeIn">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-deep-blue to-blue-900 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FaUserMd className="text-xl" />
            </div>
            <h1 className="text-2xl font-bold">Apply as Doctor</h1>
          </div>
          <p className="text-blue-100 text-sm">
            Fill in your details to join our network of expert healthcare
            providers
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
                <div className="w-8 h-8 bg-card-green rounded-lg flex items-center justify-center">
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

                {/* Profile Image */}
                <div>
                  <label className="text-sm font-semibold text-gray-800 block mb-2">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-deep-blue focus:ring-4 focus:ring-deep-blue/10 transition-all outline-none text-gray-800 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-deep-blue file:text-white hover:file:bg-blue-900 shadow-sm hover:border-gray-400"
                  />
                  {formData.image && (
                    <p className="text-xs text-gray-500 mt-1">
                      Selected: {formData.image.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border-l-4 border-deep-blue rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FaClipboardCheck className="text-deep-blue text-lg mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-deep-blue mb-1">
                    Application Review Process
                  </h3>
                  <p className="text-xs text-gray-600">
                    Your application will be reviewed by our admin team. You'll
                    receive a notification once your account is approved. This
                    typically takes 1-2 business days.
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
                  <span className="animate-pulse">Submitting...</span>
                ) : (
                  <>
                    <span>Submit Application</span>
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
    </Layout>
  );
};

export default ApplyDoctor;
