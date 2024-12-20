import { useState, useEffect } from 'react';

const useUserQueries = () => {
  const [userQueries, setUserQueries] = useState([]);
  console.log('useUserQueries renderd!');
  // Fetch the initial data from chrome.storage.local
  useEffect(() => {
    chrome.storage.local.get(['userQueries'], (data) => {
      const queries = data.userQueries || []; // Correctly access 'userQueries'
      setUserQueries(queries);
      console.log('Fetched user queries:', queries);
    });
  }, []);

  // Save a new query
  const saveUserQuery = (newQuery) => {
    chrome.storage.local.get(['userQueries'], (result) => {
      const existingQueries = result.userQueries || [];
      const updatedQueries = [...existingQueries, newQuery];

      chrome.storage.local.set({ userQueries: updatedQueries }, () => {
        setUserQueries(updatedQueries);
        console.log('Query saved:', newQuery);
      });
    });
  };

  // Delete a query by index
  const deleteUserQuery = (index) => {
    chrome.storage.local.get(['userQueries'], (result) => {
      const existingQueries = result.userQueries || [];
      const updatedQueries = existingQueries.filter((_, i) => i !== index);
      chrome.storage.local.set({ userQueries: updatedQueries }, () => {
        setUserQueries([...updatedQueries]);
        console.log(`Query at index ${index} deleted.`);
      });
    });
  };

  return {
    userQueries,
    saveUserQuery,
    deleteUserQuery,
  };
};

export default useUserQueries;
