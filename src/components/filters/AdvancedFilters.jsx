import React from 'react';

const AdvancedFilters = (props) => {
  return (
    <div id="advanced-filters" className="row space-between">
      <AdvancedFilterColumn type="earlier" />
      {/*<div className='similarity-circle opacity-0' />*/}
      <AdvancedFilterColumn type="later" />
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
    ['Passage', setPassage],
  ];

  return (
    <div className={`advanced-filter-column flex-1 ${props.type}`}>
      {rows.map((r) => {
        const [label, onChange] = r;
        return (
          <div key={label} className="row justify-start align-center">
            <div className="label">{label}</div>
            <input type="text"></input>
          </div>
        );
      })}
    </div>
  );
};

export default AdvancedFilters;
