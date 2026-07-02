import React from "react";
import PropTypes from "prop-types";
import { CheckCircle } from "lucide-react";

const SuccessBanner = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-md shadow-sm">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-green-800">{message}</p>
        </div>
      </div>
    </div>
  );
};

SuccessBanner.propTypes = {
  message: PropTypes.string,
};

SuccessBanner.defaultProps = {
  message: "",
};

export default SuccessBanner;
