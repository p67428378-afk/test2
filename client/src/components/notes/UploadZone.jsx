import React, { useRef, useState } from "react";

export default function UploadZone({ onUpload }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUpload(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onUpload(files[0]);
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer group ${
        isDragging
          ? "border-primary bg-primary/10"
          : "border-outline-variant/50 hover:border-primary/50 hover:bg-primary/5"
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <span className="material-symbols-outlined text-[32px] text-outline group-hover:text-primary mb-2 transition-colors">
        cloud_upload
      </span>
      <p className="font-label-md text-label-md text-on-surface mb-1">
        Click to upload or drag and drop
      </p>
      <p className="font-label-sm text-label-sm text-outline">
        SVG, PNG, JPG, PDF or GIF (max. 10MB)
      </p>
    </div>
  );
}
