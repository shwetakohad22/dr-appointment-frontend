import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  FaStethoscope,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaGraduationCap,
  FaAward,
  FaCheckCircle,
  FaArrowRight,
  FaUserMd,
  FaHospital,
  FaDollarSign,
  FaStar,
} from "react-icons/fa";
import { MdVerified, MdAccessTime } from "react-icons/md";

const BookAppointment = () => {
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const getDoctorData = async () => {
      try {
        const doctorId = localStorage.getItem("selectedDoctorId");
        if (doctorId) {
          const response = await api.post("/api/doctor/get-doctor-id", {
            doctorId: doctorId,
          });
          setDoctorInfo(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    getDoctorData();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const bookAppointment = async () => {
    setBookingLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      const userRes = await api.get(`/api/user/get-user-by-id`, {
        params: { userId },
      });

      const response = await api.post("/api/user/book-appointment", {
        userId: userId,
        doctorId: doctorInfo._id,
        doctorInfo: doctorInfo,
        userInfo: userRes.data.data || {},
        date: selectedDate,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/appointments");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Error booking appointment");
    } finally {
      setBookingLoading(false);
    }
  };

  const doctorImages = [
    "https://img.freepik.com/free-photo/portrait-smiling-medical-worker-girl-doctor-white-coat-stethoscope-pointing-fingers-upper-l_1258-88339.jpg",
    "https://media.istockphoto.com/id/1189304032/photo/doctor-holding-digital-tablet-at-meeting-room.jpg?s=612x612&w=0&k=20&c=RtQn8w_vhzGYbflSa1B5ea9Ji70O8wHpSgGBSh0anUg=",
    "https://t4.ftcdn.net/jpg/02/60/04/09/360_F_260040900_oO6YW1sHTnKxby4GcjCvtypUCWjnXVg5.jpg",
  ];

  if (!doctorInfo) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center py-20 bg-white rounded-2xl">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-card-yellow border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaStethoscope className="text-deep-blue text-xl" />
            </div>
          </div>
          <p className="text-gray-500 mt-4 font-medium">
            Loading doctor details...
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-3 animate-fadeIn">
        {/* Header with Back Button */}
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 text-gray-600 hover:text-deep-blue transition-colors text-sm font-medium group"
        >
          <FaArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform text-sm" />
          Back to Doctors
        </button>

        {/* Doctor Profile Card - EXTRA COMPACT */}
        <div className="bg-gradient-to-br from-deep-blue to-blue-900 rounded-2xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Left: Doctor Image */}
            <div className="relative h-64 lg:h-auto bg-gradient-to-br from-gray-100 to-gray-50">
              <img
                src={
                  doctorImages[Math.floor(Math.random() * doctorImages.length)]
                }
                alt={`Dr. ${doctorInfo.firstName}`}
                className="w-full h-full object-cover"
              />
              {/* Verified Badge */}
              <div className="absolute top-3 right-3 bg-card-green text-white p-2 rounded-full shadow-lg">
                <MdVerified className="text-base" />
              </div>
            </div>

            {/* Center & Right: Doctor Info - EXTRA COMPACT */}
            <div className="lg:col-span-2 p-4 md:p-5 text-white">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full mb-2">
                <FaStethoscope className="text-card-yellow text-xs" />
                <span className="text-[10px] font-medium">
                  {doctorInfo.specialization || "General Physician"}
                </span>
              </div>

              {/* Name & Title */}
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Dr. {doctorInfo.firstName} {doctorInfo.lastName}
              </h1>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-2 mb-3">
                <div className="flex items-center gap-1.5 text-xs">
                  <FaStar className="text-card-yellow text-[10px]" />
                  <span>4.9 (250+ reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <MdAccessTime className="text-card-green text-[10px]" />
                  <span>Available Today</span>
                </div>
              </div>

              {/* Info Grid - EXTRA COMPACT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaPhoneAlt className="text-[10px]" />
                    </div>
                    <div>
                      <p className="text-[9px] text-blue-200">Phone Number</p>
                      <p className="font-bold text-xs">
                        {doctorInfo.phoneNumber || "+1 (555) 123-4567"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaDollarSign className="text-[10px]" />
                    </div>
                    <div>
                      <p className="text-[9px] text-blue-200">
                        Consultation Fee
                      </p>
                      <p className="font-bold text-xs">
                        ${doctorInfo.feePerCunsultation || "50"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address - EXTRA COMPACT */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5">
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="text-[10px]" />
                  </div>
                  <div>
                    <p className="text-[9px] text-blue-200 mb-0.5">
                      Clinic Address
                    </p>
                    <p className="font-medium text-xs">
                      {doctorInfo.address ||
                        "123 Medical Center, Healthcare District, NY 10001"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Section - EXTRA COMPACT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Date Selection - COMPACT WITHOUT INLINE */}
          <div className="lg:col-span-2 bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 bg-card-pink rounded-lg flex items-center justify-center">
                <FaCalendarAlt className="text-deep-blue text-sm" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800">
                  Select Appointment Date
                </h3>
                <p className="text-[10px] text-gray-500">
                  Choose your preferred date
                </p>
              </div>
            </div>

            {/* Compact Date Picker with Inline Calendar */}
            <div className="bg-gray-50 rounded-lg p-3">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                minDate={new Date()}
                dateFormat="MMMM d, yyyy"
                inline
                calendarClassName="compact-calendar"
              />
            </div>
          </div>

          {/* Booking Summary - EXTRA COMPACT */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FaCheckCircle className="text-card-green text-sm" />
                Booking Summary
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                  <FaUserMd className="text-deep-blue mt-0.5 text-xs" />
                  <div className="flex-1">
                    <p className="text-[9px] text-gray-500 mb-0.5">Doctor</p>
                    <p className="font-bold text-gray-800 text-xs">
                      Dr. {doctorInfo.firstName} {doctorInfo.lastName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                  <FaStethoscope className="text-card-pink mt-0.5 text-xs" />
                  <div className="flex-1">
                    <p className="text-[9px] text-gray-500 mb-0.5">
                      Specialization
                    </p>
                    <p className="font-bold text-gray-800 text-xs">
                      {doctorInfo.specialization || "General Physician"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                  <FaCalendarAlt className="text-card-yellow mt-0.5 text-xs" />
                  <div className="flex-1">
                    <p className="text-[9px] text-gray-500 mb-0.5">Date</p>
                    <p className="font-bold text-gray-800 text-xs">
                      {selectedDate
                        ? selectedDate.toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Not selected"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2 bg-gradient-to-br from-deep-blue to-blue-900 text-white rounded-lg">
                  <FaDollarSign className="mt-0.5 text-xs" />
                  <div className="flex-1">
                    <p className="text-[9px] opacity-75 mb-0.5">
                      Consultation Fee
                    </p>
                    <p className="text-lg font-bold">
                      ${doctorInfo.feePerCunsultation || "50"}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={bookAppointment}
                disabled={!selectedDate || bookingLoading}
                className="w-full bg-deep-blue text-white py-2.5 rounded-lg font-bold hover:bg-blue-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-xs"
              >
                {bookingLoading ? (
                  <span className="animate-pulse">Booking...</span>
                ) : (
                  <>
                    <span>Confirm Booking</span>
                    <div className="bg-white/20 p-0.5 rounded-full">
                      <FaArrowRight className="text-[10px]" />
                    </div>
                  </>
                )}
              </button>

              <p className="text-[9px] text-gray-500 text-center mt-2">
                You will receive a confirmation via email
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom DatePicker Styles - COMPACT */}
      <style jsx global>{`
        .compact-calendar {
          font-family: inherit;
          font-size: 0.875rem;
        }
        .react-datepicker {
          border: none;
          box-shadow: none;
          font-size: 0.875rem;
        }
        .react-datepicker__month-container {
          width: 100%;
        }
        .react-datepicker__header {
          background-color: #1e3a5f;
          border-bottom: none;
          padding: 0.5rem 0;
          border-radius: 0.5rem 0.5rem 0 0;
        }
        .react-datepicker__current-month {
          color: white;
          font-size: 0.875rem;
          font-weight: 600;
          padding: 0.25rem 0;
        }
        .react-datepicker__day-names {
          margin-top: 0.5rem;
        }
        .react-datepicker__day-name {
          color: white;
          font-size: 0.75rem;
          width: 2rem;
          line-height: 2rem;
          margin: 0.15rem;
        }
        .react-datepicker__month {
          margin: 0.5rem;
        }
        .react-datepicker__week {
          display: flex;
          justify-content: space-between;
        }
        .react-datepicker__day {
          color: #374151;
          border-radius: 0.375rem;
          width: 2rem;
          line-height: 2rem;
          margin: 0.15rem;
          font-size: 0.75rem;
        }
        .react-datepicker__day:hover {
          background-color: #f3f4f6;
          border-radius: 0.375rem;
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background-color: #1e3a5f;
          color: white;
          border-radius: 0.375rem;
          font-weight: 600;
        }
        .react-datepicker__day--today {
          font-weight: bold;
          color: #1e3a5f;
          background-color: #fef3c7;
          border-radius: 0.375rem;
        }
        .react-datepicker__day--disabled {
          color: #d1d5db;
          cursor: not-allowed;
        }
        .react-datepicker__day--disabled:hover {
          background-color: transparent;
        }
        .react-datepicker__navigation {
          top: 0.5rem;
          width: 1.5rem;
          height: 1.5rem;
          border: none;
        }
        .react-datepicker__navigation-icon::before {
          border-color: white;
          border-width: 2px 2px 0 0;
          height: 6px;
          width: 6px;
          top: 6px;
        }
        .react-datepicker__navigation:hover *::before {
          border-color: #fef3c7;
        }
      `}</style>
    </Layout>
  );
};

export default BookAppointment;
