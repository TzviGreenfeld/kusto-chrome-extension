import React from 'react';

import useExecutedQueries from '../../hooks/useExecutedQueries';

import CodeBlockList from '../../components/CodeBlockList';

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

  const setFrequencyAsTitle = (query) => {
    return { title: `Execution Count: ${query.frequency}`, query: query.query };
  };

  return (
    <>
      <div className="options-container">
        <h1>Executed Queries</h1>
        <span className="header">
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

        <CodeBlockList codes={executedQueries.map(setFrequencyAsTitle)} />
      </div>
    </>
  );
};

export default Options;
