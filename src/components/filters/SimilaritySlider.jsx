import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Slider from 'rc-slider';
import {
  setSimilarityAndSearch,
  setDisplayedSimilarity,
} from '../../actions/filters';

const Range = Slider.createSliderWithTooltip(Slider.Range);

class SimilaritySlider extends React.Component {
  constructor(props) {
    super(props);
    this.setSimilarity = this.setSimilarity.bind(this);
    this.setDisplayedSimilarity = this.setDisplayedSimilarity.bind(this);
  }

  setSimilarity(val) {
    this.props.setSimilarityAndSearch(val);
  }

  setDisplayedSimilarity(val) {
    this.props.setDisplayedSimilarity(val);
  }

  render() {
    return (
      <div className="slider">
        <div className="filter-label">Similarity</div>
        <div className="slider-label">MIN</div>
        <Range
          min={50}
          max={100}
          step={1}
          value={this.props.displayed}
          onChange={this.setDisplayedSimilarity}
          onAfterChange={this.setSimilarity}
        />
        <div className="slider-label">MAX</div>
      </div>
    );
  }
}

SimilaritySlider.propTypes = {
  displayed: PropTypes.arrayOf(PropTypes.number).isRequired,
  setDisplayedSimilarity: PropTypes.func.isRequired,
  setSimilarityAndSearch: PropTypes.func.isRequired,
  similarity: PropTypes.arrayOf(PropTypes.number).isRequired,
};

const mapStateToProps = (state) => ({
  similarity: state.filters.similarity,
  displayed: state.filters.displayed,
});

const mapDispatchToProps = (dispatch) => ({
  setSimilarityAndSearch: (val) => dispatch(setSimilarityAndSearch(val)),
  setDisplayedSimilarity: (val) => dispatch(setDisplayedSimilarity(val)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SimilaritySlider);
