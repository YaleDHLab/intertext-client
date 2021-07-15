import * as d3 from 'd3';
import {
  sankey as d3sankey,
  sankeyLinkHorizontal as d3sankeyLinkHorizontal,
  sankeyCenter as d3sankeyCenter
} from 'd3-sankey';
import { history } from '../../../store'

export const plot = (svg, data) => {

  // sort the nodes by how many edges they have
  let counts = {};
  data.links.map(e => counts[e.source] = counts[e.source] ? counts[e.source] + 1 : 1)
  data.nodes.sort((a, b) => {
    const ca = counts[a.sankeyId] || 0;
    const cb = counts[b.sankeyId] || 0;
    return cb - ca;
  })

  const margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  const linkColor = d3
    .scaleThreshold()
    .domain([0, 50, 60, 70, 80])
    .range(['#EFECEC', '#F0E442', '#E69F00', '#D55E00']);

  svg = d3
    .select(svg)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  const sankey = d3sankey()
    .nodeId((d) => d.sankeyId)
    .nodeAlign(d3sankeyCenter)
    .nodeSort(null)
    .nodeWidth(15)
    .nodePadding(10)
    .extent([
      [0, 5],
      [width, height - 5]
    ]);

  const { nodes, links } = sankey({
    nodes: data.nodes.map((d) => Object.assign({}, d)),
    links: data.links.map((d) => Object.assign({}, d))
  });

  const handleLinkClick = d => {
    history.push(`/?earlier=${d.source.id}&later=${d.target.id}`)
  }

  const link = svg
    .append('g')
    .attr('class', 'links')
    .selectAll('.link')
    .data(links.sort((b, a) => b.width - a.width))
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('fill', 'none')
    .attr('d', d3sankeyLinkHorizontal())
    .style('stroke-width', (d) => Math.max(1, d.width))
    .attr('stroke', (d) => linkColor(d.similarity))
    .on('click', d => handleLinkClick(d));

  link.append('title').text((d) => d.source.label + ' →\n' + d.target.label);

  const node = svg
    .append('g')
    .attr('class', 'nodes')
    .selectAll('.node')
    .data(nodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', (d) => 'translate(' + d.x0 + ',' + d.y0 + ')');

  node
    .append('rect')
    .attr('height', (d) => d.y1 - d.y0)
    .attr('width', sankey.nodeWidth())
    .style('fill', (d) => '#f3f3f3')
    .style('stroke', (d) => '#999999')
    .append('title')
    .text((d) => d.label);

  node
    .append('text')
    .attr('x', (d) => d.sankeyId.includes('earlier') ? 20 : -5)
    .attr('y', (d) => (d.y1-d.y0 + 8)/2)
    .text((d) => d.label)
    .attr('text-anchor', d => d.sankeyId.includes('earlier') ? 'start' : 'end')
};
