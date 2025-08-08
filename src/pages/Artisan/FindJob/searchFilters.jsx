import React from 'react';
import { Search, ChevronDown, Calendar } from 'lucide-react';
import { Select, TextInput } from '../../../components/Form';
// import { Select, TextInput } from '../../../components/Form';

const SearchFilters = ({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  locationFilter,
  setLocationFilter,
  datePostedFilter,
  setDatePostedFilter,
  dateNeededFilter,
  setDateNeededFilter,
}) => {
  const categoryOptions = [
    { value: '', label: 'Category' },
    { value: 'mechanic', label: 'Mechanic' },
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

  const locationOptions = [
    { value: '', label: 'Location' },
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

  const datePostedOptions = [
    { value: '', label: 'Date Posted' },
    { value: '24h', label: 'Last 24 hours' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
  ];

  const dateNeededOptions = [
    { value: '', label: 'Date Needed' },
    { value: '24h', label: 'Last 24 hours' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Search Field */}
      <div className="flex-1 w-full min-w-[250px]">
        <TextInput
          leadingIcon={<Search size={20} />}
          inputClassName="rounded-full pr-6"
          placeholder="Search by job title, location, or category"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Date Posted */}
      <div className="">
      <Select
        value={datePostedFilter || ''}
        onChange={(e) => setDatePostedFilter?.(e.target.value)}
        options={datePostedOptions}
        trailingIcon={<ChevronDown className="h-5 w-5 text-gray-400" />}
        className="text-sm rounded-full"
      />
      </div>

      {/* Category */}
      <div className="">
      <Select
        value={categoryFilter || ''}
        onChange={(e) => setCategoryFilter?.(e.target.value)}
        options={categoryOptions}
        trailingIcon={<ChevronDown className="h-5 w-5 text-gray-400" />}
        className="text-sm rounded-full"
      />
      </div>

      {/* Location */}
      <div className="">
      <Select
        value={locationFilter || ''}
        onChange={(e) => setLocationFilter?.(e.target.value)}
        options={locationOptions}
        trailingIcon={<ChevronDown className="h-5 w-5 text-gray-400" />}
        className="text-sm rounded-full"
      />
      </div>

      {/* Date Needed */}
      <div className="">
      <Select
        value={dateNeededFilter || ''}
        onChange={(e) => setDateNeededFilter?.(e.target.value)}
        options={dateNeededOptions}
        trailingIcon={<ChevronDown className="h-5 w-5 text-gray-400" />}
        className="text-sm rounded-full"
        dropdownClassName={'-left-10'}
      />
      </div>
    </div>
  );
};

export default SearchFilters;
