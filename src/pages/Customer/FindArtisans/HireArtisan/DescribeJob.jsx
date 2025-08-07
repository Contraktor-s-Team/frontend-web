import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { updateJobData } from '../../../../redux/slices/hireArtisanSlice';
import { JobDescriptionForm, WorkflowButtons } from '../../../../components/FormWorkflow';
import { categoryAction, postJobAction, subCategoryAction } from '../../../../redux/Jobs/JobsAction';

const DescribeJob = ({
  getCategory,
  getSubCategory,
  postJob,
  loading,
  error,
  data,
  subcategoryLoading,
  subcategoryError,
  subcategoryData,
  jobDatas,
  jobLoading,
  jobError,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jobData = useSelector((state) => state.hireArtisan);
  const [errors, setErrors] = useState(false)
  const [jobTitle, setJobTitle] = useState(jobData.jobTitle || '');
  const [category, setCategory] = useState(jobData.category || '');
  const [subcategory, setSubcategory] = useState(jobData.subcategory || '');
  const [description, setDescription] = useState(jobData.description || '');
  const [files, setFiles] = useState([]);
  const [budgetType, setBudgetType] = useState(jobData.budgetType ?? false); // 'budget' or 'consultation'
  const [budgetAmount, setBudgetAmount] = useState(jobData.budgetAmount || '');

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

  const saveFormData = async (e) => {
    setErrors(false)
    e.preventDefault();
    try{
      const formData = new FormData();

      formData.append('title', jobTitle);
      formData.append('description', description);
      formData.append('artisanSubcategoryId', subcategory?.value);
      formData.append('ProposalRequiresPrice', budgetType);
      if (budgetType === true  && budgetAmount) {
        formData.append('Budget', budgetAmount);
      }

      // Append each file
      files.forEach((file, index) => {
        formData.append('images', file); // key 'images' matches backend expectations
      });

      console.log("userData", formData)
      await postJob(formData, ()=>{
        console.log("i got here in login")
        navigate("/customer/post-job/time-location", { state: { jobTitle,description, subcategory, files, budgetType, budgetAmount } })
      },()=>{
        setErrors(true);
      });
      }
    catch (error) {
        console.error('Registration failed:', error);
    }
  };

   const categoryOptions =  data?.data?.map((item) => ({
     value: item.id,
     label: item.name
   }))
 
  
   useEffect(() => {
     console.log("Fetching categories...");
     try {
       console.log("Fetching categories...");
       getCategory();
     } catch (err) {
       console.error("Error in useEffect:", err);
     }
   },[])
   useEffect(() => {
     if (category) {
       getSubCategory(category); // use prop function
     }
   }, [category]);

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
        subcategoryOptions={subcategoryData?.data?.map(sub => ({
          value: sub.id,
          label: sub.name
        })) || []}
        maxFiles={3}
        budgetType={budgetType}
        setBudgetType={setBudgetType}
        budgetAmount={budgetAmount}
        setBudgetAmount={setBudgetAmount}
      />

      {/* Navigation buttons */}
      <div className="mt-14">
        <WorkflowButtons
          nextPath={null} // Will be calculated in handleNext
          onNext={(e) => {
            saveFormData(e);
            // if (isFormValid()) {
            //   // Get the path parts to construct the new path
            //   const pathParts = location.pathname.split('/');
            //   const basePath = pathParts.slice(0, pathParts.indexOf('hire-artisan') + 1).join('/');
            //   navigate(`${basePath}/time-location`);
            // }
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

const mapStoreToProps = (state) => {
    return {
        loading: state?.category?.loading,
        error: state?.category?.error,
        data: state?.category?.data,
        subcategoryLoading: state?.subcategory?.loading,
        subcategoryError: state?.subcategory?.error,  
        subcategoryData: state?.subcategory?.data,
        jobDatas: state?.jobpost?.data,
        jobLoading: state?.jobpost?.loading,
        jobError: state?.jobpost?.error,
    };
};
const mapDispatchToProps = (dispatch) => {
  return {
      getCategory: () => dispatch(categoryAction()),
      getSubCategory: (id) => dispatch(subCategoryAction(id)),
      postJob: (postState, history, errors) => dispatch(postJobAction(postState, history, errors)),
  };
}
export default connect(mapStoreToProps, mapDispatchToProps)(DescribeJob);
