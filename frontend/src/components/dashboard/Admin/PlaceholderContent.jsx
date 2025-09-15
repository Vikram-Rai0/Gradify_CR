import React from "react";
import { Settings } from "lucide-react";

const PlaceholderContent = ({ title, description }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Settings className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Configure {title}
      </button>
    </div>
  </div>
);

export default PlaceholderContent;
