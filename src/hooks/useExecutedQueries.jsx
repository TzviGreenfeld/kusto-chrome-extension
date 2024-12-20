import { useState, useEffect } from 'react';

export default function useExecutedQueries() {
  const [executedQueries, setExecutedQueries] = useState([]); // Array of {query, frequency}
  const [maxQueriesToShow, setMaxQueriesToShow] = useState(10);

  // Load executed queries from chrome.storage.local on mount
  useEffect(() => {
    chrome.storage.local.get(['executedQueries'], (result) => {
      const queriesMap = result.executedQueries || {};
      const formattedQueries = mapToArray(queriesMap);
      setExecutedQueries(formattedQueries);
    });

    // Load maxQueriesToShow from storage if it exists
    chrome.storage.local.get(['maxQueriesToShow'], (result) => {
      if (result.maxQueriesToShow) {
        setMaxQueriesToShow(result.maxQueriesToShow);
      }
    });
  }, []);

  // Update executed queries when maxQueriesToShow changes
  useEffect(() => {
    chrome.storage.local.get(['executedQueries'], (result) => {
      const queriesMap = result.executedQueries || {};
      const formattedQueries = mapToArray(queriesMap);
      setExecutedQueries(formattedQueries);
    });
  }, [maxQueriesToShow]);

  // Helper function: Convert hashmap to sorted array
  const mapToArray = (queriesMap) => {
    return Object.entries(queriesMap)
      .map(([query, frequency]) => ({ query, frequency })) // Convert to objects
      .sort((a, b) => b.frequency - a.frequency) // Sort by frequency (desc)
      .slice(0, maxQueriesToShow); // Limit results
  };

  // Helper function: Save updated hashmap to storage and state
  const updateExecutedQueries = (queriesMap) => {
    const formattedQueries = mapToArray(queriesMap);
    setExecutedQueries(formattedQueries);
    chrome.storage.local.set({ executedQueries: queriesMap }, () => {
      console.log('Executed queries updated:', queriesMap);
    });
  };

  // Delete a query by its string key
  const deleteExecutedQuery = (query) => {
    chrome.storage.local.get(['executedQueries'], (result) => {
      const updatedQueriesMap = { ...result.executedQueries };
      delete updatedQueriesMap[query];
      updateExecutedQueries(updatedQueriesMap);
    });
  };

  // Update the maximum queries to show
  const updateMaxQueriesToShow = (newMax) => {
    setMaxQueriesToShow(newMax);
    chrome.storage.local.set({ maxQueriesToShow: newMax }, () => {
      console.log(`Max queries to show updated to ${newMax}`);
    });
  };

  return {
    executedQueries,
    maxQueriesToShow,
    updateMaxQueriesToShow,
    deleteExecutedQuery,
  };
}
