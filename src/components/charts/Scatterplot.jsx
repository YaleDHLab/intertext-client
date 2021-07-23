import React from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { colors } from './lib/color-lib';
import Chart from './Chart';
import Legend from './Legend';
import Loader from '../partials/Loader';
import {
  setY,
  setUse,
  setUnit,
  resetZoom,
  setTooltip,
  setStatistic,
  toggleJitter,
  setDomains,
} from '../../actions/scatterplot';

const Scatterplot = (props) => {
  return (
    <div className="scatterplot-container flex-1">
      <div className="scatterplot hide-x-grid flex-1">
        <IntroText {...props} />
        <Controls {...props} />
        <div className="row align-start justify-center">
          <Left {...props} />
          <Right {...props} />
        </div>
      </div>
    </div>
  );
};

const IntroText = (props) => {
  return (
    <>
      <h1>Popular {props.unit}s</h1>
      <div>
        <span>The chart below displays the most popular </span>
        <span>{props.unit}s </span>
        <span>
          within your corpus. Hover over individual points for more information.
        </span>
      </div>
    </>
  );
};

const Controls = (props) => {
  return (
    <div className="controls">
      <span>{'Show ' + props.unit + 's most similar to'}</span>
      <select onChange={props.setUse} value={props.use}>
        <option value={'earlier'}>Earlier</option>
        <option value={'later'}>Later</option>
      </select>
      <span>{props.unit + 's based on'}</span>
      <select onChange={props.setStatistic} value={props.statistic}>
        <option value="sum">Sum</option>
        <option value="mean">Mean</option>
      </select>
      <span>of passage similarity</span>
    </div>
  );
};

const Left = (props) => {
  return (
    <div className="left">
      <LeftControls {...props} />
      <LeftChart {...props} />
    </div>
  );
};

const Right = (props) => {
  return (
    <div className="col">
      {props.tooltip.title ? <Tooltip {...props} /> : null}
      <Table {...props} />
      <div className="controls-lower">
        <div
          className={props.zoomed ? 'reset-button visible' : 'reset-button'}
          onClick={props.resetZoom}
        >
          Reset zoom
        </div>
      </div>
    </div>
  );
};

const LeftControls = (props) => {
  return (
    <div className="row align-center">
      <span className="swatch-label">Similarity</span>
      <Legend domain={props.xDomain} percents={props.statistic === 'mean'} />
      <div className="jitter row align-center">
        <span>Jitter</span>
        <input
          type="checkbox"
          onChange={props.toggleJitter}
          value={props.jitter}
        />
      </div>
    </div>
  );
};

const LeftChart = (props) => {
  const handleMouseover = (d) => {
    const container = d3.select('.scatterplot-container').node();
    const mouseLocation = d3.mouse(container);
    props.setTooltip({
      x: mouseLocation[0],
      y: mouseLocation[1],
      title: d.title,
      author: d.author,
      year: d[props.y],
    });
  };

  const handleMouseout = (d) => {
    props.setTooltip({
      x: null,
      y: null,
      title: '',
      author: '',
      year: null,
    });
  };

  const setBrush = (brushElem, scales) => {
    const brush = d3.brush();
    return brush.on('end', () => {
      handleBrush(scales, brush, brushElem);
    });
  };

  const handleBrush = (scales, brush, brushElem) => {
    if (!d3.event.sourceEvent || !d3.event.selection) return;
    // find min, max of each axis in axis units (not pixels)
    const x = [
      scales.x.invert(d3.event.selection[0][0]),
      scales.x.invert(d3.event.selection[1][0]),
    ];
    const y = [
      scales.y.invert(d3.event.selection[0][1]),
      scales.y.invert(d3.event.selection[1][1]),
    ];
    // only brush if there are observations in brushed area
    const selected = props.data.filter((d) => {
      return (
        d.similarity >= x[0] &&
        d.similarity <= x[1] &&
        d[props.y] >= y[0] &&
        d[props.y] <= y[1]
      );
    });
    if (selected.length) props.setDomains({ x: x, y: y });
    else props.resetZoom();
    // clear the brush
    brushElem.call(brush.move, null);
  };

  const colorScale = d3.scaleQuantize().domain(props.xDomain).range(colors);

  return props.data.length === 0 ? (
    <div className="col flex-1 justify-center align-center">
      <Loader />
    </div>
  ) : (
    <Chart
      width={480}
      height={600}
      margin={{ top: 15, right: 20, bottom: 20, left: 40 }}
      pointData={props.data}
      pointStroke={(d) => '#fff'}
      pointFill={(d) => colorScale(d.similarity)}
      pointLabels={true}
      pointKey={(d) => d.key}
      jitter={props.jitter}
      r={8}
      x={'similarity'}
      xTicks={7}
      xDomain={props.xDomain}
      xTickFormat={(d) => Math.round(d) / 100}
      y={props.y}
      yTicks={5}
      yScale={'inverse'}
      yDomain={props.yDomain}
      yTickFormat={(d) => parseInt(d)}
      drawGrid={true}
      setBrush={setBrush}
      onBrush={handleBrush}
      resize={false}
      onMouseover={handleMouseover}
      onMouseout={handleMouseout}
    />
  );
};

