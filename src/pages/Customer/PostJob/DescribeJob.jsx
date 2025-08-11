import React, { useEffect, useState } from 'react';
import { useJobPost } from '../../../contexts/JobPostContext';
import { useJobListings } from '../../../contexts/JobListingContext';
import { JobDescriptionForm } from '../../../components/FormWorkflow';
import Button from '../../../components/Button';
import { useNavigate } from 'react-router-dom';

const DescribeJob = () => {
  const { state: jobData, dispatch } = useJobPost();
  const { state: jobListingState, fetchCategories } = useJobListings();
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState(jobData.jobTitle || '');
  const [category, setCategory] = useState(jobData.category || '');
  const [subcategory, setSubcategory] = useState(jobData.subcategory || '');
  const [description, setDescription] = useState(jobData.description || '');
  const [files, setFiles] = useState(jobData.files || []);
  const [budgetType, setBudgetType] = useState(jobData.budgetType ?? false);
  const [budgetAmount, setBudgetAmount] = useState(jobData.budgetAmount || '');
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  // Get categories and subcategories from API
  const categories = jobListingState.categories.data?.data || [];
  const categoriesLoading = jobListingState.categories.loading;
  const categoriesError = jobListingState.categories.error;

  // Get subcategories for selected category
  const selectedCategoryData = categories.find((cat) => cat.id === category);
  const subcategories = selectedCategoryData?.subcategories || [];

  // Fetch categories on component mount
  useEffect(() => {
    if (!hasAttemptedFetch) {
      console.log('🔄 Attempting to fetch categories...');
      setHasAttemptedFetch(true);
      fetchCategories();
    }
  }, [fetchCategories, hasAttemptedFetch]);

  // Clear subcategory when category changes
  useEffect(() => {
    if (
      category &&
      selectedCategoryData &&
      !selectedCategoryData.subcategories?.some((sub) => sub.id === subcategory)
    ) {
      setSubcategory('');
    }
  }, [category, selectedCategoryData, subcategory]);

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
    navigate('/customer/post-job/time-location', {
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

  // Create category and subcategory options from API data
  const categoryOptions = categories.map((item) => ({
    value: item.id,
    label: item.name
  }));

  const subcategoryOptions = subcategories.map((sub) => ({
    value: sub.id,
    label: sub.name
  }));

  return (
    <div className="bg-white p-4 sm:p-6">
      <div className="max-w-full sm:max-w-[637px]">
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
          categoriesLoading={categoriesLoading}
          categoriesError={hasAttemptedFetch ? categoriesError : null}
          subcategory={subcategory}
          setSubcategory={setSubcategory}
          subcategoryOptions={subcategoryOptions}
          maxFiles={3}
          budgetType={budgetType}
          setBudgetType={setBudgetType}
          budgetAmount={budgetAmount}
          setBudgetAmount={setBudgetAmount}
        />
        <div className="mt-14">
          <Button variant="primary" onClick={(e) => saveFormData(e)} disabled={!isFormValid()}>
            Save & Continue
          </Button>
        </div>
      </div>
    </div>
  );
};
export default DescribeJob;
