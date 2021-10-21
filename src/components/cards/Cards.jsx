import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Filters from '../filters/Filters';
import Card, { CardProps } from './Card';
import Loader from '../partials/Loader';
import { displayMoreResults } from '../../actions/search';
import { throttle } from 'lodash';

const Cards = props => {
  const { results, loading, displayMoreResults } = {
    ...props,
  };

  const ref = useRef();

  useEffect(() => {
    const elem = ref.current;
    if (!elem) return;
    const onScroll = throttle(() => {
      if (elem.scrollTop / elem.clientHeight > 0.75) displayMoreResults();
    }, 500);
    ref.current.addEventListener('scroll', onScroll);
    return () => {
      if (elem) elem.removeEventListener('scroll', onScroll);
    };
  }, [displayMoreResults]);

  return (
    <div id='results-container' className='col align-center'>
      <Filters />
      <div
        id='result-pairs-container'
        ref={ref}
        className={loading ? 'flex-1 col justify-center' : 'flex-1 col'}
      >
        {loading ? (
          <Loader />
        ) : results && results.length ? (
          <CardPairs results={results} />
        ) : (
          <span className='no-results'>Sorry, no results could be found</span>
        )}
      </div>
    </div>
  );
};

const CardPairs = props => {
  return (
    <div>
      {props.results.map((result, idx) => (
        <div className='result-pair row' key={idx}>
          <Card result={result} type='source' />
          <div className='similarity-circle row justify-center align-center'>
            <div className='similarity row justify-center align-center'>
              <span>{Math.round(result.similarity) + '%'}</span>
            </div>
          </div>
          <Card result={result} type='target' />
        </div>
      ))}
    </div>
  );
};

Cards.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
  location: PropTypes.object,
  match: PropTypes.object,
  results: PropTypes.arrayOf(CardProps),
};

const mapStateToProps = state => ({
  results: state.search.results,
  loading: state.search.resultsMeta.loading,
});

const mapDispatchToProps = dispatch => ({
  displayMoreResults: () => dispatch(displayMoreResults()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Cards);
