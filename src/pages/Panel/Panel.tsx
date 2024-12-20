import React from 'react';

import useUserQueries from '../../hooks/useUserQueries';
import useExecutedQueries from '../../hooks/useExecutedQueries';

import './Panel.css';

const ShowData = ({ name, data }) => {
  return (
    <details>
      <summary>{name}</summary>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </details>
  );
};

const Panel: React.FC = () => {
  const { userQueries } = useUserQueries();
  const { executedQueries, maxQueriesToShow, updateMaxQueriesToShow } =
    useExecutedQueries();

  const handleMaxQueriesChange = (event) => {
    const newValue = parseInt(event.target.value, 10);
    updateMaxQueriesToShow(newValue);
  };

  return (
    <div className="container">
      <ShowData name={'executedQueries'} data={executedQueries} />
      <ShowData name={'maxQueriesToShow'} data={maxQueriesToShow} />
      <input
        type="number"
        value={maxQueriesToShow}
        onChange={handleMaxQueriesChange}
        min="1"
      />
      <hr />
      <ShowData name={'userQueries'} data={userQueries} />
    </div>
  );
};

export default Panel;
