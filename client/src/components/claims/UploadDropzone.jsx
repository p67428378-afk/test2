import React, { useRef } from "react";
import PropTypes from "prop-types";

export default function UploadDropzone({ onFilesSelected }) {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="w-full bg-surface-container-low border border-dashed border-outline-variant rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-surface-container transition-colors focus:outline-none focus:ring-2 focus:ring-primary active:scale-[0.99]"
      onClick={handleButtonClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleButtonClick();
        }
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/*"
        className="hidden"
        data-testid="file-input"
      />
      <span
        className="material-symbols-outlined text-primary text-3xl"
        data-icon="photo_camera"
      >
        photo_camera
      </span>
      <span className="font-button text-button text-primary mt-2">
        Take Photo or Upload from Gallery
      </span>
      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase mt-1">
        Supports JPG, PNG up to 10MB
      </span>
    </div>
  );
}

UploadDropzone.propTypes = {
  onFilesSelected: PropTypes.func.isRequired,
};
