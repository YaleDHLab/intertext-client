import React, { useRef, useEffect, useState } from 'react';
import { plot } from './lib/sankey-lib';
import { connect } from 'react-redux';
import { runInitialSearch } from '../../actions/search';
import * as _ from 'lodash';

const Sankey = (props) => {
  const ref = useRef();
  const [initialized, setInitialized] = useState(false);

  const {runInitialSearch} = {...props}

  const getData = (orderIndex, labelToFileIds) => {
    // wait for the match index to load before showing plot
    if (!orderIndex || Object.values(orderIndex).length === 0) return;
    if (!labelToFileIds || Object.values(labelToFileIds).length === 0) return;
    // obtain a mapping from file id to label
    let fileIdToLabel = {};
    for (const [label, fileIds] of Object.entries(labelToFileIds)) {
      fileIds.forEach((fileId) => {
        fileIdToLabel[fileId] = label;
      });
    }
    // obtain a mapping from match id to match objects
    let matchIdMap = {};
    orderIndex.forEach((i) => {
      const [fileIdA, matchId, , ,] = i;
      matchIdMap[matchId] = matchIdMap[matchId] || [];
      matchIdMap[matchId].push(fileIdA);
    });
    // parse the data to be represented
    const nodes = {};
    const links = {};
    const seenMatchids = new Set();
    orderIndex.forEach((i) => {
      const [fileId, matchId, , aIsEarlier, similarity] = i;
      // process each matchid once
      if (!(matchId in seenMatchids)) {
        seenMatchids.add(matchId);
        // determine which of _a or _b fileId is
        const [_a, _b] = matchIdMap[matchId];
        const fileIdA = _a === fileId ? _a : _b;
        const fileIdB = _a === fileId ? _b : _a;
        // set file ids based on which is earlier
        const a = aIsEarlier ? fileIdA : fileIdB;
        const b = aIsEarlier ? fileIdB : fileIdA;
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
        links[sankeyIdA][sankeyIdB] = links[sankeyIdA][sankeyIdB] || { count: 0, similarity: [] };
        links[sankeyIdA][sankeyIdB]['count'] += 1;
        links[sankeyIdA][sankeyIdB]['similarity'].push(similarity);
      }
    });

    const l = [];
    Object.keys(links).forEach((a) => {
      Object.keys(links[a]).forEach((b) => {
        l.push({
          source: a,
          target: b,
          similarity: _.mean(links[a][b]['similarity']),
          count: links[a][b]['count'],
          value: links[a][b]['count']
        });
      });
    });

    return {
      nodes: Object.values(nodes),
      links: l
    };
  };

  useEffect(() => {
    runInitialSearch();
  }, [runInitialSearch]);

  useEffect(() => {
    if (initialized || !props.orderIndex || !props.labelToFileIds) return;
    setInitialized(true);
    const data = getData(props.orderIndex, props.labelToFileIds);
    plot(ref.current, data);
  }, [initialized, getData, props.orderIndex, props.labelToFileIds]);

  return (
    <div className="sankey-wrap">
      <svg ref={ref} id="sankey-plot" />
    </div>
  );
};

const mapStateToProps = (state) => ({
  typeaheadField: state.typeahead.field,
  labelToFileIds: state.typeahead.fieldFiles[state.typeahead.field],
  orderIndex: state.search.sortByIndex
});

const mapDispatchToProps = (dispatch) => ({
  runInitialSearch: () => dispatch(runInitialSearch())
});

export default connect(mapStateToProps, mapDispatchToProps)(Sankey);
