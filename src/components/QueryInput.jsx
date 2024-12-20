import React, { useState } from 'react';
import { RiSaveLine } from 'react-icons/ri';

import './styles/QueryInput.css';

export default function QueryInput({ handleSave }) {
  const [query, setQuery] = useState('');
  const [title, setTitle] = useState('');

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const resetStates = () => {
    setTitle('');
    setQuery('');
  };

  return (
    <div className="query-input-wrapper">
      <input
        type="text"
        className="title-input"
        placeholder="Untitled"
        value={title}
        onChange={handleTitleChange}
      ></input>
      <textarea
        className="query-input"
        value={query}
        onChange={handleQueryChange}
        placeholder="Enter your query here..."
      ></textarea>
      <button
        className="save-btn"
        onClick={() => {
          handleSave({ title, query });
          resetStates();
        }}
      >
        <RiSaveLine className="icon" />
        Save
      </button>
    </div>
  );
}
