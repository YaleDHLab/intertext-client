import React from 'react';
import Results from './Results';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchSearchResults } from '../../actions/search';
import { setTypeaheadQuery, setTypeaheadIndex } from '../../actions/typeahead';

const Typeahead = (props) => {
  const handleKeyUp = (e) => {
    var index = props.index;
    // up arrow
    if (e.keyCode === 38) {
      if (index - 1 >= 0) {
        props.setTypeaheadIndex(index - 1);
      }
      // down arrow
    } else if (e.keyCode === 40) {
      if (index + 1 <= props.results.length) {
        props.setTypeaheadIndex(index + 1);
      }
      // enter key
    } else if (e.keyCode === 13) {
      submitSearch();
    }
  };

  const handleChange = (e) => {
    if (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 13) return;
    props.setTypeaheadQuery(e.target.value);
    props.setTypeaheadIndex(0);
  };

  const submitSearch = () => {
    // identify the search phrase requested by the user
    const phrase =
      props.index === 0 ? props.query : props.results[props.index - 1];
    props.setTypeaheadQuery(phrase);
    // submit the search and remove focus from the input
    props.fetchSearchResults();
    document.querySelector('.typeahead input').blur();
  };

  return (
    <div className="typeahead">
      <div className="search-button" />
      <input
        value={props.query}
        onKeyUp={handleKeyUp}
        onChange={handleChange}
      />
      <Results submitSearch={submitSearch} />
    </div>
  );
};

Typeahead.propTypes = {
  fetchSearchResults: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  query: PropTypes.string.isRequired,
  results: PropTypes.arrayOf(PropTypes.string),
  setTypeaheadIndex: PropTypes.func.isRequired,
  setTypeaheadQuery: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  index: state.typeahead.index,
  results: state.typeahead.results,
  query: state.typeahead.query
});

const mapDispatchToProps = (dispatch) => ({
  setTypeaheadQuery: (val) => dispatch(setTypeaheadQuery(val)),
  setTypeaheadIndex: (val) => dispatch(setTypeaheadIndex(val)),
  fetchSearchResults: () => dispatch(fetchSearchResults())
});

export default connect(mapStateToProps, mapDispatchToProps)(Typeahead);
