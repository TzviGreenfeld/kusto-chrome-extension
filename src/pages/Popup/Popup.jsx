import React from 'react';
import useUserQueries from '../../hooks/useUserQueries';

import CodeBlockList from '../../components/CodeBlockList';
import QueryInput from '../../components/QueryInput';

const Popup = () => {
  const { userQueries, saveUserQuery, deleteUserQuery } = useUserQueries();
  return (
    <div className="popup-container">
      <QueryInput handleSave={saveUserQuery} />
      <hr />
      <CodeBlockList codes={userQueries} onDeleteUserQuery={deleteUserQuery} />
    </div>
  );
};

export default Popup;
