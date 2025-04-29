import React from 'react';

function SearchBox({ onSearch, searchText }) {
  return (
    <input
      type="text"
      placeholder="Search by Name..."
      value={searchText}
      onChange={(e) => onSearch(e.target.value)}
      style={{ padding: '7px', width: '300px' }}
    />
  );
}

export default SearchBox;