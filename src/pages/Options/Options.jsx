import React from 'react';

import useExecutedQueries from '../../hooks/useExecutedQueries';

import CodeBlockTable from '../../components/CodeBlockTable';

import './Options.css';

const Options = ({ title }) => {
  const {
    executedQueries,
    maxQueriesToShow,
    updateMaxQueriesToShow,
    deleteExecutedQuery,
  } = useExecutedQueries();

  const handleMaxQueriesChange = (event) => {
    const newValue = parseInt(event.target.value, 10);
    updateMaxQueriesToShow(newValue);
  };

  console.log('executedQueries', executedQueries);
  const setFrequencyAsTitle = (query) => {
    return { title: `Execution Count: ${query.frequency}`, query: query.query };
  };

  return (
    <>
      <div className="options-container">
        <span className="header">
          <h1>Executed Queries</h1>
          <label htmlFor="maxQueries" className="max-queries">
            Limit:
          </label>
          <input
            type="number"
            className="max-queries"
            id="maxQueries"
            min="1"
            value={maxQueriesToShow}
            onChange={handleMaxQueriesChange}
          />
        </span>

        <CodeBlockTable codes={executedQueries.map(setFrequencyAsTitle)} />
      </div>
    </>
  );
};

export default Options;
