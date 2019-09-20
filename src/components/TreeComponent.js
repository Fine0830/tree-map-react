/**
 * @author Fine
 * @description d3 and react tree component
 */
import React from 'react';
import * as d3 from 'd3';

import CONSTANT from '../utils/CONSTANT';
import earth from '../assets/earth.svg';
import user from '../assets/user.svg';
import minusCircle from '../assets/circle.svg';

class TreeComponent extends React.Component {
  state = {
    nodes: [], // tree nodes
    links: [], // tree path
  }
  /**
   * bezier curve generator to path
   */
  bezierCurveGenerator = d3.linkHorizontal()
  .x(d => d.y)
  .y(d => d.x)

  tree = null

  componentDidMount() {
    this.initMapData();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {links, nodes} = this.initTreeNodes(nextProps);
    nextState.nodes = nodes;
    nextState.links = links;

    return true;
  }

  initMapData() {
    const {width, height, data} = this.props;
    // create tree layout
    this.tree = d3.tree()
      .size([width * 0.8, height])
      .separation((a, b) => (a.parent === b.parent ? 5 : 9) / a.depth);
    const {links, nodes} = this.initTreeNodes(data);
    this.setState({links, nodes});
  }

  initTreeNodes(nextProps) {
    const { currentNode, dataSource } = nextProps;
    let nodes = [];
    let links = [];
    if (dataSource) {
      // create data of tree structure
      const hierarchyData = d3.hierarchy(dataSource)
      // hierarchy layout and add node.x,node.y
      const treeNode = this.tree(hierarchyData);
      nodes = treeNode.descendants();
      links = treeNode.links();
      nodes = nodes.map(node => {
        if (node.active) {
          node.active = false;
          if (node.parent) {
            node.parent.active = false;
          }
        }
        if (node.data.name === currentNode.name) {
          node.active = true;
          if (node.parent) {
            node.parent.active = true;
          }
        }
        return node;
      });
    }
    return {nodes, links};
  }

  nodeActive = (event, currentNode) => {
    // let { nodes } = this.state
    this.props.nodeClick(event, currentNode);
  }

  render() {
    const { width, height, tranInfo } = this.props;
    const { links, nodes } = this.state;

    return (
      <svg width={width} height={height}>
        <g
          className="tree_map"
          transform={`translate(${tranInfo.x},${tranInfo.y}),scale(${tranInfo.k})`}>
          <g>
            {
              links.map((link, i) => {
              const start = { x: link.source.x, y: link.source.y + CONSTANT.STARTBUF };
              const end = { x: link.target.x, y: link.target.y + CONSTANT.ENDBUF };
              const pathLink = this.bezierCurveGenerator({ source: start, target: end });

              return <path 
                key={i}
                d={pathLink}
                fill='none'
                stroke={CONSTANT.THEME.LINESTROKE}
                strokeWidth='1'
                strokeDasharray={CONSTANT.THEME.DASHARRAY}
                markerEnd='url(#arrow)'/>
            })}
          </g>
          <g>
            {nodes.map((node, i) => {
              // console.log(nodes);
              node.type = node.data.type;
              node.tmp = node.data.tmp;
              node.error = node.data.error;
              node.avgTime = node.data.avgTime;
              node.name = node.data.name;

              return (<g key={i} transform={`translate(${node.y}, ${node.x - 10})`}>
                <defs>
                  <marker id="arrow"
                    markerUnits="strokeWidth"
                    markerWidth={CONSTANT.MARKER.MARKERWIDTH}
                    markerHeight={CONSTANT.MARKER.MARKERHIEGHT}
                    viewBox={CONSTANT.MARKER.VIEWBOX} 
                    refX={CONSTANT.MARKER.REFX}
                    refY={CONSTANT.MARKER.REFY}
                    orient={CONSTANT.MARKER.ORIENT}>
                    <path d={CONSTANT.MARKER.PATH} fill={CONSTANT.MARKER.FILL} />
                  </marker>
                </defs>
                <circle
                  cx={CONSTANT.CIRCLE.CX}
                  cy={CONSTANT.CIRCLE.CY}
                  r={CONSTANT.CIRCLE.R}
                  fill='#fff'
                  stroke={node.active ? CONSTANT.THEME.ACTIVE : CONSTANT.THEME.NONEACTIVE}
                  strokeWidth={node.active ? 2 : 1}
                  style={{cursor: 'pointer'}}
                  onClick={(event) => this.nodeActive(event, node)} />
                <image
                  href={node.depth === 0 ? user : node.depth === 1 ? earth : minusCircle}
                  style={{cursor: 'pointer'}} 
                  onClick={(event) => this.nodeActive(event, node)}/>
                <rect x='10' y='32' width='40' height='20'
                  fill={node.data.type === CONSTANT.PROD ? CONSTANT.THEME.RECTBLUE : CONSTANT.THEME.RECTRED} />
                <text
                  x='17' y='46'
                  fill={node.data.type === CONSTANT.PROD ? CONSTANT.THEME.TEXTBLACK : CONSTANT.THEME.TEXTWHITE}
                  style={{fontSize: CONSTANT.THEME.FONTSIZE}}>
                  {node.type}
                </text>
                <text x='5' y='47' fill='#000' textAnchor='end' style={{fontSize: CONSTANT.THEME.FONTSIZE}}>
                  {node.name}
                </text>
              </g>)
            })}
          </g>
        </g>
      </svg>
    )
  }
}

export default TreeComponent;
