import React, { useState, useEffect, useRef } from 'react';
import SortResults from './SortResults';
import ResultCount from '../results/ResultCount';
import Typeahead from '../typeahead/Typeahead';
import TypeaheadSelect from '../typeahead/TypeaheadSelect';
import filterIcon from '../../assets/images/icons/filter-icon.svg';
import AdvancedFilters from './AdvancedFilters';

const Filters = (props) => {
  const ref = useRef();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onWindowClick = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    window.addEventListener('click', onWindowClick);
    return () => { window.removeEventListener('click', onWindowClick); }
  }, [open])

  const toggleOpen = () => {
    setOpen(!open);
  };

  return (
    <div id="filters-container" className="col justify-center">
      <div
        id="filters-inner"
        className="row space-between justify-center align-center"
      >
        <div className="filter-group row justify-start align-center">
          <span className="typeahead-select-label">Search all passages by</span>
          <TypeaheadSelect />
        </div>
        <Typeahead />
        <div className="filter-group row justify-end align-center">
          <ResultCount />
          <SortResults />
          <img
            ref={ref}
            alt="Advanced filters icon"
            className={open ? 'active' : ''}
            id="advanced-filters-icon"
            src={filterIcon}
            onClick={toggleOpen}
          />
        </div>
      </div>
      {open ? <AdvancedFilters /> : null}
    </div>
  );
};

export default Filters;
