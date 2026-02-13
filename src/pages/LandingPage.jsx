import axios from "axios";
import { useEffect, useState } from "react";
import {
  FaAngleDown,
  FaArrowRight,
  FaCheckCircle,
  FaFlask,
  FaMapMarkerAlt,
  FaPills,
  FaSearch,
  FaShoppingCart,
  FaStethoscope,
  FaUser,
  FaVideo,
  FaGooglePlay,
  FaApple,
} from "react-icons/fa";
import { MdHealthAndSafety, MdOutlineMedicalServices } from "react-icons/md";
import { RiMentalHealthLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import doctorImage from "../images/doctorImage.png";

const LandingPage = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8001/api/user/get-all-approved-doctors",
        );
        if (response.data.success) {
          setDoctors(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  const services = [
    {
      title: "Instant Video Consultation",
      desc: "Connect within 60 secs",
      icon: <FaVideo className="text-4xl mb-4 text-yellow-600" />,
      color: "bg-card-yellow",
      btnColor: "bg-yellow-600",
    },
    {
      title: "Find Doctors near you",
      desc: "Confirmed appointments",
      icon: <FaStethoscope className="text-4xl mb-4 text-green-600" />,
      color: "bg-card-green",
      btnColor: "bg-green-600",
    },
    {
      title: "24/7 Medicines",
      desc: "Essentials at your doorstep",
      icon: <FaPills className="text-4xl mb-4 text-pink-600" />,
      color: "bg-card-pink",
      btnColor: "bg-pink-600",
    },
    {
      title: "Lab Tests",
      desc: "Sample pickup at your home",
      icon: <FaFlask className="text-4xl mb-4 text-blue-600" />,
      color: "bg-card-blue",
      btnColor: "bg-blue-600",
    },
  ];

  const specialties = [
    { name: "Orthopedics", icon: <MdHealthAndSafety /> },
    { name: "Nutrition", icon: <FaCheckCircle /> },
    { name: "Pediatrics", icon: <MdOutlineMedicalServices /> },
    { name: "Neurology", icon: <RiMentalHealthLine /> },
    { name: "Cardiology", icon: <FaStethoscope /> },
    { name: "Ophthalmology", icon: <FaUser /> },
  ];

  // Static doctor images for variety
  const doctorImages = [
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop",
  ];

  // Find a doctor with an image for the hero section, or use the first one
  const heroDoctor = doctors.find((d) => d.image) || doctors[0] || {};
  const heroImage = heroDoctor.image || doctorImage;

  return (
    <div className="min-h-screen bg-white font-poppins text-text">
      {/* Header */}
      <header className="py-4 px-8 flex items-center justify-between bg-white sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2 text-2xl font-bold text-deep-blue">
            <span className="text-3xl">🩺</span> MediCare
          </div>

          {/* Location */}
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
            <FaMapMarkerAlt />
            <div>
              <p className="text-xs">Select Location</p>
              <p className="font-semibold text-gray-800 flex items-center gap-1 cursor-pointer">
                New York <FaAngleDown />
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 w-96">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Medicine and healthcare items"
              className="bg-transparent border-none outline-none w-full text-sm"
            />
          </div>
        </div>

        {/* Right Menu */}
        <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
          <div className="hidden md:flex items-center gap-1 cursor-pointer">
            <span className="bg-orange-100 text-orange-600 text-xs px-1 rounded">
              New
            </span>
            Healthcare Services <FaAngleDown />
          </div>
          <div className="hidden md:flex items-center gap-1 cursor-pointer text-orange-500">
            <FaCheckCircle /> Offer
          </div>
          <div className="flex items-center gap-1 cursor-pointer">
            <FaShoppingCart /> Cart
          </div>
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
          >
            <FaUser /> Login
          </button>
        </div>
      </header>

      <main className="px-4 md:px-8 pb-12">
        {/* Hero Section */}
        <section className="mt-6 rounded-[2.5rem] bg-deep-blue text-white relative overflow-hidden h-[500px] flex items-center">
          {/* Large Background Text */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center z-0 pointer-events-none">
            <h1 className="text-[10rem] md:text-[13rem] font-bold opacity-10 leading-none tracking-tighter select-none">
              Healthcare
            </h1>
          </div>

          <div className="container mx-auto px-12 relative z-10 flex flex-col md:flex-row items-center justify-between h-full">
            {/* Left Content */}
            <div className="md:w-1/3 space-y-6">
              <p className="text-lg md:text-xl font-light leading-relaxed max-w-xs">
                IF YOU'RE LOOKING FOR A SMART AND SIMPLE WAY TO MANAGE
                HEALTHCARE, MEDICINA IS THE PERFECT SOLUTION.
              </p>
            </div>

            {/* Center Image - Using Real Doctor Image */}
            <div className="md:w-1/3 flex justify-center h-full items-end relative">
              <img
                src={doctorImage}
                alt="Featured Doctor"
                className="h-[90%] object-contain z-10 drop-shadow-2xl"
              />
              {/* Floating Badges - Fixed Positioning */}
              <div className="absolute top-20 left-[-20px] bg-white/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-sm shadow-lg">
                <span className="bg-white text-deep-blue p-1.5 rounded-full">
                  <FaCheckCircle className="text-xs" />
                </span>
                <span className="font-medium">Reduce HbA1c</span>
              </div>
              <div className="absolute top-20 right-[-20px] bg-white/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-sm shadow-lg">
                <span className="bg-emerald-400 text-white p-1.5 rounded-full">
                  <FaPills className="text-xs" />
                </span>
                <span className="font-medium">No more medications</span>
              </div>
            </div>

            {/* Right Content */}
            <div className="md:w-1/3 flex justify-end items-center">
              <button
                onClick={() => navigate("/login")}
                className="bg-card-pink text-deep-blue font-semibold px-6 py-3 rounded-full flex items-center gap-3 transition-transform hover:scale-105"
              >
                Book Consultation
                <span className="bg-deep-blue text-white rounded-full p-1">
                  <FaArrowRight />
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className={`${service.color} p-8 rounded-[2rem] h-64 flex flex-col justify-between relative group overflow-hidden transition-all hover:shadow-lg`}
            >
              <div>
                <h3 className="text-xl font-bold text-gray-800 leading-tight mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm">{service.desc}</p>
              </div>
              <div className="flex justify-between items-end mt-4">
                <div className="opacity-80 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <button
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${service.btnColor}`}
                >
                  <FaArrowRight />
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Doctor Listing Section */}
        <section className="mt-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-deep-blue mb-6">
              Book an appointment for an <br /> in-clinic consultation
            </h2>

            {/* Specialties Chips */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {specialties.map((spec, index) => (
                <button
                  key={index}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-nowrap transition-colors whitespace-nowrap ${
                    index === 0
                      ? "bg-deep-blue text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span className="text-lg">{spec.icon}</span> {spec.name}
                </button>
              ))}
            </div>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.length > 0 ? (
              doctors.map((doctor, index) => (
                <div
                  key={doctor._id}
                  className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
                  onClick={() => navigate(`/book-appointment/${doctor._id}`)}
                >
                  <div className="bg-gray-50 rounded-2xl h-64 flex items-end justify-center overflow-hidden mb-4 relative">
                    <img
                      src={
                        doctor.image ||
                        doctorImages[index % doctorImages.length]
                      }
                      alt={`Dr. ${doctor.firstName}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      Dr. {doctor.firstName} {doctor.lastName}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {doctor.specialization || "General Physician"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-10 text-gray-500">
                Loading doctors...
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 px-4 md:px-8 pb-8 space-y-6">
        {/* Top Section - Links & Apps */}
        <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Company Column */}
            <div>
              <h4 className="font-bold text-gray-900 mb-6">Company</h4>
              <ul className="space-y-4 text-gray-500 text-sm">
                <li className="hover:text-deep-blue cursor-pointer">
                  What's New
                </li>
                <li className="hover:text-deep-blue cursor-pointer">About</li>
                <li className="hover:text-deep-blue cursor-pointer">Press</li>
                <li className="hover:text-deep-blue cursor-pointer">Careers</li>
                <li className="hover:text-deep-blue cursor-pointer">
                  Social Good
                </li>
                <li className="hover:text-deep-blue cursor-pointer">Contact</li>
              </ul>
            </div>

            {/* Community Column */}
            <div>
              <h4 className="font-bold text-gray-900 mb-6">Community</h4>
              <ul className="space-y-4 text-gray-500 text-sm">
                <li className="hover:text-deep-blue cursor-pointer">
                  Medicare for Business
                </li>
                <li className="hover:text-deep-blue cursor-pointer">
                  2024 Creator Report
                </li>
                <li className="hover:text-deep-blue cursor-pointer">
                  Charities
                </li>
                <li className="hover:text-deep-blue cursor-pointer">
                  Creator Profile Directory
                </li>
                <li className="hover:text-deep-blue cursor-pointer">
                  Explore Templates
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h4 className="font-bold text-gray-900 mb-6">Support</h4>
              <ul className="space-y-4 text-gray-500 text-sm">
                <li className="hover:text-deep-blue cursor-pointer">
                  Help Topics
                </li>
                <li className="hover:text-deep-blue cursor-pointer">
                  Getting Started
                </li>
                <li className="hover:text-deep-blue cursor-pointer">
                  Linktree Pro
                </li>
                <li className="hover:text-deep-blue cursor-pointer">
                  Features & How-Tos
                </li>
                <li className="hover:text-deep-blue cursor-pointer">FAQs</li>
                <li className="hover:text-deep-blue cursor-pointer">
                  Report a Violation
                </li>
              </ul>
            </div>

            {/* Trust & Legal Column */}
            <div>
              <h4 className="font-bold text-gray-900 mb-6">Trust & Legal</h4>
              <ul className="space-y-4 text-gray-500 text-sm">
                <li className="hover:text-deep-blue cursor-pointer">
                  Terms & Conditions
                </li>
                <li className="hover:text-deep-blue cursor-pointer">
                  Privacy Notice
                </li>
                <li className="hover:text-deep-blue cursor-pointer">
                  Cookie Notice
                </li>
                <li className="hover:text-deep-blue cursor-pointer">
                  Trust Center
                </li>
                <li className="hover:text-deep-blue cursor-pointer">
                  Cookie Preferences
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-100">
            {/* App Buttons */}
            <div className="flex flex-col md:flex-row items-center gap-4">
              <button className="bg-gray-900 text-white px-5 py-3 rounded-xl flex items-center gap-4 hover:scale-105 transition-all shadow-md group">
                <FaApple className="text-3xl group-hover:text-gray-200 transition-colors" />
                <div className="text-left leading-none">
                  <p className="text-[10px] uppercase font-medium tracking-wider opacity-80 mb-1">
                    Download on the
                  </p>
                  <p className="text-xl font-bold">App Store</p>
                </div>
              </button>

              <button className="bg-gray-900 text-white px-5 py-3 rounded-xl flex items-center gap-4 hover:scale-105 transition-all shadow-md group">
                <FaGooglePlay className="text-2xl ml-1 group-hover:text-gray-200 transition-colors" />
                <div className="text-left leading-none">
                  <p className="text-[10px] uppercase font-medium tracking-wider opacity-80 mb-1">
                    GET IT ON
                  </p>
                  <p className="text-xl font-bold">Google Play</p>
                </div>
              </button>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 cursor-pointer transition-colors">
                <FaSearch />
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 cursor-pointer transition-colors">
                <FaUser />
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 cursor-pointer transition-colors">
                <FaCheckCircle />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Big Logo */}
        <div className="bg-card-pink rounded-[3rem] h-64 md:h-96 flex items-center justify-center overflow-hidden relative">
          <h1 className="text-[5rem] md:text-[12rem] font-bold text-deep-blue flex items-center gap-4 select-none">
            <span className="text-[4rem] md:text-[10rem]">🩺</span> Medicare
          </h1>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
