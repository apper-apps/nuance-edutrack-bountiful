import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, variant = "default" }) => {
  if (variant === "table") {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="shimmer-bg h-8 w-48 rounded-lg"></div>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="shimmer-bg h-12 w-full"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-t border-gray-200">
              <div className="flex items-center p-4 space-x-4">
                <div className="shimmer-bg h-10 w-10 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="shimmer-bg h-4 w-3/4 rounded"></div>
                  <div className="shimmer-bg h-3 w-1/2 rounded"></div>
                </div>
                <div className="shimmer-bg h-6 w-16 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="shimmer-bg h-4 w-24 rounded"></div>
              <div className="shimmer-bg h-8 w-8 rounded-lg"></div>
            </div>
            <div className="shimmer-bg h-8 w-16 rounded mb-2"></div>
            <div className="shimmer-bg h-4 w-20 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
        <span className="text-gray-600">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;