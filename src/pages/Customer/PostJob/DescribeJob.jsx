import React, { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { WorkflowButtons, JobDescriptionForm } from '../../../components/FormWorkflow';
import { updateJobData } from '../../../redux/slices/jobPostSlice';
import { categoryAction, postJobAction, subCategoryAction } from '../../../redux/Jobs/JobsAction';
import Button from '../../../components/Button';
import { useNavigate } from 'react-router-dom';
import LoaderComp from '../../../assets/animation/loader';

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
  const dispatch = useDispatch();
  const jobData = useSelector((state) => state.jobPost);
 const [errors, setErrors] = useState(false)
  const [jobTitle, setJobTitle] = useState(jobData.jobTitle || '');
  const [category, setCategory] = useState(jobData.category || '');
  const [subcategory, setSubcategory] = useState(jobData.subcategory || '');
  const [description, setDescription] = useState(jobData.description || '');
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

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
    // const { urls, types } = getFileData();
    // dispatch(updateJobData({ 
    //   jobTitle, 
    //   category, 
    //   description, 
    //   fileUrls: urls, 
    //   fileTypes: types 
    // }));
    setErrors(false)
    e.preventDefault();
    try{
      const userData ={
        title: jobTitle,
        description: description,
        artisanSubcategoryId: subcategory.value,
      }
      console.log("userData", userData)
      await postJob(userData, ()=>{
        console.log("i got here in login")
        navigate("/customer/post-job/time-location", { state: { userData, subcategory, files } })
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
      <div className="max-w-[637px]">
      <h1 className="font-manrope text-2xl font-medium mb-8">What do you need done?</h1>
       {/* {errors && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <div className="text-sm text-red-700">
                  <p>{jobError}</p>
                </div>
              </div>
            </div>
          </div>
        )} */}
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
      />

      {/* Navigation buttons */}
      <div className="mt-14">
        {/* <WorkflowButtons
          // nextPath="/post-job/time-location"
          onNext={(e)=> saveFormData(e)}
          disableNext={!isFormValid()}
          showPrevious={false}
          nextLabel="Save & Continue"
          btnClassName="px-6 py-4"
        /> */}
        <Button
          variant="primary" 
          onClick={(e)=> saveFormData(e)}
          disabled={jobLoading}
        >
          {jobLoading ? (
            <LoaderComp/>
          ) : (
            "Save & Continue"
          )}  
         
        </Button>
      </div>
      </div>
    </div>
  );
};
const mapStoreToProps = (state) => {
  console.log(state)
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
};
export default connect(mapStoreToProps, mapDispatchToProps)(DescribeJob);
