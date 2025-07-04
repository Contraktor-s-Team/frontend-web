import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateJobData } from '../../../redux/slices/hireArtisanSlice';
import { JobDescriptionForm, WorkflowButtons } from '../../../components/FormWorkflow';

const DescribeJob = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jobData = useSelector((state) => state.hireArtisan);

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
    { value: 'painting', label: 'Painting' },
  ];

  return (
    <div className="bg-white p-6">
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
          nextPath={null} // Will be calculated in handleNext
          onNext={() => {
            saveFormData();
            if (isFormValid()) {
              // Get the path parts to construct the new path
              const pathParts = location.pathname.split('/');
              const basePath = pathParts.slice(0, pathParts.indexOf('hire-artisan') + 1).join('/');
              navigate(`${basePath}/time-location`);
            }
          }}
          disableNext={!isFormValid()}
          showPrevious={false}
          nextLabel="Save & Continue"
          btnClassName="px-6 py-4.25"
        />
      </div>
    </div>
  );
};

export default DescribeJob;
