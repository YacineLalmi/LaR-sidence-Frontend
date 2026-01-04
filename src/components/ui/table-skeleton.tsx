"use client";
import React from "react";

const SkeletonRow = () => (
  <div className="flex items-center border-b border-gray-200 py-4 px-4">
    <div className="w-5 h-5 bg-gray-200 rounded animate-pulse mr-8"></div>
    <div className="w-8 h-4 bg-gray-200 rounded animate-pulse mr-16"></div>
    <div className="w-32 h-4 bg-gray-200 rounded animate-pulse mr-16"></div>
    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mr-16"></div>
    <div className="flex-1 h-4 bg-gray-200 rounded animate-pulse mr-16"></div>
    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mr-16"></div>
    <div className="flex gap-2">
      <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
      <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
    </div>
  </div>
);

const TableSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f0] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse mr-4"></div>
          <div className="h-8 w-96 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Search and Create Button */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-full h-12 rounded-full border border-gray-300 bg-white"></div>
          </div>
          <div className="w-40 h-12 bg-gray-200 rounded-full animate-pulse"></div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="flex items-center bg-gray-50 border-b border-gray-200 py-3 px-4 text-sm font-medium text-gray-700">
            <div className="w-5 mr-8"></div>
            <div className="w-8 h-4 bg-gray-300 rounded animate-pulse mr-16"></div>
            <div className="w-24 h-4 bg-gray-300 rounded animate-pulse mr-16"></div>
            <div className="w-20 h-4 bg-gray-300 rounded animate-pulse mr-16"></div>
            <div className="w-32 h-4 bg-gray-300 rounded animate-pulse mr-16"></div>
            <div className="w-24 h-4 bg-gray-300 rounded animate-pulse mr-16"></div>
            <div className="w-16 h-4 bg-gray-300 rounded animate-pulse"></div>
          </div>

          {/* Skeleton Rows */}
          {[...Array(7)].map((_, index) => (
            <SkeletonRow key={index} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <div className="w-8 h-8 rounded border border-gray-300 bg-gray-200 animate-pulse"></div>
          <div className="w-8 h-8 rounded border border-gray-300 bg-gray-200 animate-pulse"></div>
          <div className="w-8 h-8 rounded border border-gray-300 bg-gray-200 animate-pulse"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default TableSkeleton;
