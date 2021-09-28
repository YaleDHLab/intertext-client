import { useRef } from 'react';
import { connect } from 'react-redux';
import * as viewerActions from '../../actions/viewer';

const Viewer = props => {

  const offscreenRef = useRef();

  // load the data for the requested file
  const fileId = props.match.params.id;
  props.getViewerData(fileId);

  // create a map from fileId window to [matches]
  const matchMap = getMatchMap(props);

  // get the innerHTML content for a row of word objects
  const getRowText = row => {
    return row.map(w => w.word).join(' ');
  }

  // get the list of objects for a given row
  const getRowMatches = row => {

  }

  console.log(matchMap)

  return (
    <div id='page-viewer'>
      <div id='offscreen' ref={offscreenRef} />
      <div id='page-viewer-left'>
        {
          fileId.toString() === props.fileId.toString()
            ? <div className='viewer-text-column'>
                {getRows(offscreenRef, props).map((r, ridx) => (
                  <div key={ridx}
                    className='line'
                    dangerouslySetInnerHTML={{__html: getRowText(r)}} />
                ))}
              </div>
            : <div>LOADING</div>
        }
      </div>
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
  let windowIndex = 0;
  (props.words || []).forEach((word, wordIndex) => {
    if (wordIndex % props.config.window_slide === 0) windowIndex++;
    // add the word itself
    words.push({
      word: word.replaceAll('<br/>', ''),
      window: windowIndex,
    })
    // add any trailing line breaks
    while (word.includes('<br/>')) {
      word = word.replace('<br/>', '');
      words.push({
        word: '<br/>',
        window: null,
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