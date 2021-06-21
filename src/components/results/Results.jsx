import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Filters from '../filters/Filters';
import Result, { ResultProps } from './Result';
import Loader from '../Loader';
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

  const containerRef = useRef();

  useEffect(() => {
    const onScroll = throttle(() => {
      const elem = containerRef.current;
      if (elem && window.scrollY / elem.clientHeight > 0.75) {
        displayMoreResults();
      }
    }, 100);
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [displayMoreResults]);

  useEffect(() => {
    loadSearchFromUrl();
    runInitialSearch();
  }, [loadSearchFromUrl, runInitialSearch]);

  return (
    <div className="results">
      <Filters />
      <div className="result-pair-container" ref={containerRef}>
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
          className={`result-pair
            ${
              result.source_author === 'Unknown' &&
              result.target_author === 'Unknown'
                ? 'hide-authors'
                : ''
            }`}
          key={idx}
        >
          <Result result={result} type="source" />
          <div className="similarity-circle">
            <div className="similarity">
              {Math.round(result.similarity) + '%'}
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
