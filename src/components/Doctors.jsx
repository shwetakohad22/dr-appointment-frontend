import React from "react";
import {
  FaUserMd,
  FaStethoscope,
  FaBriefcase,
  FaDollarSign,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";

const Doctors = ({ doctor }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-deep-blue/20 h-full flex flex-col group">
      {/* Card Header - Compact */}
      <div className="bg-gradient-to-br from-deep-blue to-blue-700 p-4 text-white relative overflow-hidden">
        {/* Decorative Circle */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 border border-white/20 shadow-inner">
            <FaUserMd className="text-xl text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold truncate tracking-tight leading-tight">
              Dr. {doctor.firstName} {doctor.lastName}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5 text-blue-100/90 text-xs font-medium">
              <div className="p-0.5 bg-white/20 rounded">
                <FaStethoscope className="text-[10px]" />
              </div>
              <span className="truncate">{doctor.specialization}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Body - Compact */}
      <div className="p-3 flex-1 space-y-2">
        {/* Experience */}
        <div className="flex items-center gap-2.5 bg-gray-50/80 rounded-lg p-2 border border-gray-100 group-hover:bg-blue-50/30 transition-colors">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <FaBriefcase className="text-xs" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold leading-none mb-0.5">
              Exp
            </p>
            <p className="text-gray-900 font-bold text-xs">
              {doctor.experience} Years
            </p>
          </div>
        </div>

        {/* Consultation Fee */}
        <div className="flex items-center gap-2.5 bg-gray-50/80 rounded-lg p-2 border border-gray-100 group-hover:bg-blue-50/30 transition-colors">
          <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <FaDollarSign className="text-xs" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold leading-none mb-0.5">
              Fee
            </p>
            <p className="text-gray-900 font-bold text-xs">
              ${doctor.feePerCunsultation}
            </p>
          </div>
        </div>

        {/* Timings */}
        {doctor.timing && (
          <div className="flex items-center gap-2.5 bg-gray-50/80 rounded-lg p-2 border border-gray-100 group-hover:bg-blue-50/30 transition-colors">
            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <FaClock className="text-xs" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold leading-none mb-0.5">
                Avail
              </p>
              <p className="text-gray-900 font-medium text-xs truncate">
                {Array.isArray(doctor.timing)
                  ? `${doctor.timing[0]} - ${doctor.timing[1]}`
                  : doctor.timing}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Card Footer - Compact */}
      <div className="p-3 pt-0">
        <button className="w-full bg-deep-blue text-white font-semibold py-2.5 rounded-lg hover:bg-blue-800 transition-all flex items-center justify-center gap-2 shadow-sm text-sm group-hover:shadow-md">
          <span>Book</span>
          <FaArrowRight className="text-[10px] group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default Doctors;
