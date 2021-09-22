import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import * as searchActions from '../../actions/search';
import Slider from 'rc-slider';

const Range = Slider.createSliderWithTooltip(Slider.Range);

class AdvancedFilters extends React.Component {
  constructor(props) {
    super(props);
    this.setLength = this.setLength.bind(this);
    this.setDisplayedLength = this.setDisplayedLength.bind(this);
    this.setSimilarity = this.setSimilarity.bind(this);
    this.setDisplayedSimilarity = this.setDisplayedSimilarity.bind(this);
    this.clearAdvanced = this.clearAdvanced.bind(this);
  }

  setDisplayedLength(val) {
    this.props.setDisplayedLength(val);
  }

  setLength(val) {
    this.props.setLength(val);
    this.props.search();
  }

  setDisplayedSimilarity(val) {
    this.props.setDisplayedSimilarity(val);
  }

  setSimilarity(val) {
    this.props.setSimilarity(val);
    this.props.search();
  }

  clearAdvanced() {
    clearInputs(document.querySelector('#advanced-filter-columns'));
    this.props.clearAdvanced();
  }

  render() {
    const { open, selectionCount, refProp, displayedLength, displayedSimilarity } = {
      ...this.props,
    };
    let className = 'col space-between ';
    if (open) className += 'open ';
    if (selectionCount > 0) className += 'changed ';
    return (
      <div id='advanced-filters' className={className} ref={refProp}>
        <div id='clear-advanced-filter' onClick={this.clearAdvanced}>
          Clear ⨉
        </div>
        <div id='shared-advanced-filters'>
          <div className='shared-advanced-filter row align-center'>
            <div className='label'>Match Length</div>
            <Range
              min={1}
              max={25}
              step={1}
              value={displayedLength}
              onChange={val => this.setDisplayedLength(val)}
              onAfterChange={val => this.setLength(val)}
            />
          </div>
          <div className='shared-advanced-filter row align-center'>
            <div className='label'>Similarity</div>
            <Range
              min={1}
              max={100}
              step={1}
              value={displayedSimilarity}
              onChange={val => this.setDisplayedSimilarity(val)}
              onAfterChange={val => this.setSimilarity(val)}
            />
          </div>
        </div>
        <div id='advanced-filter-columns' className='row'>
          <AdvancedFilterColumn earlierLater='earlier' {...this.props} />
          <AdvancedFilterColumn earlierLater='later' {...this.props} />
        </div>
      </div>
    );
  }
}

const AdvancedFilterColumn = props => {
  const ref = useRef();
  const [dirty, setDirty] = useState(false);

  const setField = (earlierLater, field, val) => {
    setDirty(true);
    props.setField({
      earlierLater: earlierLater,
      field: field,
      value: val,
    });
  };

  const clearColumn = () => {
    clearInputs(ref.current);
    props.clearColumn(props.earlierLater);
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
      type: 'text',
    },
    {
      label: 'Title',
      field: 'title',
      type: 'text',
    },
    {
      label: 'File Id',
      field: 'fileId',
      type: 'number',
    },
  ];

  return (
    <div className='advanced-filter-column flex-1' ref={ref}>
      <div className='advanced-filter-column-label'>{titleCase(props.earlierLater)} Text</div>
      {fields.map(f => {
        return (
          <div key={f.field} className='row justify-start align-center'>
            <div className='label'>{f.label}</div>
            {f.type === 'text' || f.type === 'number' ? (
              <AdvancedFilterInput
                type={f.type}
                field={f.field}
                earlierLater={props.earlierLater}
                defaultValue={props.advanced[props.earlierLater][f.field]}
                onChange={setField}
              />
            ) : null}
          </div>
        );
      })}
      <div className='advanced-filter-footer justify-end row align-center'>
        <div
          className={
            props.advanced[props.earlierLater].changed > 0
              ? 'advanced-filter-clear clearable'
              : 'advanced-filter-clear disabled'
          }
          onClick={clearColumn}
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
    <input
      defaultValue={props.defaultValue}
      onChange={e => props.onChange(props.earlierLater, props.field, e.target.value)}
      type={props.type}
    />
  );
};

const clearInputs = elem => {
  const elems = elem.querySelectorAll('input');
  elems.forEach(e => (e.value = ''));
};

const titleCase = s => {
  return s.substring(0, 1).toUpperCase() + s.substring(1, s.length).toLowerCase();
};

const mapStateToProps = state => ({
  advanced: state.search.advanced,
  length: state.search.advanced.length,
  displayedLength: state.search.advanced.displayedLength,
  similarity: state.search.advanced.similarity,
  displayedSimilarity: state.search.advanced.displayedSimilarity,
});

const mapDispatchToProps = dispatch => ({
  setField: obj => dispatch(searchActions.setAdvancedFilterField(obj)),
  setLength: val => dispatch(searchActions.setLength(val)),
  setDisplayedLength: val => dispatch(searchActions.setDisplayedLength(val)),
  setSimilarity: val => dispatch(searchActions.setSimilarity(val)),
  setDisplayedSimilarity: val => dispatch(searchActions.setDisplayedSimilarity(val)),
  clearColumn: type => dispatch(searchActions.clearAdvancedFilterType(type)),
  search: () => dispatch(searchActions.fetchSearchResults()),
  clearAdvanced: () => dispatch(searchActions.clearAdvancedFilters()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdvancedFilters);
