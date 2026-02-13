import axios from "axios";
import { useEffect, useState } from "react";
import {
  FaAward,
  FaCalendarCheck,
  FaClock,
  FaHeart,
  FaHospital,
  FaSearch,
  FaStar,
  FaStethoscope,
  FaUserMd
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8001/api/user/get-all-approved-doctors",
        );
        setDoctors(response.data.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const handleDoctorClick = (doctorId) => {
    localStorage.setItem("selectedDoctorId", doctorId);
  };

  // Filter doctors based on search term and specialty
  const filteredDoctors = doctors.filter((doctor) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      doctor.firstName?.toLowerCase().includes(searchLower) ||
      doctor.lastName?.toLowerCase().includes(searchLower) ||
      doctor.specialization?.toLowerCase().includes(searchLower);
    
    const matchesSpecialty = 
      selectedSpecialty === "All" || 
      doctor.specialization === selectedSpecialty;

    return matchesSearch && matchesSpecialty;
  });

  // Get unique specializations
  const specializations = [
    "All",
    ...new Set(doctors.map((d) => d.specialization).filter(Boolean)),
  ];

  // Doctor images for variety
  const doctorImages = [
    "https://img.freepik.com/free-photo/portrait-smiling-medical-worker-girl-doctor-white-coat-stethoscope-pointing-fingers-upper-l_1258-88339.jpg",
    "https://media.istockphoto.com/id/1189304032/photo/doctor-holding-digital-tablet-at-meeting-room.jpg?s=612x612&w=0&k=20&c=RtQn8w_vhzGYbflSa1B5ea9Ji70O8wHpSgGBSh0anUg=",
    "https://t4.ftcdn.net/jpg/02/60/04/09/360_F_260040900_oO6YW1sHTnKxby4GcjCvtypUCWjnXVg5.jpg",
    "https://st2.depositphotos.com/3889193/6758/i/450/depositphotos_67580685-stock-photo-smiling-doctor-with-stethoscope.jpg",
  ];

  return (
    <Layout>
      <div className="space-y-3 animate-fadeIn">
        {/* Hero Section with Search and Stats Cards - Side by Side - COMPACT HEIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          {/* Left: Hero Section - 3 columns - REDUCED HEIGHT */}
          <div className="lg:col-span-3 relative bg-gradient-to-br from-deep-blue via-deep-blue to-blue-900 rounded-2xl p-6 text-white overflow-hidden h-[200px] flex flex-col justify-center">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 left-10 w-60 h-60 bg-card-pink rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <h1 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">
                Find Your Perfect
                <span className="block text-card-yellow">Healthcare Provider</span>
              </h1>
              <p className="text-blue-100 text-xs mb-4 max-w-2xl">
                Connect with verified doctors, book appointments instantly, and manage your health journey all in one place.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400 text-sm" />
                </div>
                <input
                  type="text"
                  placeholder="Search by doctor name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/95 backdrop-blur-sm border-none rounded-xl focus:ring-2 focus:ring-card-yellow/30 transition-all outline-none text-gray-800 text-sm font-medium shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Right: Stats Cards - 1 column, stacked vertically - MATCHING HEIGHT 200px */}
          <div className="lg:col-span-1 grid grid-cols-3 lg:grid-cols-1 gap-2 h-[200px]">
            <div className="bg-gradient-to-br from-card-yellow to-yellow-400 rounded-xl p-2.5 text-deep-blue shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 bg-white/30 rounded-lg flex items-center justify-center">
                  <FaUserMd className="text-sm" />
                </div>
                <span className="text-[8px] font-bold bg-white/40 px-1.5 py-0.5 rounded-full">
                  Active
                </span>
              </div>
              <div>
                <p className="text-xl font-bold mb-0">{doctors.length}</p>
                <p className="text-[9px] font-medium opacity-90">Expert Doctors</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-2.5 text-white shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 bg-white/30 rounded-lg flex items-center justify-center">
                  <FaStethoscope className="text-sm" />
                </div>
                <span className="text-[8px] font-bold bg-white/40 px-1.5 py-0.5 rounded-full">
                  Available
                </span>
              </div>
              <div>
                <p className="text-xl font-bold mb-0">{specializations.length - 1}</p>
                <p className="text-[9px] font-medium opacity-90">Specializations</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-card-pink to-pink-400 rounded-xl p-2.5 text-deep-blue shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 bg-white/30 rounded-lg flex items-center justify-center">
                  <FaCalendarCheck className="text-sm" />
                </div>
                <span className="text-[8px] font-bold bg-white/40 px-1.5 py-0.5 rounded-full">
                  24/7
                </span>
              </div>
              <div>
                <p className="text-xl font-bold mb-0">Instant</p>
                <p className="text-[9px] font-medium opacity-90">Booking Available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Pills - COMPACT */}
        <div className="bg-white rounded-xl p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <FaHospital className="text-deep-blue text-sm" />
            <h3 className="text-xs font-bold text-gray-800">Filter by Specialty</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {specializations.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedSpecialty === spec
                    ? "bg-deep-blue text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {/* Results Header - COMPACT */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <FaAward className="text-card-yellow text-sm" />
              Available Doctors
            </h2>
            <p className="text-[10px] text-gray-500">
              Showing {filteredDoctors.length} of {doctors.length} doctors
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-12 bg-white rounded-xl">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-card-yellow border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaStethoscope className="text-deep-blue text-lg" />
              </div>
            </div>
            <p className="text-gray-500 mt-3 text-sm font-medium">Loading doctors...</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          /* Empty State */
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-10 text-center border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaSearch className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {searchTerm || selectedSpecialty !== "All" 
                ? "No Doctors Found" 
                : "No Doctors Available"}
            </h3>
            <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
              {searchTerm
                ? `No results found for "${searchTerm}" ${selectedSpecialty !== "All" ? `in ${selectedSpecialty}` : ""}`
                : selectedSpecialty !== "All"
                ? `No doctors available in ${selectedSpecialty} specialty`
                : "Check back later for available doctors"}
            </p>
            {(searchTerm || selectedSpecialty !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSpecialty("All");
                }}
                className="px-5 py-2 bg-deep-blue text-white text-sm font-medium rounded-lg hover:bg-blue-900 transition-colors shadow-md"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          /* Doctors Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDoctors.map((doctor, index) => (
              <Link
                key={doctor._id}
                to={`/book-appointment/${doctor._id}`}
                className="block group"
                onClick={() => handleDoctorClick(doctor._id)}
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-deep-blue/20 group-hover:-translate-y-1">
                  {/* Doctor Image - REDUCED HEIGHT */}
                  <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                    <img
                      src={doctorImages[index % doctorImages.length]}
                      alt={`Dr. ${doctor.firstName}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Verified Badge */}
                    <div className="absolute top-2 right-2 bg-gradient-to-br from-emerald-500 to-teal-500 text-white p-1.5 rounded-full shadow-lg">
                      <MdVerified className="text-sm" />
                    </div>
                    {/* Specialty Badge */}
                    <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full shadow-lg">
                      <p className="text-[10px] font-bold text-deep-blue">
                        {doctor.specialization || "General"}
                      </p>
                    </div>
                  </div>

                  {/* Doctor Info - COMPACT */}
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-gray-900 mb-0.5 group-hover:text-deep-blue transition-colors line-clamp-1">
                      Dr. {doctor.firstName} {doctor.lastName}
                    </h3>
                    
                    <div className="flex items-center gap-1 text-[11px] text-gray-600 mb-2">
                      <FaStethoscope className="text-gray-400 text-[9px]" />
                      <span className="line-clamp-1">{doctor.specialization || "General Physician"}</span>
                    </div>

                    {/* Stats Row - COMPACT */}
                    <div className="flex items-center justify-between text-[10px] text-gray-500 mb-2 pb-2 border-b border-gray-100">
                      <div className="flex items-center gap-0.5">
                        <FaStar className="text-card-yellow text-[9px]" />
                        <span className="font-medium">4.8</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <FaClock className="text-gray-400 text-[9px]" />
                        <span>15 min</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <FaHeart className="text-pink-400 text-[9px]" />
                        <span>250+</span>
                      </div>
                    </div>

                    {/* Book Button - COMPACT */}
                    <button className="w-full bg-deep-blue text-white py-1.5 rounded-lg text-xs font-medium group-hover:bg-blue-900 transition-colors shadow-sm">
                      Book Appointment
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Home;