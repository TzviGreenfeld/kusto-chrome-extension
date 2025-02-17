import React, { ChangeEvent } from 'react';
import useExecutedQueries, {
  ExecutedQuery,
} from '../../hooks/useExecutedQueries';

import CodeBlockTable from '../../components/CodeBlockTable';
import Header from '../../components/Header';

import './Options.css';

interface OptionsProps {
  title?: string;
}

const Options: React.FC<OptionsProps> = ({ title }) => {
  const {
    executedQueries,
    maxQueriesToShow,
    updateMaxQueriesToShow,
    deleteExecutedQuery,
  } = useExecutedQueries();

  const handleMaxQueriesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    updateMaxQueriesToShow(newValue);
  };

  return (
    <>
      <div className="options-container">
        {/* <span className="header">
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
        </span> */}
        <Header />
        <CodeBlockTable executedQueries={executedQueries as ExecutedQuery[]} />
      </div>
    </>
  );
};

export default Options;
