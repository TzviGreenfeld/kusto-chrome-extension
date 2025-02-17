import { useState, useEffect } from 'react';

export interface ExecutedQuery {
  query: string;
  count: number;
  lastExecution: string;
}

export default function useExecutedQueries() {
  const [executedQueries, setExecutedQueries] = useState<ExecutedQuery[]>([]);
  const [maxQueriesToShow, setMaxQueriesToShow] = useState<number>(10);

  useEffect(() => {
    chrome.storage.local.get(['executedQueries'], (result) => {
      const queriesMap = result.executedQueries || {};
      const formattedQueries = mapToArray(queriesMap);
      setExecutedQueries(formattedQueries);
    });

    chrome.storage.local.get(['maxQueriesToShow'], (result) => {
      if (result.maxQueriesToShow) {
        setMaxQueriesToShow(result.maxQueriesToShow);
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.get(['executedQueries'], (result) => {
      const queriesMap = result.executedQueries || {};
      const formattedQueries = mapToArray(queriesMap);
      setExecutedQueries(formattedQueries);
    });
  }, [maxQueriesToShow]);

  const mapToArray = (
    queriesMap: Record<string, { count: number; lastExecution: string }>
  ): ExecutedQuery[] => {
    return Object.entries(queriesMap)
      .map(([query, { count, lastExecution }]) => ({
        query,
        count,
        lastExecution,
      }))
      .sort(
        (a, b) =>
          new Date(b.lastExecution).getTime() -
          new Date(a.lastExecution).getTime()
      )
      .slice(0, maxQueriesToShow);
  };

  const updateExecutedQueries = (
    queriesMap: Record<string, { count: number; lastExecution: string }>
  ): void => {
    const formattedQueries = mapToArray(queriesMap);
    setExecutedQueries(formattedQueries);
    chrome.storage.local.set({ executedQueries: queriesMap }, () => {
      console.log('Executed queries updated:', queriesMap);
    });
  };

  const deleteExecutedQuery = (query: string): void => {
    chrome.storage.local.get(['executedQueries'], (result) => {
      const updatedQueriesMap = { ...result.executedQueries };
      delete updatedQueriesMap[query];
      updateExecutedQueries(updatedQueriesMap);
    });
  };

  const updateMaxQueriesToShow = (newMax: number): void => {
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
