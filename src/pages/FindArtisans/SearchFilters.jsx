import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Select, TextInput } from '../../components/Form';

const SearchFilters = ({ 
  categoryFilter,
  setCategoryFilter,
  locationFilter, 
  setLocationFilter,
  availabilityFilter,
  setAvailabilityFilter,
  ratingFilter,
  setRatingFilter,
  priceFilter,
  setPriceFilter,
  searchQuery,
  setSearchQuery,
}) => {
  // Category (Specialty) options based on artisans.json
  const categoryOptions = [
    { value: 'category', label: 'Category' },
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'ac-installation', label: 'AC Installation' },
    { value: 'painting', label: 'Painting' },
    { value: 'carpentry', label: 'Carpentry' },
    { value: 'tiling', label: 'Tiling' },
    { value: 'roofing', label: 'Roofing' },
    { value: 'masonry', label: 'Masonry' },
    { value: 'welding', label: 'Welding' },
    { value: 'generator-repairs', label: 'Generator Repairs' },
  ];

  // Location options based on artisans.json
  const locationOptions = [
    { value: 'location', label: 'Location' },
    { value: 'ikeja', label: 'Ikeja, Lagos' },
    { value: 'yaba', label: 'Yaba, Lagos' },
    { value: 'gbagada', label: 'Gbagada, Lagos' },
    { value: 'mushin', label: 'Mushin, Lagos' },
    { value: 'ajah', label: 'Ajah, Lagos' },
    { value: 'lekki', label: 'Lekki, Lagos' },
    { value: 'oshodi', label: 'Oshodi, Lagos' },
    { value: 'ikorodu', label: 'Ikorodu, Lagos' },
    { value: 'apapa', label: 'Apapa, Lagos' },
  ];

  // Availability options
  const availabilityOptions = [
    { value: 'availability', label: 'Availability' },
    { value: 'available', label: 'Available Now' },
    { value: 'not-available', label: 'Not Available' },
  ];

  // Rating options
  const ratingOptions = [
    { value: 'rating', label: 'Rating' },
    { value: '5', label: '5 Stars' },
    { value: '4.5', label: '4.5+ Stars' },
    { value: '4', label: '4+ Stars' },
  ];

  // Price range options
  const priceOptions = [
    { value: 'price', label: 'Price Range' },
    { value: 'under-5000', label: 'Under ₦5,000' },
    { value: '5000-10000', label: '₦5,000 - ₦10,000' },
    { value: '10000-15000', label: '₦10,000 - ₦15,000' },
    { value: 'above-15000', label: 'Above ₦15,000' },
  ];

  return (
    <div className="flex items-center gap-4.25">
      <div className="flex-1">
        <TextInput
          leadingIcon={<Search size={20} />}
          inputClassName="rounded-full pr-6"
          placeholder="Search artisans"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <div className="">
        <Select
          value={categoryFilter || categoryOptions[0].value}
          onChange={(e) => setCategoryFilter?.(e.target.value)}
          options={categoryOptions}
          trailingIcon={<ChevronDown className="h-5 w-5 text-gray-400" />}
          className="text-sm rounded-full"
        />
      </div>

      {/* Location Filter */}
      <div className="">
        <Select
          value={locationFilter || locationOptions[0].value}
          onChange={(e) => setLocationFilter?.(e.target.value)}
          options={locationOptions}
          trailingIcon={<ChevronDown className="h-5 w-5 text-gray-400" />}
          className="text-sm rounded-full"
        />
      </div>

      {/* Availability Filter */}
      <div className="">
        <Select
          value={availabilityFilter || availabilityOptions[0].value}
          onChange={(e) => setAvailabilityFilter?.(e.target.value)}
          options={availabilityOptions}
          trailingIcon={<ChevronDown className="h-5 w-5 text-gray-400" />}
          className="text-sm rounded-full"
        />
      </div>

      {/* Rating Filter */}
      <div className="">
        <Select
          value={ratingFilter || ratingOptions[0].value}
          onChange={(e) => setRatingFilter?.(e.target.value)}
          options={ratingOptions}
          trailingIcon={<ChevronDown className="h-5 w-5 text-gray-400" />}
          className="text-sm rounded-full"
        />
      </div>

      {/* Price Range Filter */}
      <div className="">
        <Select
          value={priceFilter || priceOptions[0].value}
          onChange={(e) => setPriceFilter?.(e.target.value)}
          options={priceOptions}
          trailingIcon={<ChevronDown className="h-5 w-5 text-gray-400" />}
          className="text-sm rounded-full"
          dropdownClassName={'-left-16'}
        />
      </div>
    </div>
  );
};

export default SearchFilters;
