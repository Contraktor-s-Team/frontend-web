import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

function Pagination({
  currentPage = 1,
  totalPages,
  totalResults,
  resultsPerPage,
  onPageChange = () => {},
  showResultsText = true
}) {
  const getVisiblePages = () => {
    // Handle edge cases
    if (!totalPages || totalPages <= 0) {
      return [];
    }
    
    if (totalPages === 1) {
      return [1];
    }
    
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) { // Only add the last page if it's different from the first
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();
  const paginationRef = useRef(null);

  // Scroll to top of the page or nearest scrollable container when page changes
  const scrollToTop = () => {
    const main = document.querySelector('main');
    if (main) {
      main.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (paginationRef.current) {
      paginationRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToTop();
  }, [currentPage]);

  // Calculate values for results text
  const startResult = totalResults > 0 ? (currentPage - 1) * resultsPerPage + 1 : 0;
  const endResult = Math.min(currentPage * resultsPerPage, totalResults);
  
  // Don't render pagination if there are no results or only one page
  const shouldShowPagination = totalPages > 1;
  
  return (
    <div ref={paginationRef} className="flex items-center justify-between py-3">
      {/* Results text */}
      {showResultsText && (
        <div className="text-sm text-gray-700">
          {totalResults > 0 &&
            `Showing ${startResult} to ${endResult} of ${totalResults} results`}
        </div>
      )}

      {/* Only show pagination controls if there's more than one page */}
      {shouldShowPagination && (
        <div className="flex items-center gap-2">
          {/* Previous button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex flex-col justify-center items-center w-12 h-12 font-medium rounded-full ${
              currentPage === 1
                ? 'text-neu-norm-1 cursor-not-allowed'
                : 'text-neu-norm-2 hover:text-neu-dark-3 hover:bg-neu-light-2 cursor-pointer'
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Page numbers */}
          {visiblePages.map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-3 py-2 font-medium text-neu-norm-1">
                  ...
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`cursor-pointer flex flex-col justify-center items-center w-12 h-12 font-medium rounded-full ${
                  currentPage === page
                    ? 'bg-blue-50 border border-pri-light-1 text-pri-norm-1'
                    : 'text-neu-norm-1 hover:text-neu-dark-3 hover:bg-neu-light-2'
                }`}
              >
                {page}
              </button>
            );
          })}

          {/* Next button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex flex-col justify-center items-center w-12 h-12 font-medium rounded-full ${
              currentPage === totalPages
                ? 'text-neu-norm-1 cursor-not-allowed'
                : 'text-neu-norm-2 hover:text-neu-dark-3 hover:bg-neu-light-2 cursor-pointer'
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default Pagination;
