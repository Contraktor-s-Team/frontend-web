import React, { useState } from 'react';
import { ImagePlus, X } from 'lucide-react';

/**
 * Reusable file uploader component for multi-step forms
 * @param {Object} props - Component props
 * @param {function} props.onChange - Function called when files change
 * @param {Array} props.value - Current array of files
 * @param {number} props.maxFiles - Maximum number of files allowed
 * @param {string} props.accept - File types to accept
 * @param {string} props.label - Input label
 * @param {string} props.helperText - Helper text below the input
 * @param {boolean} props.required - Whether the field is required
 * @param {string} props.name - Input name for form submission
 */
const FileUploader = ({
  onChange,
  value = [],
  maxFiles = 3,
  accept = "image/*,video/*",
  label = "Upload Photos or Videos",
  helperText = "Videos must be not be longer than 20 seconds and at least 5mb",
  required = false,
  name = "files"
}) => {
  const [dragActive, setDragActive] = useState(false);
  
  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle file selection
  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    
    // Filter out any files that would exceed the limit
    const remainingSlots = maxFiles - value.length;
    const newFiles = Array.from(files).slice(0, remainingSlots);
    
    if (newFiles.length === 0) return;
    
    // Add new files to existing files
    const updatedFiles = [...value, ...newFiles];
    onChange(updatedFiles);
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Handle file input change
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  // Handle file removal
  const removeFile = (indexToRemove) => {
    const updatedFiles = value.filter((_, idx) => idx !== indexToRemove);
    onChange(updatedFiles);
  };

  return (
    <div className="space-y-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0, 1, 2].map((index) => {
          return (
            <div
              key={index}
              className={`border-2 border-dashed transition-colors ${
                dragActive ? 'border-pri-norm-1 bg-blue-50' : 'border-gray-300'
              } rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 h-[140px]`}
              onClick={() => {
                const input = document.getElementById(`file-upload-${name}-${index}`);
                if (input) input.click();
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id={`file-upload-${name}-${index}`}
                accept={accept}
                onChange={handleChange}
                className="hidden"
                disabled={value.length >= maxFiles && !value[index]}
              />

              {/* File Preview or Empty State */}
              {value[index] ? (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <div className="relative w-full h-full mb-1 overflow-hidden">
                    {value[index].type.startsWith('video/') ? (
                      <>
                        <video
                          src={URL.createObjectURL(value[index])}
                          className="object-cover w-full h-full rounded-md"
                          preload="metadata"
                          controls
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-1 text-xs text-white truncate">
                          {value[index].name}
                        </div>
                      </>
                    ) : (
                      <>
                        <img
                          src={URL.createObjectURL(value[index])}
                          alt="Preview"
                          className="object-cover w-full h-full rounded-md"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-1 text-xs text-white truncate">
                          {value[index].name}
                        </div>
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm border"
                  >
                    <X size={16} className="text-gray-500" />
                  </button>
                </div>
              ) : (
                /* Empty State - Always show this when no file is selected */
                <>
                  <ImagePlus className="text-pri-norm-1 mb-2" size={24} />
                  <div className="text-neu-norm-3 text-sm text-center">
                    <span className="text-pri-norm-1">Choose file</span> or
                    <br />
                    drag & drop it here
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      
      <p className="text-sm font-normal text-neu-norm-1 mt-2">{helperText}</p>
    </div>
  );
};

export default FileUploader;
