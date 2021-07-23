import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const ResultCount = (props) => (
  <div className="results-count">
    {props.loading ? null : (
      <>
        <span>
          <b>{props.totalResults || 0}</b>
        </span>
        <span>matches</span>
      </>
    )}
  </div>
);

ResultCount.propTypes = {
  totalResults: PropTypes.number,
};

const mapStateToProps = (state) => ({
  loading: state.search.loading,
  totalResults: state.search.resultsMeta.totalResults,
});

export default connect(mapStateToProps)(ResultCount);
