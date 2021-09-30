import React, { useState, useEffect, useRef } from 'react';
import SortResults from './SortResults';
import ResultCount from '../cards/ResultCount';
import Typeahead from '../typeahead/Typeahead';
import TypeaheadSelect from '../typeahead/TypeaheadSelect';
import filterIcon from '../../assets/images/icons/filter-icon.svg';
import AdvancedFilters from './AdvancedFilters';
import { connect } from 'react-redux';

const Filters = props => {
  const ref = useRef();
  const childRef = useRef();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onWindowClick = e => {
      const elem = e.target;
      if (!childRef.current || childRef.current.contains(elem)) return;
      if (!ref.current || ref.current.contains(elem)) return;
      setOpen(false);
    };
    window.addEventListener('mousedown', onWindowClick);
    return () => {
      window.removeEventListener('mousedown', onWindowClick);
    };
  }, [open]);

  const toggleOpen = () => {
    setOpen(!open);
  };

  let iconClassName = '';
  if (open) iconClassName += 'open ';
  if (props.selectionCount > 0) iconClassName += 'has-selection ';
  return (
    <div id='filters-container' className='col justify-center' ref={ref}>
      <div id='filters-inner' className='row space-between justify-center align-center'>
        <div className='filter-group row justify-start align-center'>
          <span className='typeahead-select-label'>Search all passages by</span>
          <TypeaheadSelect />
        </div>
        <Typeahead />
        <div className='filter-group row justify-end align-center'>
          <ResultCount />
          <SortResults />
          <img
            alt='Advanced filters icon'
            className={iconClassName}
            id='advanced-filters-icon'
            src={filterIcon}
            onClick={toggleOpen}
          />
          {props.selectionCount > 0 ? (
            <div id='advanced-filters-selection-count' className='row justify-center align-center'>
              <div>{props.selectionCount}</div>
            </div>
          ) : null}
        </div>
      </div>
      <AdvancedFilters refProp={childRef} open={open} selectionCount={props.selectionCount} />
    </div>
  );
};

const getFilterSelectionCount = advanced => {
  return advanced.changed + advanced.earlier.changed + advanced.later.changed;
};

const mapStateToProps = state => ({
  selectionCount: getFilterSelectionCount(state.search.advanced),
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