const Tooltip = (props) => {
  return (
    <div
      className="tooltip"
      style={{
        left: props.tooltip.x + 5,
        top: props.tooltip.y + 30,
      }}
    >
      <div className="title">{props.tooltip.title}</div>
      <div className="author">
        {props.tooltip.author + ', ' + props.tooltip.year}
      </div>
    </div>
  );
};

const Table = (props) => {
  return (
    <div className="right">
      <div className="scatterplot-label">
        <span>Top {Math.min(20, props.data.length)} most popular </span>
        <span>{props.unit}s </span>
        <span>in current view</span>
      </div>
      <div className="clear-both" />
      <hr />
      <table>
        <tbody>
          {props.data.slice(0, 20).map((r, i) => (
            <Row key={i} unit={props.unit} row={r} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Row = (props) => {
  return (
    <tr className="book">
      <td className="book-number">{props.row.label}.</td>
      <td dangerouslySetInnerHTML={getRowText(props)} />
    </tr>
  );
};

const getRowText = (props) => {
  switch (props.unit) {
    case 'passage':
      const words = props.row.match.split(' ');
      return { __html: '...' + words.slice(0, 20).join(' ') + '...' };
    case 'author':
      return { __html: props.row.author };
    case 'book':
      return { __html: props.row.title };
    default:
      return '';
  }
};

Scatterplot.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      author: PropTypes.string.isRequired,
      key: PropTypes.isRequired,
      label: PropTypes.number,
      match: PropTypes.string.isRequired,
      similarity: PropTypes.number.isRequired,
      source_year: PropTypes.number.isRequired,
      target_year: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    })
  ),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
  jitter: PropTypes.bool.isRequired,
  location: PropTypes.object,
  match: PropTypes.object,
  resetZoom: PropTypes.func.isRequired,
  setStatistic: PropTypes.func.isRequired,
  setTooltip: PropTypes.func.isRequired,
  setUnit: PropTypes.func.isRequired,
  setY: PropTypes.func.isRequired,
  statistic: PropTypes.string.isRequired,
  toggleJitter: PropTypes.func.isRequired,
  tooltip: PropTypes.shape({
    author: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    x: PropTypes.isRequired,
    y: PropTypes.isRequired,
  }),
  unit: PropTypes.string.isRequired,
  use: PropTypes.string.isRequired,
  xDomain: PropTypes.arrayOf(PropTypes.number).isRequired,
  y: PropTypes.string.isRequired,
  yDomain: PropTypes.arrayOf(PropTypes.number).isRequired,
};

const mapStateToProps = (state) => ({
  unit: state.scatterplot.unit,
  statistic: state.scatterplot.statistic,
  use: state.scatterplot.use,
  jitter: state.scatterplot.jitter,
  y: state.scatterplot.y,
  data: state.scatterplot.data,
  tooltip: state.scatterplot.tooltip,
  xDomain: state.scatterplot.xDomain,
  yDomain: state.scatterplot.yDomain,
  zoomed: state.scatterplot.zoomed,
});

const mapDispatchToProps = (dispatch) => ({
  setY: (y) => dispatch(setY(y)),
  setUse: (e) => dispatch(setUse(e.target.value)),
  setUnit: (unit) => dispatch(setUnit(unit)),
  setStatistic: (e) => dispatch(setStatistic(e.target.value)),
  setTooltip: (obj) => dispatch(setTooltip(obj)),
  resetZoom: () => dispatch(resetZoom()),
  toggleJitter: () => dispatch(toggleJitter()),
  setDomains: (obj) => dispatch(setDomains(obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Scatterplot);
