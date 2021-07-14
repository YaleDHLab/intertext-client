import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Filters from '../filters/Filters';
import Result, { ResultProps } from './Result';
import Loader from '../partials/Loader';
import {
  loadSearchFromUrl,
  runInitialSearch,
  displayMoreResults
} from '../../actions/search';
import { throttle } from 'lodash';

const Results = (props) => {
  const {
    results,
    loading,
    loadSearchFromUrl,
    runInitialSearch,
    displayMoreResults
  } = {
    ...props
  };

  const ref = useRef();

  useEffect(() => {
    const onScroll = throttle(() => {
      const elem = ref.current;
      if (elem.scrollTop / elem.clientHeight > 0.75) displayMoreResults();
    }, 500);
    ref.current.addEventListener('scroll', onScroll);
    return () => {
      if (ref && ref.current) ref.current.removeEventListener('scroll', onScroll);
    };
  }, [displayMoreResults]);

  useEffect(() => {
    loadSearchFromUrl();
    runInitialSearch();
  }, [loadSearchFromUrl, runInitialSearch]);

  return (
    <div className="results-container col align-center">
      <Filters />
      <div className="result-pair-container flex-1" ref={ref}>
        {results && results.length ? (
          <ResultPairs results={results} />
        ) : loading ? (
          <Loader />
        ) : (
          <span>Sorry, no results could be found</span>
        )}
      </div>
    </div>
  );
};

const ResultPairs = (props) => {
  return (
    <div id="results-container">
      {props.results.map((result, idx) => (
        <div
          className={`result-pair row justify-center align-center
            ${
              result.source_author === 'Unknown' &&
              result.target_author === 'Unknown'
                ? 'hide-authors'
                : ''
            }`}
          key={idx}
        >
          <Result result={result} type="source" />
          <div className="similarity-circle row justify-center align-center">
            <div className="similarity row justify-center align-center">
              <span>{Math.round(result.similarity) + '%'}</span>
            </div>
          </div>
          <Result result={result} type="target" />
        </div>
      ))}
    </div>
  );
};

Results.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }),
  loadSearchFromUrl: PropTypes.func.isRequired,
  location: PropTypes.object,
  match: PropTypes.object,
  results: PropTypes.arrayOf(ResultProps)
};

const mapStateToProps = (state) => ({
  results: state.search.results,
  loading: state.search.loading
});

const mapDispatchToProps = (dispatch) => ({
  loadSearchFromUrl: (obj) => dispatch(loadSearchFromUrl(obj)),
  displayMoreResults: () => dispatch(displayMoreResults()),
  runInitialSearch: () => dispatch(runInitialSearch())
});

export default connect(mapStateToProps, mapDispatchToProps)(Results);
