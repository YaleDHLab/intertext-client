import { useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as viewerActions from '../../actions/viewer';
import Card from '../cards/Card';
import Loader from '../partials/Loader';
import * as d3 from 'd3';

const Viewer = props => {

  const offscreenRef = useRef();
  const [rows, setRows] = useState([]);
  const [matchMap, setMatchMap] = useState({});
  const [selectedRow, setSelectedRow] = useState({idx: null, matches: []});

  const loaded = props.match.params.id.toString() === props.fileId.toString() && rows.length;

  useEffect(() => {
    // load the data for the requested file
    props.getViewerData(props.match.params.id);
    // create a map from fileId window to [matches]
    setRows(getRows(offscreenRef, props));
    setMatchMap(getMatchMap(props));
  }, [props, props.match.params.id, props.fileId, props.matches])

  return (
    <div id='page-viewer' className='row justify-center'>
      <div id='offscreen' ref={offscreenRef} />
      {loaded
        ? (
            <div id='viewer-text-columns'>
              <div id='viewer-left' className='viewer-text-column'>
                {rows.map((r, ridx) => (
                  <TextRow
                    key={ridx}
                    r={r}
                    ridx={ridx}
                    selectedRow={selectedRow}
                    matchMap={matchMap}
                    setSelectedRow={setSelectedRow} />
                ))}
              </div>
              <div id='viewer-right' className='viewer-text-column'>
                {selectedRow.matches.length
                  ? selectedRow.matches.map((m, midx) => (
                      <MatchRow key={midx} m={m} otherId={props.fileId.toString()} />
                    ))
                  : null
                }
              </div>
            </div>
          )
        : <div className='col align-center justify-center'>
            <Loader />
          </div>
      }
    </div>
  )
}

const TextRow = props => {

  // get the list of objects for a given row
  const getRowMatches = (row, matchMap) => {
    let ids = new Set();
    let matches = [];
    row.forEach(r => {
      (r.windows || []).forEach(w => {
        // get the matches for this window
        if (matchMap[w]) matchMap[w].forEach(m => {
          if (!ids.has(m._id)) {
            ids.add(m._id);
            matches.push(m);
          }
        })
      })
    });
    return matches;
  }

  // get the innerHTML content for a row of word objects
  const getRowText = (row) => {
    return row.map(w => w.word).join(' ');
  }

  const onClick = (ridx, matches) => {
    props.setSelectedRow({
      idx: ridx,
      matches: matches,
    })
  }

  const getClassName = hasWindows => {
    let s = 'row space-between';
    if (props.selectedRow.idx !== null) {
      if (Math.abs(props.selectedRow.idx - props.ridx) < 5) {
        s += ' selected-context';
      } else {
        s += ' not-selected';
      }
    }
    if (props.selectedRow.idx === props.ridx) s += ' selected';
    if (hasWindows) {
      s += ' selectable';
    } else {
      s += ' not-selectable';
    }
    return s;
  }

  const { r, ridx, matchMap } = {...props}
  const matches = getRowMatches(r, matchMap);
  const hasWindows = r.filter(i => i.windows && i.windows.length).length > 0;

  // get the color for the color block
  var colorScale = d3.scaleLinear().domain([0, 10]).range(['#eee', '#222']);

  return (
    <div className={getClassName(hasWindows)}
        onClick={e => matches.length ? onClick(ridx, matches) : null}>
      <div className='line' dangerouslySetInnerHTML={{__html: getRowText(r)}} />
      <div className='match-count' style={{
        background: hasWindows
          ? colorScale(Math.min(matches.length, 10))
          : colorScale(0)
      }} />
    </div>
  )
}

const getMatchMap = (props) => {
  if (!props.fileId) return;
  let d = {};
  const fileId = parseInt(props.fileId);
  props.matches.forEach(m => {
    const segments = parseInt(m.source_file_id) === fileId
      ? m.source_segment_ids
      : m.target_segment_ids;
    segments.forEach(s => {
      d[s] = d[s] || [];
      d[s].push(m);
    })
  })
  return d;
}

const getRows = (offscreenRef, props) => {
  // transform the word array into a sequence of (word, windowId) tuples
  let words = [];
  var windows = [];
  let windowIndex = -1; // -1 because we increment on the first word
  (props.words || []).forEach((word, wordIndex) => {
    if (wordIndex % props.config.window_slide === 0) windowIndex++;
    // add the current window to the list of windows if needed
    if (!(windows.length) || windows[windows.length-1] !== windowIndex) {
      windows.push(windowIndex);
    }
    // identify first and last word indices in window. Remove first window if needed
    var start = windows[0] * props.config.window_slide;
    var end = start + props.config.window_size;
    if (wordIndex >= end) {
      windows = windows.slice(1);
    }
    // add the word itself
    words.push({
      word: word.replaceAll('<br/>', ''),
      windows: windows.slice(0), // clone the object
    })
    // add any trailing line breaks
    while (word.includes('<br/>')) {
      word = word.replace('<br/>', '');
      words.push({
        word: '<br/>',
        windows: null,
      })
    }
  })
  var rows = [];
  if (offscreenRef && offscreenRef.current) {
    // add the line number to each word in the words list
    var offscreen = offscreenRef.current;
    offscreen.innerHTML = '';
    offscreen.style.position = 'absolute';
    offscreen.style.top = '-1000%';
    offscreen.style.right = '-1000%';
    offscreen.classList.add('viewer-text-column');
    var row = [];
    var height = 0; // store the last seen height of offscreen
    var s = '';
    for (var i=0; i<words.length; i++) {
      s += words[i].word + ' ';
      offscreen.innerHTML = s;
      if (offscreen.clientHeight !== height) {
        height = offscreen.clientHeight;
        rows.push(row);
        row = [];
      }
      row.push(words[i]);
    }
  }
  return rows;
}

/**
 * Match cards
 **/

const MatchRow = props => {

  const isSource = props.otherId === props.m.source_file_id.toString();

  const getRowText = m => {
    return isSource
      ? m.target_prematch + m.target_match + m.target_postmatch
      : m.source_prematch + m.source_match + m.source_postmatch
  }

  return (
    <div className='match-row'>
      <Card result={props.m} type={isSource ? 'source' : 'target'} headerRight={true} />
    </div>
  )
}

const mapStateToProps = state => ({
  words: state.viewer.words,
  matches: state.viewer.matches,
  fileId: state.viewer.fileId || '',
  config: state.search.config,
})

const mapDispatchToProps = dispatch => ({
  getViewerData: fileId => dispatch(viewerActions.getViewerData(fileId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Viewer)