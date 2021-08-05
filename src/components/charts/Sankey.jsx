import React, { useRef, useEffect, useState } from 'react';
import { plot } from './lib/sankey-lib';
import { connect } from 'react-redux';
import * as searchActions from '../../actions/search';
import * as typeaheadActions from '../../actions/typeahead';
import * as _ from 'lodash';

const Sankey = props => {
  const ref = useRef();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const getData = (sortIndex, labelToFileIds) => {
      // wait for the match index to load before showing plot
      if (!sortIndex || Object.values(sortIndex).length === 0) return;
      if (!labelToFileIds || Object.values(labelToFileIds).length === 0) return;
      // obtain a mapping from file id to label
      let fileIdToLabel = {};
      for (const [label, fileIds] of Object.entries(labelToFileIds)) {
        fileIds.forEach(fileId => {
          fileIdToLabel[fileId] = label;
        });
      }
      // obtain a mapping from match id to match objects
      let matchIdMap = {};
      sortIndex.forEach(i => {
        const [fileIdA, matchId, , ,] = i;
        matchIdMap[matchId] = matchIdMap[matchId] || [];
        matchIdMap[matchId].push(fileIdA);
      });
      // parse the data to be represented
      const nodes = {};
      const links = {};
      sortIndex.forEach(i => {
        const [, matchEarlierFileId, matchLaterFileId, similarity] = i;
        const a = matchEarlierFileId;
        const b = matchLaterFileId;
        // create node labels
        const aLabel = fileIdToLabel[a];
        const bLabel = fileIdToLabel[b];
        // add earlier/later prefixes so nodes are stacked in two columns
        const sankeyIdA = 'earlier-' + a.toString();
        const sankeyIdB = 'later-' + b.toString();
        // create the nodes
        const aNode = { id: a, label: aLabel, sankeyId: sankeyIdA };
        const bNode = { id: b, label: bLabel, sankeyId: sankeyIdB };
        // add the nodes
        nodes[sankeyIdA] = aNode;
        nodes[sankeyIdB] = bNode;
        // update the edges
        links[sankeyIdA] = links[sankeyIdA] || {};
        links[sankeyIdA][sankeyIdB] = links[sankeyIdA][sankeyIdB] || {
          count: 0,
          similarity: [],
        };
        links[sankeyIdA][sankeyIdB]['count'] += 1;
        links[sankeyIdA][sankeyIdB]['similarity'].push(similarity);
      });

      const l = [];
      Object.keys(links).forEach(a => {
        Object.keys(links[a]).forEach(b => {
          l.push({
            source: a,
            target: b,
            similarity: _.mean(links[a][b]['similarity']),
            count: links[a][b]['count'],
            value: links[a][b]['count'],
          });
        });
      });

      return {
        nodes: Object.values(nodes),
        links: l,
      };
    };

    if (initialized || !props.sortIndex || !props.labelToFileIds) return;
    setInitialized(true);
    const data = getData(props.sortIndex, props.labelToFileIds);
    plot({
      svg: ref.current,
      data: data,
      setField: props.setField,
      setTypeaheadQuery: props.setTypeaheadQuery,
    });
  }, [initialized, props.sortIndex, props.labelToFileIds, props.setField, props.setTypeaheadQuery]);

  return (
    <div className='sankey-wrap'>
      <svg ref={ref} id='sankey-plot' />
    </div>
  );
};

const mapStateToProps = state => ({
  typeaheadField: state.typeahead.field,
  labelToFileIds: state.typeahead.fileIds ? state.typeahead.fileIds[state.typeahead.field] : null,
  sortIndex: state.search.sortIndex,
});

const mapDispatchToProps = dispatch => ({
  setTypeaheadQuery: s => dispatch(typeaheadActions.setTypeaheadQuery(s)),
  setField: obj => dispatch(searchActions.setAdvancedFilterField(obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Sankey);
