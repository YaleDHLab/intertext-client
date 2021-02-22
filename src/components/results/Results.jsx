import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Filters from '../filters/Filters';
import Result, { ResultProps } from './Result';
import Loader from '../Loader';
import { loadSearchFromUrl, displayMoreResults } from '../../actions/search';

class Results extends React.Component {
  constructor(props) {
    super(props);
    this.renderContent = this.renderContent.bind(this);
  }

  componentWillMount() {
    window.addEventListener('scroll', () => onScroll(this.props));
  }

  // bootstrap search state in url (if any) when app mounts
  componentDidMount() {
    this.props.loadSearchFromUrl(window.location.search);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', () => onScroll(this.props));
  }

  renderContent() {
    // display returned results
    if (this.props.results && this.props.results.length) {
      const heights = getResultHeights(this.props.results);
      return this.props.results.map((result, idx) => (
        <div className="result-pair" key={idx}>
          <Result result={result} type="source" height={heights[idx]} />
          <div className="similarity-circle">
            <div className="similarity">
              {Math.round(result.similarity * 100) + '%'}
            </div>
          </div>
          <Result result={result} type="target" height={heights[idx]} />
        </div>
      ));
      // no results were found
    } else if (this.props.results) {
      return <span>Sorry, no results could be found</span>;
      // waiting for results
    } else {
      return <Loader />;
    }
  }

  render() {
    return (
      <div className="results">
        <Filters />
        <div className="result-pair-container">{this.renderContent()}</div>
      </div>
    );
  }
}

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

const onScroll = (props) => {
  const elem = document.querySelector('.result-pair-container');
  if (elem && window.scrollY / elem.clientHeight > 0.75) {
    props.displayMoreResults();
  }
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
