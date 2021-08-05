import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import * as searchActions from '../../actions/search';
import { notNull, getChangedCount } from './Filters'

class AdvancedFilters extends React.Component {
  render() {
    return (
      <div id='advanced-filters' className='row space-between' ref={this.props.refProp}>
        <AdvancedFilterColumn type='earlier' {...this.props} />
        {/*<div className='similarity-circle opacity-0' />*/}
        <AdvancedFilterColumn type='later' {...this.props} />
      </div>
    );
  }
}

const AdvancedFilterColumn = props => {
  const ref = useRef();
  const [dirty, setDirty] = useState(false);

  const setField = (childProps, e) => {
    setDirty(true);
    props.setField({
      earlierLater: childProps.type.toLowerCase(),
      field: childProps.field.field,
      value: e.target.value,
    });
  };

  const clear = () => {
    const elems = ref.current.querySelectorAll('input');
    elems.forEach(e => (e.value = ''));
    props.clear(props.type);
  };

  const search = () => {
    setDirty(false);
    props.search();
  };

  let buttonClass = 'advanced-filter-apply-button';
  buttonClass += dirty ? ' active' : ' disabled';

  const fields = [
    {
      label: 'Author',
      field: 'author',
    },
    {
      label: 'Title',
      field: 'title',
    },
    {
      label: 'File Id',
      field: 'fileId',
    },
  ]

  const clearable = getChangedCount(props.type, props.advanced) > 0;

  return (
    <div className='advanced-filter-column flex-1' ref={ref}>
      <div className='advanced-filter-column-label'>{titleCase(props.type)} Text</div>
      {fields.map(f => {
        return (
          <div key={f.field} className='row justify-start align-center'>
            <div className='label'>{f.label}</div>
            <AdvancedFilterInput
              type={props.type}
              field={f}
              defaultValue={
                notNull(props.advanced[props.type][f.field])
                  ? props.advanced[props.type][f.field]
                  : ''}
              onChange={setField} />
          </div>
        );
      })}
      <div className='advanced-filter-footer justify-end row align-center'>
        <div className={clearable ? 'advanced-filter-clear clearable' : 'advanced-filter-clear disabled'} onClick={clear}>
          Clear
        </div>
        <button className={buttonClass} onClick={search}>
          Apply
        </button>
      </div>
    </div>
  );
};

const AdvancedFilterInput = props => {
  return <input
    type='text'
    defaultValue={props.defaultValue}
    onChange={e => props.onChange(props, e)} />;
};

const titleCase = s => {
  return s.substring(0, 1).toUpperCase() + s.substring(1, s.length).toLowerCase();
};

const mapStateToProps = state => ({
  advanced: state.search.advanced,
});

const mapDispatchToProps = dispatch => ({
  setField: obj => dispatch(searchActions.setAdvancedFilterField(obj)),
  clear: type => dispatch(searchActions.clearAdvancedFilterType(type)),
  search: () => dispatch(searchActions.fetchSearchResults()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdvancedFilters);
