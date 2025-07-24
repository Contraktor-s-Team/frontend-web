import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { WorkflowButtons, JobDescriptionForm } from '../../../components/FormWorkflow';
import { updateJobData } from '../../../redux/slices/jobPostSlice';

const DescribeJob = () => {
  const dispatch = useDispatch();
  const jobData = useSelector((state) => state.jobPost);

  const [jobTitle, setJobTitle] = useState(jobData.jobTitle || '');
  const [category, setCategory] = useState(jobData.category || '');
  const [description, setDescription] = useState(jobData.description || '');
  const [files, setFiles] = useState([]);

  // Track if form is valid
  const isFormValid = () => jobTitle && category && description;

  // Handle file changes
  const handleFileChange = (newFiles) => {
    setFiles(newFiles);
  };

  // Get file URLs and types for form submission
  const getFileData = () => {
    const urls = files.map(file => URL.createObjectURL(file));
    const types = files.map(file => file.type.startsWith('image/') ? 'image' : 'video');
    return { urls, types };
  };

  const saveFormData = () => {
    const { urls, types } = getFileData();
    dispatch(updateJobData({ 
      jobTitle, 
      category, 
      description, 
      fileUrls: urls, 
      fileTypes: types 
    }));
  };

  const categoryOptions = [
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'ac_repair', label: 'AC Repair' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'painting', label: 'Painting' }
  ];

  return (
    <div className="bg-white p-6">
      <div className="max-w-[637px]">
      <h1 className="font-manrope text-2xl font-medium mb-8">What do you need done?</h1>
      
      <JobDescriptionForm
        jobTitle={jobTitle}
        setJobTitle={setJobTitle}
        category={category}
        setCategory={setCategory}
        description={description}
        setDescription={setDescription}
        files={files}
        handleFileChange={handleFileChange}
        categoryOptions={categoryOptions}
        maxFiles={3}
      />

      {/* Navigation buttons */}
      <div className="mt-14">
        <WorkflowButtons
          nextPath="/customer/post-job/time-location"
          onNext={(navigate) => {
            saveFormData();
            if (isFormValid()) {
              navigate();
            }
          }}
          disableNext={!isFormValid()}
          showPrevious={false}
          nextLabel="Save & Continue"
          btnClassName="px-6 py-4"
        />
      </div>
      </div>
    </div>
  );
};

export default DescribeJob;
