import React from 'react';
import SortResults from './SortResults';
import ResultCount from '../results/ResultCount';
import Typeahead from '../typeahead/Typeahead';
import TypeaheadSelect from '../typeahead/TypeaheadSelect';

class Filters extends React.Component {
  render() {
    return (
      <div className="filters-container row justify-center">
        <div className="filters row space-between justify-center align-center">
          <div className="row justify-start align-center filter-group">
            <span className="typeahead-select-label">
              Search all passages by
            </span>
            <TypeaheadSelect />
          </div>
          <Typeahead />
          <div className="row justify-end align-center filter-group">
            <ResultCount />
            <SortResults />
          </div>
        </div>
      </div>
    );
  }
}

export default Filters;
