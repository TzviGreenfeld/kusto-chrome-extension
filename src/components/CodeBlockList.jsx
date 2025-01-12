import React, { useState, useMemo } from 'react';

import { useCopyToClipboard } from '@uidotdev/usehooks';

import Divider from '@mui/material/Divider';

import useDebouncedValue from '../hooks/useDebouncedValue';

import KustoCodeBlock from './KustoCodeBlock';

import './styles/CodeBlockList.css';

function CodeBlockList({ codes = [], onDeleteUserQuery }) {
  const [searchText, setSearchText] = useState('');
  const [copiedText, copyToClipboard] = useCopyToClipboard();

  const debouncedSearchText = useDebouncedValue(searchText, 200);

  const filteredCodes = useMemo(() => {
    return codes.filter((query) => hasSearchTerm(query, debouncedSearchText));
  }, [codes, debouncedSearchText]);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  return (
    <div className="code-block-list-container">
      <input
        type="search"
        value={searchText}
        onChange={handleSearchChange}
        placeholder="Search..."
      />
      {filteredCodes.map((query, index) => (
        <div key={`${index}-${query.query}`} className="list-item">
          <KustoCodeBlock
            code={query.query}
            title={query.title}
            words={debouncedSearchText}
            contextMenuId={`context-menu-${index}`}
            menuItems={[
              {
                id: 'copy',
                label: 'Copy',
                onOptionClick: () => copyToClipboard(query.query),
                style: { backgroundColor: 'rgba(229, 231, 235, 1)' },
              },
              {
                id: 'explain',
                label: 'Explain',
                onOptionClick: (id) => console.log(`Option ${id}`),
              },
              {
                id: 'optimize',
                label: 'Optimize',
                onOptionClick: (id) => console.log(`Option ${id}`),
              },
              {
                id: 'delete',
                label: 'Delete',
                onOptionClick: () => onDeleteUserQuery(index),
                style: { backgroundColor: 'rgba(255, 0, 0, 0.3)' },
              },
            ]}
          />
          <Divider />
        </div>
      ))}
    </div>
  );
}

export default CodeBlockList;

const hasSearchTerm = (query, term) => {
  return [query.title || '', query.query || '']
    .map((s) => s.toLowerCase())
    .some((s) => s.includes(term.toLowerCase()));
};
