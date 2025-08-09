import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHireArtisan } from '../../../../contexts/HireArtisanContext';
import { JobDescriptionForm, WorkflowButtons } from '../../../../components/FormWorkflow';

const DescribeJob = () => {
  const { state: jobData, dispatch } = useHireArtisan();
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState(jobData.jobTitle || '');
  const [category, setCategory] = useState(jobData.category || '');
  const [subcategory, setSubcategory] = useState(jobData.subcategory || '');
  const [description, setDescription] = useState(jobData.description || '');
  const [files, setFiles] = useState(jobData.files || []);
  const [budgetType, setBudgetType] = useState(jobData.budgetType ?? false);
  const [budgetAmount, setBudgetAmount] = useState(jobData.budgetAmount || '');
  const isFormValid = () => jobTitle && category && description;
  const handleFileChange = (newFiles) => {
    setFiles(newFiles);
  };
  const saveFormData = (e) => {
    e.preventDefault();
    dispatch({
      type: 'UPDATE_JOB_DATA',
      payload: {
        jobTitle,
        category,
        subcategory,
        description,
        files,
        budgetType,
        budgetAmount
      }
    });
    // TODO: Update navigation path as needed
    navigate('/customer/findartisans/hire-artisan/time-location', {
      state: {
        jobTitle,
        description,
        subcategory,
        files,
        budgetType,
        budgetAmount
      }
    });
  };
  // TODO: Fetch categories/subcategories with context or hooks
  const categoryOptions = [];
  const subcategoryData = { data: [] };
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
        subcategory={subcategory}
        setSubcategory={setSubcategory}
        subcategoryOptions={
          subcategoryData?.data?.map((sub) => ({
            value: sub.id,
            label: sub.name
          })) || []
        }
        maxFiles={3}
        budgetType={budgetType}
        setBudgetType={setBudgetType}
        budgetAmount={budgetAmount}
        setBudgetAmount={setBudgetAmount}
      />
      <div className="mt-14">
        <WorkflowButtons
          nextPath={null}
          onNext={(e) => saveFormData(e)}
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
