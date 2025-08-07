import React, { useEffect, useState } from 'react';
import Button from '../../../components/Button/Button';
import { Plus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import Pagination from '../../../components/Pagination';
import ArtisanGrid from './ArtisanGrid';
import TabNav from '../../../components/Navigation/TabNav';
import SearchFilters from './SearchFilters';
import PageHeader from '../../../components/PageHeader/PageHeader';
import { getAllArtisanAction } from '../../../redux/Artisan/ArtisanAction';
import { connect } from 'react-redux';

const FindArtisans = ({
  loading,
  data,
  error,
  getArtisan
}) => {
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

  useEffect(()=>{
    getArtisan()
  },[])

   // Transform API data to match frontend expectations
  const transformArtisanData = (apiData) => {
    if (!apiData || !Array.isArray(apiData)) return [];
    
    return apiData.map((item) => {
      const { artisan, subcategories = [] } = item;
      
      // Extract subcategory information
      const subcategoryNames = subcategories.map(sub => sub.subcategory?.name).filter(Boolean);
      const primaryCategory = subcategoryNames[0] || 'General';
      
      return {
        id: artisan.id,
        name: `${artisan.firstName || ''} ${artisan.lastName || ''}`.trim() || 'Unknown Artisan',
        email: artisan.email,
        specialty: primaryCategory,
        location: artisan.address || 'Location not specified',
        image: artisan.imageUrl || '/api/placeholder/300/200', // Fallback image
        rating: 4.5, // Default rating since not in API
        available: artisan.isActive,
        services: subcategoryNames.length > 0 ? subcategoryNames : [primaryCategory],
        priceRange: '₦5,000 – ₦15,000', // Default range since not in API
        description: subcategories[0]?.subcategory?.description || '',
        saved: false, // Default value for saved state
        phoneNumber: artisan.phoneNumber,
        emailConfirmed: artisan.emailConfirmed,
        numberConfirmed: artisan.numberConfirmed,
        assignedAt: subcategories[0]?.assignedAt
      };
    });
  };

  useEffect(() => {
    if (data && Array.isArray(data)) {
      let transformedArtisans = transformArtisanData(data);
      let filteredArtisans = [...transformedArtisans];

      // Filter by saved tab
      if (activeTab === 'saved') {
        filteredArtisans = filteredArtisans.filter((artisan) => artisan.saved);
      }

      // Apply search filtering
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        filteredArtisans = filteredArtisans.filter((artisan) => {
          return (
            artisan.name.toLowerCase().includes(query) ||
            artisan.specialty.toLowerCase().includes(query) ||
            artisan.location.toLowerCase().includes(query) ||
            (artisan.description && artisan.description.toLowerCase().includes(query)) ||
            artisan.services.some(service => service.toLowerCase().includes(query)) ||
            (artisan.email && artisan.email.toLowerCase().includes(query))
          );
        });
      }

      // Filter by category (specialty)
      if (categoryFilter !== 'category') {
        const formattedCategory = categoryFilter.replace(/-/g, ' ');
        filteredArtisans = filteredArtisans.filter(
          (artisan) => artisan.specialty.toLowerCase() === formattedCategory.toLowerCase()
        );
      }

      // Filter by location
      if (locationFilter !== 'location') {
        const formattedLocation = locationFilter.replace(/-/g, ' ');
        filteredArtisans = filteredArtisans.filter(
          (artisan) => artisan.location.toLowerCase().includes(formattedLocation.toLowerCase())
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
    }
    
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [data, activeTab, searchQuery, categoryFilter, locationFilter, availabilityFilter, ratingFilter, priceFilter]);

  // Show loading state
   // Show error state - check if error has meaningful content
 const hasError = error && (
    error.message || 
    error.error || 
    (typeof error === 'string' && error.length > 0)
  );

  if (hasError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Find Artisans"
          subtitle="Browse and hire skilled professionals for your needs"
          buttonText="Post a Job"
          buttonVariant="secondary"
          buttonHref="/customer/post-job/describe"
          buttonIcon={<Plus size={18} />}
        />
        <div className="text-center py-20">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium mb-2">Error loading artisans</h3>
            <p className="text-gray-600">{error.message || error.error || 'Something went wrong'}</p>
          </div>
          <Button 
            variant="primary" 
            onClick={() => getArtisan()}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }


  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await fetch('/artisans.json');
  //       const json = await res.json();
  //       let filteredArtisans = [...json];

  //       // Filter by saved tab
  //       if (activeTab === 'saved') {
  //         filteredArtisans = filteredArtisans.filter((artisan) => artisan.saved);
  //       }

  //       // Apply search filtering
  //       if (searchQuery.trim() !== '') {
  //         const query = searchQuery.toLowerCase().trim();
  //         filteredArtisans = filteredArtisans.filter((artisan) => {
  //           // Search in multiple fields
  //           return (
  //             artisan.name.toLowerCase().includes(query) ||
  //             artisan.specialty.toLowerCase().includes(query) ||
  //             artisan.location.toLowerCase().includes(query) ||
  //             (artisan.description && artisan.description.toLowerCase().includes(query)) ||
  //             artisan.services.some(service => service.toLowerCase().includes(query))
  //           );
  //         });
  //       }

  //       // Filter by category (specialty)
  //       if (categoryFilter !== 'category') {
  //         const formattedCategory = categoryFilter.replace(/-/g, ' ');
  //         filteredArtisans = filteredArtisans.filter(
  //           (artisan) => artisan.specialty.toLowerCase() === formattedCategory
  //         );
  //       }

  //       // Filter by location
  //       if (locationFilter !== 'location') {
  //         const formattedLocation = locationFilter.replace(/-/g, ' ');
  //         filteredArtisans = filteredArtisans.filter(
  //           (artisan) => artisan.location.toLowerCase().includes(formattedLocation)
  //         );
  //       }

  //       // Filter by availability
  //       if (availabilityFilter !== 'availability') {
  //         const isAvailable = availabilityFilter === 'available';
  //         filteredArtisans = filteredArtisans.filter(
  //           (artisan) => artisan.available === isAvailable
  //         );
  //       }

  //       // Filter by rating
  //       if (ratingFilter !== 'rating') {
  //         const minRating = parseFloat(ratingFilter);
  //         filteredArtisans = filteredArtisans.filter(
  //           (artisan) => artisan.rating >= minRating
  //         );
  //       }

  //       // Filter by price range
  //       if (priceFilter !== 'price') {
  //         filteredArtisans = filteredArtisans.filter(artisan => {
  //           // Extract numeric values from price range (assuming format like "₦6,000 – ₦15,000")
  //           const priceText = artisan.priceRange;
  //           const priceMatch = priceText.match(/₦([\d,]+)\s*[–-]\s*₦([\d,]+)/);
            
  //           if (priceMatch) {
  //             const minPrice = parseInt(priceMatch[1].replace(/,/g, ''));
  //             const maxPrice = parseInt(priceMatch[2].replace(/,/g, ''));
              
  //             switch(priceFilter) {
  //               case 'under-5000':
  //                 return minPrice < 5000;
  //               case '5000-10000':
  //                 return minPrice >= 5000 && maxPrice <= 10000;
  //               case '10000-15000':
  //                 return minPrice >= 10000 && maxPrice <= 15000;
  //               case 'above-15000':
  //                 return maxPrice > 15000;
  //               default:
  //                 return true;
  //             }
  //           }
  //           return true;
  //         });
  //       }

  //       setArtisans(filteredArtisans);
  //     } catch (err) {
  //       console.error('Error:', err);
  //     }
  //   };

  //   fetchData();
  //   setCurrentPage(1); // Reset to first page when filters change
  // }, [activeTab, searchQuery, categoryFilter, locationFilter, availabilityFilter, ratingFilter, priceFilter]); // Add searchQuery to the dependencies

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


  return (
    <div className="space-y-6">
      <PageHeader
        title="Find Artisans"
        subtitle="Browse and hire skilled professionals for your needs"
        buttonText="Post a Job"
        buttonVariant="secondary"
        buttonHref="/customer/post-job/describe"
        buttonIcon={<Plus size={18} />}
      />

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
        basePath="/customer/artisans" 
        navClassName="flex flex-wrap items-center gap-10"
      />

      {/* Artisans Grid */}
      <ArtisanGrid 
        artisans={currentArtisans} 
        activeTab={activeTab}
        searchQuery={searchQuery}
        categoryFilter={categoryFilter !== 'category' ? categoryFilter : ''}
        locationFilter={locationFilter !== 'location' ? locationFilter : ''}
        onClearFilters={() => {
          setSearchQuery('');
          setCategoryFilter('category');
          setLocationFilter('location');
          setAvailabilityFilter('availability');
          setRatingFilter('rating');
          setPriceFilter('price');
        }}
      />

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

const mapStoreToProps = (state) => {
  console.log(state);
  return {
    loading: state?.allArtisan?.loading,
    data: state?.allArtisan?.data,
    error: state?.allArtisan?.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getArtisan: () => dispatch(getAllArtisanAction()),
  };
}
export default connect(mapStoreToProps, mapDispatchToProps)(FindArtisans);
