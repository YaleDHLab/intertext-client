import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import * as searchActions from '../../actions/search';
import { getChangedCount } from './Filters';
import Slider from 'rc-slider';

const Range = Slider.createSliderWithTooltip(Slider.Range);

class AdvancedFilters extends React.Component {
  render() {
    const { open, refProp } = {...this.props}
    return (
      <div id='advanced-filters' className={`row space-between ${open ? 'open' : ''}`} ref={refProp}>
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

  const setField = (type, field, val) => {
    setDirty(true);
    props.setField({
      earlierLater: type.toLowerCase(),
      field: field.toLowerCase(),
      value: val,
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
      type: 'input',
    },
    {
      label: 'Title',
      field: 'title',
      type: 'input',
    },
    {
      label: 'File Id',
      field: 'fileId',
      type: 'input',
    },
    {
      label: 'Match Length',
      field: 'length',
      type: 'range'
    }
  ];

  const clearable = getChangedCount(props.type, props.advanced) > 0;

  return (
    <div className='advanced-filter-column flex-1' ref={ref}>
      <div className='advanced-filter-column-label'>{titleCase(props.type)} Text</div>
      {fields.map(f => {
        return (
          <div key={f.field} className='row justify-start align-center'>
            <div className='label'>{f.label}</div>
            {
              f.type === 'input'
                ? <AdvancedFilterInput
                    type={props.type}
                    field={f.field}
                    defaultValue={props.advanced[props.type][f.field]}
                    onChange={setField}
                  />
                : f.type === 'range'
                  ? <Range
                      min={1}
                      max={25}
                      step={1}
                      value={props.advanced[props.type][f.field]}
                      onChange={(val) => setField(props.type, f.field, val)}
                    />
                  : null
            }
          </div>
        );
      })}
      <div className='advanced-filter-footer justify-end row align-center'>
        <div
          className={
            clearable ? 'advanced-filter-clear clearable' : 'advanced-filter-clear disabled'
          }
          onClick={clear}
        >
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
  return (
    <input type='text' defaultValue={props.defaultValue} onChange={e => props.onChange(props.type, props.field, e.target.value)} />
  );
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
