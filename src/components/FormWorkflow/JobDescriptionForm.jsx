import React from 'react';
import { TextInput } from '../Form';
import Select from '../Form/Select';
import FileUploader from './FileUploader';

/**
 * Reusable Job Description Form component
 * @param {Object} props - Component props
 * @param {string} props.jobTitle - Current job title value
 * @param {Function} props.setJobTitle - Function to update job title
 * @param {string} props.category - Current category value
 * @param {Function} props.setCategory - Function to update category
 * @param {string} props.description - Current description value
 * @param {Function} props.setDescription - Function to update description
 * @param {Array} props.files - Current array of files
 * @param {Function} props.handleFileChange - Function to handle file changes
 * @param {Array} props.categoryOptions - Options for the category dropdown
 * @param {number} [props.maxFiles=3] - Maximum number of files allowed (default: 3)
 */
const JobDescriptionForm = ({
  jobTitle,
  setJobTitle,
  category,
  setCategory,
  description,
  setDescription,
  files = [],
  handleFileChange = () => {},
  categoryOptions = [],
  maxFiles = 3,
}) => {
  return (
    <>
      {/* Job Title Input */}
      <div className="mb-6">
        <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-800 mb-2">
          Job Title <span className="text-err-norm-1">*</span>
        </label>
        <TextInput
          id="jobTitle"
          placeholder="e.g Ceiling Fan Installation"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          required
        />
      </div>

      {/* Service Category Dropdown */}
      <div className="mb-6">
        <label htmlFor="serviceCategory" className="block text-sm font-medium text-gray-800 mb-2">
          Service Category <span className="text-err-norm-1">*</span>
        </label>
        <Select
          id="serviceCategory"
          options={categoryOptions}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          dropdownClassName='text-sm'
          className='text-sm'
        />
      </div>

      {/* Description Textarea */}
      <div className="mb-8">
        <label htmlFor="description" className="block text-sm font-medium text-gray-800 mb-2">
          Job Description <span className="text-err-norm-1">*</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-28 border border-gray-300 rounded-md p-3 focus:outline-none focus:border-pri-norm-1 resize-y"
          placeholder="Describe your job in details"
          required
        />
      </div>

      {/* Photo/Video Upload using FileUploader */}
      <div className="mb-12">
        <p className="block text-sm font-medium text-gray-800 mb-2">Upload Photos or Videos</p>
        <FileUploader
          label=""
          accept="image/*,video/*"
          onChange={handleFileChange}
          value={files}
          maxFiles={maxFiles}
        />
      </div>
    </>
  );
};

export default JobDescriptionForm;
