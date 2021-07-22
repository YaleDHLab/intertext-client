import React from 'react';

const AdvancedFilters = (props) => {
  return (
    <div id="advanced-filters" className="row space-between">
      <AdvancedFilterColumn />
      <AdvancedFilterColumn />
    </div>
  );
};

const AdvancedFilterColumn = (props) => {
  const setAuthor = (e) => {
    console.log(e);
  };
  const setTitle = (e) => {
    console.log(e);
  };
  const setDate = (e) => {
    console.log(e);
  };
  const setPassage = (e) => {
    console.log(e);
  };

  const rows = [
    ['Author', setAuthor],
    ['Title', setTitle],
    ['Date', setDate],
    ['Passage', setPassage]
  ];

  return (
    <div className="advanced-filter-column flex-1">
      {rows.map((r) => {
        const [label, onChange] = r;
        return (
          <div className="row justify-start align-center">
            <div className="label">{label}</div>
            <input type="text"></input>
          </div>
        );
      })}
    </div>
  );
};

export default AdvancedFilters;
