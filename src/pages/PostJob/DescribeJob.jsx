import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import Select from '../../components/Form/Select';
import { ImagePlus } from 'lucide-react';
import { TextInput } from '../../components/Form';
import { useDispatch, useSelector } from 'react-redux';
import { updateJobData } from '../../redux/slices/jobPostSlice';

const DescribeJob = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jobData = useSelector((state) => state.jobPost);

  const [jobTitle, setJobTitle] = useState(jobData.jobTitle);
  const [category, setCategory] = useState(jobData.category);
  const [description, setDescription] = useState(jobData.description);
  const [photos, setPhotos] = useState([null, null, null, null]); // Local state for File objects
  const [fileUrls, setFileUrls] = useState(jobData.fileUrls || [null, null, null, null]);
  const [fileTypes, setFileTypes] = useState(jobData.fileTypes || [null, null, null, null]);

  const createPreview = (file, index) => {
    if (!file) return;

    // If it's an image file
    if (file.type.startsWith('image/')) {
      try {
        const fileUrl = URL.createObjectURL(file);
        setPreviews((prev) => {
          const newPreviews = [...prev];
          newPreviews[index] = { url: fileUrl, type: 'image' };
          return newPreviews;
        });

        // Store the file URL and type for Redux
        const newFileUrls = [...fileUrls];
        newFileUrls[index] = fileUrl;
        setFileUrls(newFileUrls);

        const newFileTypes = [...fileTypes];
        newFileTypes[index] = 'image';
        setFileTypes(newFileTypes);
      } catch (error) {
        console.error('Error creating image preview:', error);
      }
    } else if (file.type.startsWith('video/')) {
      try {
        const fileUrl = URL.createObjectURL(file);
        setPreviews((prev) => {
          const newPreviews = [...prev];
          newPreviews[index] = { url: fileUrl, type: 'video' };
          return newPreviews;
        });

        // Store the file URL and type for Redux
        const newFileUrls = [...fileUrls];
        newFileUrls[index] = fileUrl;
        setFileUrls(newFileUrls);

        const newFileTypes = [...fileTypes];
        newFileTypes[index] = 'video';
        setFileTypes(newFileTypes);
      } catch (error) {
        console.error('Error creating video preview:', error);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // Find which input was changed
      const inputIndex = fileInputRefs.findIndex((ref) => ref.current === e.target);

      // If we can determine the input index, update just that position
      if (inputIndex !== -1) {
        const newPhotos = Array.isArray(photos) ? [...photos] : [];
        newPhotos[inputIndex] = e.target.files[0];
        setPhotos(newPhotos);
        createPreview(e.target.files[0], inputIndex);
      } else {
        // Fallback to the old behavior
        const files = Array.from(e.target.files).slice(0, 3);
        setPhotos(files);
        files.forEach((file, idx) => createPreview(file, idx));
      }
    }
  };

  const handleNext = () => {
    dispatch(updateJobData({ jobTitle, category, description, fileUrls, fileTypes }));
    navigate('/dashboard/post-job/time-location');
  };

  const categoryOptions = [
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'ac_repair', label: 'AC Repair' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'painting', label: 'Painting' }
  ];

  // File input references for each upload slot
  const fileInputRefs = [useRef(null), useRef(null), useRef(null)];

  const triggerFileInput = (index) => {
    fileInputRefs[index].current.click();
  };

  // Drag and drop handling
  const [dragActive, setDragActive] = useState([-1, -1, -1]);
  const [previews, setPreviews] = useState([null, null, null]);

  const handleDrag = (e, index, active) => {
    e.preventDefault();
    e.stopPropagation();

    if (active !== dragActive[index]) {
      const newDragActive = [...dragActive];
      newDragActive[index] = active ? 1 : 0;
      setDragActive(newDragActive);
    }
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    e.stopPropagation();

    const newDragActive = [...dragActive];
    newDragActive[index] = 0;
    setDragActive(newDragActive);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Take only first file
      const file = e.dataTransfer.files[0];
      const newPhotos = Array.isArray(photos) ? [...photos] : [];
      newPhotos[index] = file;
      setPhotos(newPhotos);
      createPreview(file, index);
    }
  };

  return (
    <div className="bg-white p-7.5">
      <div className="sm:w-[637px]">
        <h2 className="font-manrope font-semibold text-xl mb-10">What do you need done?</h2>

        <div className="space-y-6">
          <div>
            <div className="flex items-center mb-2">
              <label className="block text-sm font-medium text-gray-900">Job Title</label>
              <span className="text-err-norm-1 ml-1">*</span>
            </div>
            <TextInput
              inputClassName="text-sm"
              type="text"
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g Ceiling Fan Installation"
            />
          </div>
          <div>
            <div className="flex items-center mb-2">
              <label className="block text-sm font-medium text-gray-900">Service Category</label>
              <span className="text-err-norm-1 ml-1">*</span>
            </div>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={categoryOptions}
              placeholder="e.g., Plumbing, Cleaning, AC Repair"
              showIcon={false}
            />
          </div>

          <div>
            <div className="flex items-center mb-2">
              <label className="block text-sm font-medium text-gray-900">Job Description</label>
              <span className="text-err-norm-1 ml-1">*</span>
            </div>
            <textarea
              // value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="text-sm w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-pri-norm-1 placeholder:text-neu-norm-1"
              placeholder="Describe your job in details"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900">Upload Photos or Videos</label>
            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map((index) => {
                const hasFile = Array.isArray(photos) && photos[index] && photos[index].name;
                const hasPreview = previews && previews[index];

                return (
                  <div
                    key={index}
                    className={`border border-dashed ${
                      dragActive[index] === 1 ? 'border-pri-norm-1 bg-blue-50' : 'border-gray-300'
                    } rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 h-[140px]`}
                    onClick={() => triggerFileInput(index)}
                    onDragOver={(e) => handleDrag(e, index, true)}
                    onDragEnter={(e) => handleDrag(e, index, true)}
                    onDragLeave={(e) => handleDrag(e, index, false)}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <input
                      ref={fileInputRefs[index]}
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {/* File Preview */}
                    {hasFile ? (
                      <div className="flex flex-col items-center justify-center w-full h-full">
                        {hasPreview ? (
                          <div className="relative w-full h-full mb-1 overflow-hidden">
                            {previews[index].type === 'video' ? (
                              <>
                                <video
                                  src={previews[index].url}
                                  className="object-cover w-full h-full rounded-md"
                                  preload="metadata"
                                  controls
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-1 text-xs text-white truncate">
                                  {photos[index].name}
                                </div>
                              </>
                            ) : (
                              <>
                                <img
                                  src={previews[index].url}
                                  alt="Preview"
                                  className="object-cover w-full h-full rounded-md"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-1 text-xs text-white truncate">
                                  {photos[index].name}
                                </div>
                              </>
                            )}
                          </div>
                        ) : (
                          <>
                            <ImagePlus className="text-pri-norm-1 mb-2" size={24} />
                            <p className="text-xs text-gray-500 truncate w-full text-center max-w-[120px]">
                              {photos[index].name}
                            </p>
                          </>
                        )}
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
            <p className="text-sm text-gray-500 mt-2">Videos must be not be longer than 20 seconds and at least 5mb</p>
          </div>

          <div className="mt-12">
            <Button
              size="small"
              variant="primary"
              onClick={handleNext}
              disabled={!jobTitle || !category || !description}
            >
              Save & Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescribeJob;
