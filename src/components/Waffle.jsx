import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Chart, { WaffleDataProps } from './charts/Chart';
import Legend from './charts/Legend';
import Loader from './Loader';
import Result, { ResultProps } from './results/Result';
import headshot from '../assets/images/authors/default-headshot.jpg';
import { Link } from 'react-router-dom';
import { colorScale } from './charts/colors';
import { setWaffleFeature, getWaffleActive } from '../actions/waffle';

class Waffle extends React.Component {
  render() {
    return (
      <div className="waffle-card-wrapper">
        <div className="waffle-card-container">
          <div className="waffle-card-controls">
            <span className="label">Visualize similar passages by:</span>
            {options.map((o, i) => (
              <Button
                key={i}
                active={this.props.feature}
                feature={o.feature}
                label={o.label}
                setFeature={this.props.setFeature}
              />
            ))}
            <Legend />
            <Link to="/" className="close-visualization-wrapper">
              <div className="close-visualization" />
            </Link>
          </div>
          <div className="result waffle-chart-card">
            <div className="result-top">
              <div className="result-title">
                <span>All passages similar to </span>
                <span>
                  <i>{this.props.title}</i>
                </span>
              </div>
            </div>
            <div className="result-body">
              <div className="headshot-container">
                <div
                  className="headshot"
                  style={{
                    backgroundImage: 'url(' + getImage(this.props.image) + ')'
                  }}
                />
                <div className="headshot-label">{this.props.author}</div>
              </div>
              <WafflePlot />
            </div>
          </div>
          {this.props.active ? <WaffleResults {...this.props} /> : <span />}
        </div>
      </div>
    );
  }
}

const Button = (props) => {
  return (
    <div
      className={
        props.feature === props.active
          ? 'waffle-button active'
          : 'waffle-button'
      }
      onClick={props.setFeature.bind(null, props.feature)}
    >
      {props.label}
    </div>
  );
};

const WaffleResults = (props) => {
  return (
    <div className="waffle-card-result-container">
      <div className="waffle-card-results">
        <div className="waffle-results-left">
          <Result key="key-source" type={props.type} result={props.active} />
        </div>
        <div className="waffle-results-right">
          <Result
            key="key-target"
            type={props.type === 'source' ? 'target' : 'source'}
            result={props.active}
          />
        </div>
        <div className="clear-both" />
      </div>
    </div>
  );
};

const getImage = (image) => {
  return image
    ? image.substring(0, 4) === 'src/'
      ? image.substring(3)
      : image
    : headshot;
};

const options = [
  { feature: 'author', label: 'Author' },
  { feature: 'segment_ids', label: 'Segment' },
  { feature: 'year', label: 'Year' }
];

/**
 * Plot
 **/

const StatelessWafflePlot = (props) => {
  return (
    <div className="waffle-chart hide-y-axis">
      {props.data.length > 0 ? (
        <Chart
          height={236}
          margin={{ top: 0, right: 80, bottom: 75, left: 0 }}
          xLabel={''}
          yLabel={''}
          xScale={'ordinal'}
          xTickFormat={(d) => d}
          xLabelRotate={25}
          yDomain={[1, 20]}
          waffleKey={'_id'}
          colorKey={'similarity'}
          color={colorCell}
          waffleData={props.data}
          width={props.width}
          columnCounts={props.columnCounts}
          maxColumn={props.maxColumn}
          x={props.feature}
          xDomain={props.xDomain}
          onClick={props.getActive}
        />
      ) : (
        <Loader />
      )}
    </div>
  );
};

const colorCell = (d) => {
  return colorScale(parseInt(d));
};

let mapStateToProps = (state) => ({
  data: state.waffle.data,
  width: state.waffle.width,
  xDomain: state.waffle.xDomain,
  columnCounts: state.waffle.columnCounts,
  maxColumn: state.waffle.maxColumn
});

let mapDispatchToProps = (dispatch) => ({
  getActive: (d, i) => dispatch(getWaffleActive(d, i))
});

const WafflePlot = connect(
  mapStateToProps,
  mapDispatchToProps
)(StatelessWafflePlot);

/**
 * Plot
 **/

StatelessWafflePlot.propTypes = {
  columnCounts: PropTypes.object.isRequired,
  data: PropTypes.arrayOf(WaffleDataProps).isRequired,
  maxColumn: PropTypes.number,
  width: PropTypes.number.isRequired,
  xDomain: PropTypes.arrayOf(PropTypes.string).isRequired,
  getActive: PropTypes.func.isRequired
};

/**
 * Container
 **/

Waffle.propTypes = {
  active: ResultProps,
  author: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(WaffleDataProps).isRequired,
  feature: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }),
  image: PropTypes.string,
  location: PropTypes.object,
  match: PropTypes.object,
  setFeature: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

mapStateToProps = (state) => ({
  type: state.waffle.type,
  feature: state.waffle.feature,
  author: state.waffle.author,
  title: state.waffle.title,
  image: state.waffle.image,
  data: state.waffle.data,
  active: state.waffle.active
});

mapDispatchToProps = (dispatch) => ({
  setFeature: (feature) => dispatch(setWaffleFeature(feature))
});

export default connect(mapStateToProps, mapDispatchToProps)(Waffle);
