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
 * @param {Array} props.subcategoryOptions - Options for the subcategory dropdown
 * @param {string} props.subcategory - Current subcategory value
 * @param {Function} props.setSubcategory - Function to update subcategory

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
  subcategoryOptions = [],
  subcategory,
  setSubcategory,
  budgetType = false,
  setBudgetType = () => {},
  budgetAmount = '',
  setBudgetAmount = () => {}
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

      {subcategoryOptions?.length > 0 && (
        <div className="mb-6">
          <label htmlFor="subCategory" className="block text-sm font-medium text-gray-800 mb-2">
            Subcategory <span className="text-err-norm-1">*</span>
          </label>
          <Select
            id="subCategory"
            options={subcategoryOptions}
            value={subcategory?.value || ''}
            onChange={(e) => {
              const selectedOption = subcategoryOptions.find(opt => opt.value === e.target.value);
              setSubcategory(selectedOption); // sets full { value, label }
            }}
            required
            dropdownClassName='text-sm'
            className='text-sm'
          />
        </div>
      )}

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
      <div className="mb-6">
        <div className="space-y-4 flex items-center justify-between">
          {/* Set a Budget Option */}
          <div className="flex items-start space-x-3">
            <input
              type="radio"
              id="setBudget"
              name="budgetType"
              value="budget"
              checked={budgetType === true}
              onChange={() => setBudgetType(true)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <div className="flex-1">
              <label htmlFor="setBudget" className="block text-sm font-medium text-gray-800 cursor-pointer">
                Set a Budget
              </label>
              <p className="text-xs text-gray-500 mt-1">Add how much you're willing to pay.</p>
            </div>
          </div>

          {/* Requires Consultation First Option */}
          <div className="flex items-start space-x-3">
            <input
              type="radio"
              id="requiresConsultation"
              name="budgetType"
              value="consultation"
              checked={budgetType === false}
              onChange={() => setBudgetType(false)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <div className="flex-1">
              <label htmlFor="requiresConsultation" className="block text-sm font-medium text-gray-800 cursor-pointer">
                Requires Consultation First
              </label>
              <p className="text-xs text-gray-500 mt-1">Artisan will inspect first, then send a quote.</p>
            </div>
          </div>
        </div>

        {/* CHANGE 7: Conditional Budget Input Field */}
        {budgetType === true && (
          <div className="mt-4">
            <label htmlFor="budgetAmount" className="block text-sm font-medium text-gray-800 mb-2">
              Budget<span className="text-err-norm-1">*</span>
            </label>
            <div className="relative">
              <TextInput
                id="budgetAmount"
                placeholder="e.g ₦20,000 - ₦25,000"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                required={budgetType === 'budget'}
              />
            </div>
          </div>
        )}
      </div> 
    </>
  );
};

export default JobDescriptionForm;
