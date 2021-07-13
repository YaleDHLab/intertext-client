import * as d3 from 'd3';
import {
  sankey as d3sankey,
  sankeyLinkHorizontal as d3sankeyLinkHorizontal,
  sankeyCenter as d3sankeyCenter
} from 'd3-sankey';

export const plot = (svg, data) => {
  var margin = { top: 10, right: 10, bottom: 10, left: 10 },
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
    .nodeId((d) => d.id)
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
    .attr('stroke', (d) => linkColor(d.similarity));

  link.append('title').text((d) => d.source.label + ' →\n' + d.target.label);

  var node = svg
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
    .attr('x', -6)
    .attr('y', (d) => d.dy)
    .attr('dy', '.35em')
    .attr('text-anchor', 'end')
    .attr('transform', null)
    .text((d) => d.dy)
    .filter((d) => d.x < width / 2)
    .attr('x', 6 + sankey.nodeWidth())
    .attr('text-anchor', 'start');
};
