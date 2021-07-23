import React, { useState } from 'react';
import SortResults from './SortResults';
import ResultCount from '../results/ResultCount';
import Typeahead from '../typeahead/Typeahead';
import TypeaheadSelect from '../typeahead/TypeaheadSelect';
import filterIcon from '../../assets/images/icons/filter-icon.svg';
import AdvancedFilters from './AdvancedFilters';

const Filters = (props) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const toggleShowAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
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
            alt='Advanced filters icon'
            className={showAdvancedFilters ? 'active' : ''}
            id="advanced-filters-icon"
            src={filterIcon}
            onClick={toggleShowAdvancedFilters}
          />
        </div>
      </div>
      {showAdvancedFilters ? <AdvancedFilters /> : null}
    </div>
  );
};

export default Filters;
