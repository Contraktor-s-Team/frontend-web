import React, { useEffect, useState } from 'react';
import Button from '../../components/Button/Button';
import { Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import ArtisanGrid from './ArtisanGrid';
import TabNav from '../../components/Navigation/TabNav';
import SearchFilters from './SearchFilters';

const FindArtisans = () => {
  const { tab: activeTab = 'all' } = useParams();
  const [artisans, setArtisans] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(8); // Show 8 artisans per page
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('category');
  const [locationFilter, setLocationFilter] = useState('location');
  const [availabilityFilter, setAvailabilityFilter] = useState('availability');
  const [ratingFilter, setRatingFilter] = useState('rating');
  const [priceFilter, setPriceFilter] = useState('price');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/artisans.json');
        const json = await res.json();
        let filteredArtisans = [...json];

        // Filter by saved tab
        if (activeTab === 'saved') {
          filteredArtisans = filteredArtisans.filter((artisan) => artisan.saved);
        }

        // Apply search filtering
        if (searchQuery.trim() !== '') {
          const query = searchQuery.toLowerCase().trim();
          filteredArtisans = filteredArtisans.filter((artisan) => {
            // Search in multiple fields
            return (
              artisan.name.toLowerCase().includes(query) ||
              artisan.specialty.toLowerCase().includes(query) ||
              artisan.location.toLowerCase().includes(query) ||
              (artisan.description && artisan.description.toLowerCase().includes(query)) ||
              artisan.services.some(service => service.toLowerCase().includes(query))
            );
          });
        }

        // Filter by category (specialty)
        if (categoryFilter !== 'category') {
          const formattedCategory = categoryFilter.replace(/-/g, ' ');
          filteredArtisans = filteredArtisans.filter(
            (artisan) => artisan.specialty.toLowerCase() === formattedCategory
          );
        }

        // Filter by location
        if (locationFilter !== 'location') {
          const formattedLocation = locationFilter.replace(/-/g, ' ');
          filteredArtisans = filteredArtisans.filter(
            (artisan) => artisan.location.toLowerCase().includes(formattedLocation)
          );
        }

        // Filter by availability
        if (availabilityFilter !== 'availability') {
          const isAvailable = availabilityFilter === 'available';
          filteredArtisans = filteredArtisans.filter(
            (artisan) => artisan.available === isAvailable
          );
        }

        // Filter by rating
        if (ratingFilter !== 'rating') {
          const minRating = parseFloat(ratingFilter);
          filteredArtisans = filteredArtisans.filter(
            (artisan) => artisan.rating >= minRating
          );
        }

        // Filter by price range
        if (priceFilter !== 'price') {
          filteredArtisans = filteredArtisans.filter(artisan => {
            // Extract numeric values from price range (assuming format like "₦6,000 – ₦15,000")
            const priceText = artisan.priceRange;
            const priceMatch = priceText.match(/₦([\d,]+)\s*[–-]\s*₦([\d,]+)/);
            
            if (priceMatch) {
              const minPrice = parseInt(priceMatch[1].replace(/,/g, ''));
              const maxPrice = parseInt(priceMatch[2].replace(/,/g, ''));
              
              switch(priceFilter) {
                case 'under-5000':
                  return minPrice < 5000;
                case '5000-10000':
                  return minPrice >= 5000 && maxPrice <= 10000;
                case '10000-15000':
                  return minPrice >= 10000 && maxPrice <= 15000;
                case 'above-15000':
                  return maxPrice > 15000;
                default:
                  return true;
              }
            }
            return true;
          });
        }

        setArtisans(filteredArtisans);
      } catch (err) {
        console.error('Error:', err);
      }
    };

    fetchData();
    setCurrentPage(1); // Reset to first page when filters change
  }, [activeTab, searchQuery, categoryFilter, locationFilter, availabilityFilter, ratingFilter, priceFilter]); // Add searchQuery to the dependencies

  // Calculate pagination
  const indexOfLastArtisan = currentPage * resultsPerPage;
  const indexOfFirstArtisan = indexOfLastArtisan - resultsPerPage;
  const currentArtisans = artisans.slice(indexOfFirstArtisan, indexOfLastArtisan);
  const totalPages = Math.ceil(artisans.length / resultsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    }
  };
  const tabs = [
    { id: 'all', label: 'All Artisans' },
    { id: 'saved', label: 'Saved Artisans' }
  ];

  const navigate = useNavigate();
  return (
    <div className="font-inter font-medium">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-manrope text-2xl font-semibold text-gray-900">Find Trusted Artisans Near You</h1>
          <p className="text-neu-dark-1">Browse through verified professionals ready to help with jobs / services</p>
        </div>
        <Button
          variant="secondary"
          leftIcon={<Plus size={20} />}
          onClick={() => navigate('/post-job/describe')}
        >
          Post a Job
        </Button>
      </div>

      <SearchFilters
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        availabilityFilter={availabilityFilter}
        setAvailabilityFilter={setAvailabilityFilter}
        ratingFilter={ratingFilter}
        setRatingFilter={setRatingFilter}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Tabs */}
      <TabNav 
        tabs={tabs} 
        activeTab={activeTab} 
        basePath="/artisans" 
        navClassName="flex flex-wrap items-center gap-10"
      />

      {/* Artisans Grid */}
      <ArtisanGrid artisans={currentArtisans} activeTab={activeTab} />

      {/* Pagination */}
      {artisans.length > 0 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalResults={artisans.length}
            resultsPerPage={resultsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default FindArtisans;
