import React, { useState, useRef } from 'react';

export default function FileUploadZone({ onUploadSuccess }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await uploadFile(files[0]);
    }
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      await uploadFile(files[0]);
    }
  };

  const uploadFile = async (file) => {
    const allowedExtensions = ['.pdf', '.txt', '.docx', '.doc'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      setError('Invalid file type. Only PDF, TXT, DOCX, and DOC are allowed.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // We will import uploadManuscript dynamically or pass it as prop, but let's import it directly
      const { uploadManuscript } = await import('../../services/api');
      const result = await uploadManuscript(file);
      onUploadSuccess(result);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to upload manuscript. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='bg-[#1E293B] border border-[#334155] rounded-xl p-6 shadow-sm'>
      <h3 className='font-headline-md text-headline-md text-on-surface mb-4'>Upload Manuscript</h3>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
          isDragging
            ? 'border-[#6366F1] bg-[#6366F1]/10'
            : 'border-[#334155] hover:border-[#6366F1]/50 bg-[#0F172A]/50'
        }`}
      >
        <input
          type='file'
          ref={fileInputRef}
          onChange={handleFileChange}
          className='hidden'
          accept='.pdf,.txt,.docx,.doc'
        />
        <span className='material-symbols-outlined text-5xl text-[#6366F1] mb-4'>
          cloud_upload
        </span>
        <p className='text-on-surface font-semibold mb-1 text-center'>
          Drag & drop your manuscript file here, or <span className='text-[#6366F1] hover:underline'>browse</span>
        </p>
        <p className='text-on-surface-variant text-xs text-center'>
          Supports PDF, TXT, DOCX, and DOC up to 50MB
        </p>
      </div>

      {uploading && (
        <div className='mt-4 flex items-center gap-2 text-primary'>
          <span className='material-symbols-outlined animate-spin'>sync</span>
          <span>Uploading and extracting metadata...</span>
        </div>
      )}

      {error && (
        <div className='mt-4 p-3 bg-error-container/20 border border-error/30 rounded-lg text-error flex items-center gap-2'>
          <span className='material-symbols-outlined'>error</span>
          <span className='text-sm'>{error}</span>
        </div>
      )}
    </div>
  );
}
