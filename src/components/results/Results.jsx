import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Filters from '../filters/Filters';
import Result, { ResultProps } from './Result';
import Loader from '../Loader';
import { loadSearchFromUrl, displayMoreResults } from '../../actions/search';

const Results = (props) => {
  const { results, loadSearchFromUrl, displayMoreResults } = { ...props };

  useEffect(() => {
    const onScroll = () => {
      const elem = document.querySelector('.result-pair-container');
      if (elem && window.scrollY / elem.clientHeight > 0.75) {
        displayMoreResults();
      }
    };

    window.addEventListener('scroll', onScroll);
    loadSearchFromUrl();
    return () => {
      window.addEventListener('scroll', onScroll);
    };
  }, [loadSearchFromUrl, displayMoreResults]);

  return (
    <div className="results">
      <Filters />
      <div className="result-pair-container">
        {results && results.length ? (
          <ResultPairs results={results} />
        ) : results ? (
          <span>Sorry, no results could be found</span>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

const ResultPairs = (props) => {
  const results = props.results;
  const heights = getResultHeights(results);
  return (
    <React.Fragment>
      {results.map((result, idx) => (
        <div className="result-pair" key={idx}>
          <Result result={result} type="source" height={heights[idx]} />
          <div className="similarity-circle">
            <div className="similarity">
              {Math.round(result.similarity * 100) + '%'}
            </div>
          </div>
          <Result result={result} type="target" height={heights[idx]} />
        </div>
      ))}
    </React.Fragment>
  );
};

// compute the heights of each result pair
export const getResultHeights = (results) => {
  if (!results) return [];
  const heights = results.reduce((arr, result) => {
    const maxLen = Math.max(
      result.source_segment_ids.length,
      result.target_segment_ids.length
    );
    arr.push(240 + maxLen * 10);
    return arr;
  }, []);
  return heights;
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
  results: state.search.results
});

const mapDispatchToProps = (dispatch) => ({
  loadSearchFromUrl: (obj) => dispatch(loadSearchFromUrl(obj)),
  displayMoreResults: () => dispatch(displayMoreResults())
});

export default connect(mapStateToProps, mapDispatchToProps)(Results);
