import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

const ArtisanJobsContext = createContext();

export const useArtisanJobs = () => {
  const context = useContext(ArtisanJobsContext);
  if (!context) {
    throw new Error('useArtisanJobs must be used within an ArtisanJobsProvider');
  }
  return context;
};

export const ArtisanJobsProvider = ({ children }) => {
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use ref to track if data has been fetched to prevent multiple calls
  const dataFetched = useRef(false);
  const abortController = useRef(null);

  // Single consolidated fetchJobs function
  const fetchJobs = useCallback(
    async (isRetry = false) => {
      // Prevent multiple concurrent calls
      if (!isRetry && (dataFetched.current || loading)) {
        console.log('⏭️ ArtisanJobsContext: Skipping fetch - already fetched or loading');
        return allJobs;
      }

      // Cancel any existing request
      if (abortController.current) {
        abortController.current.abort();
      }

      abortController.current = new AbortController();
      dataFetched.current = true;
      setLoading(true);
      setError(null);

      try {
        console.log(`🚀 ArtisanJobsContext: ${isRetry ? 'Retrying' : 'Fetching'} jobs data...`);
        const response = await fetch('/artisan-jobs.json', {
          signal: abortController.current.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(
          `✅ ArtisanJobsContext: ${isRetry ? 'Retry' : 'Fetch'} successful, fetched:`,
          data?.length || 0,
          'jobs'
        );
        setAllJobs(data);
        setError(null);
        return data;
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('🚫 ArtisanJobsContext: Request was aborted');
          return allJobs;
        }

        console.error('❌ ArtisanJobsContext: Error fetching data:', error);
        setError(error.message);
        setAllJobs([]);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [allJobs, loading]
  );

  // Get job by tab and slug
  const getJobBySlug = useCallback(
    (tab, jobSlug) => {
      if (!allJobs || allJobs.length === 0) {
        return null;
      }

      return allJobs
        .filter((job) => job.tab === tab)
        .find((job) => {
          const slug = job.title
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]/g, '');
          return slug === jobSlug;
        });
    },
    [allJobs]
  );

  // Retry function for failed requests
  const retryFetch = useCallback(() => {
    dataFetched.current = false; // Reset the fetch guard
    setError(null);
    return fetchJobs(true); // Pass true to indicate this is a retry
  }, [fetchJobs]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
    }
  }, []);

  const value = {
    allJobs,
    loading,
    error,
    fetchJobs,
    getJobBySlug,
    retryFetch,
    cleanup
  };

  return <ArtisanJobsContext.Provider value={value}>{children}</ArtisanJobsContext.Provider>;
};
