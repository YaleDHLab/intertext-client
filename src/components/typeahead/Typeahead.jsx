import React, { useEffect } from 'react';
import Select from './Select';
import Results from './Results';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchSearchResults } from '../../actions/search';
import {
  setTypeaheadQuery,
  setTypeaheadIndex,
  fetchTypeaheadResults
} from '../../actions/typeahead';

const Typeahead = props => {
  const { field, query, type, fetchTypeaheadResults } = {...props}

  useEffect(() => {
    fetchTypeaheadResults(buildTypeaheadQuery(field, query, type))
  }, [query, field, type, fetchTypeaheadResults])

  const buildTypeaheadQuery = (field, query, type) => {
    // build the url to which the query will be sent
    let url =
      window.location.origin +
      '/api/typeahead' +
      '?field=' +
      field.toLowerCase() +
      '&value=' +
      query;
    if (type)
      url += '&type=' + type + '_' + field.toLowerCase();
    return url;
  };

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
  }

  const handleChange = (e) => {
    if (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 13) return;
    props.setTypeaheadQuery(e.target.value);
    props.setTypeaheadIndex(0);
  }

  const submitSearch = () => {
    // identify the search phrase requested by the user
    const phrase =
      props.index === 0
        ? props.query
        : props.results[props.index - 1];
    props.setTypeaheadQuery(phrase);
    // submit the search and remove focus from the input
    props.fetchSearchResults();
    document.querySelector('.typeahead input').blur();
  }

  return(
    <div className="typeahead">
      <Select />
      <div className="search-button" />
      <input
        value={props.query}
        onKeyUp={handleKeyUp}
        onChange={handleChange}
      />
      <Results submitSearch={submitSearch} />
    </div>
  )
}

Typeahead.propTypes = {
  fetchSearchResults: PropTypes.func.isRequired,
  fetchTypeaheadResults: PropTypes.func.isRequired,
  field: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  query: PropTypes.string.isRequired,
  results: PropTypes.arrayOf(PropTypes.string),
  setTypeaheadIndex: PropTypes.func.isRequired,
  setTypeaheadQuery: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  query: state.typeahead.query,
  field: state.typeahead.field,
  index: state.typeahead.index,
  results: state.typeahead.results,
  type: state.search.type
});

const mapDispatchToProps = (dispatch) => ({
  setTypeaheadQuery: (val) => dispatch(setTypeaheadQuery(val)),
  setTypeaheadIndex: (val) => dispatch(setTypeaheadIndex(val)),
  fetchTypeaheadResults: (query) => dispatch(fetchTypeaheadResults(query)),
  fetchSearchResults: () => dispatch(fetchSearchResults())
});

export default connect(mapStateToProps, mapDispatchToProps)(Typeahead);
