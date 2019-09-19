/**
 * @author Fine
 * @description topograhic map
 */
import React from 'react';
import * as d3 from 'd3';
import { Icon } from 'antd';
import constant from './CONSTANT.js';
import earth from '../assets/earth.svg';
import user from '../assets/user.svg';
import minusCircle from '../assets/circle.svg';

class TopographicMap extends React.Component {
  state = {
    currentNode: {},
    nodes: [],
    links: [],
    menuStatus: 'hidden',
    positionY: 0,
    positionX: 0,
    tranInfo: {
      k: 1,
      x: 60,
      y: -30,
    },
    isFullScreen: false,
  }

  bezier_curve_generator = d3.linkHorizontal()
  .x(d => d.y)
  .y(d => d.x)

  tree = null

  componentDidMount() {
    this.initMapData();
    this.watchFullScreen();
  }

  initMapData() {
    const {width, height, data} = this.props;
    // create tree layout
    this.tree = d3.tree()
      .size([width * 0.8, height])
      .separation((a, b) => (a.parent === b.parent ? 5 : 9) / a.depth);
    this.initTreeNodes(data);
  }

  initTreeNodes(data) {
    let nodes = [];
    let links = [];
    if (data) {
      // create tree structure
      const hierarchyData = d3.hierarchy(data)
      // hierarchy layout and add node.x,node.y
      const treeNode = this.tree(hierarchyData);
      nodes = treeNode.descendants();
      links = treeNode.links(); 
    }
    this.setState({links, nodes});
  }

  nodeClick(event, currentNode) {
    const positionX = event.pageX + 40 + 'px';
    const positionY = event.pageY - 50  + 'px';

    event.stopPropagation();
    this.cancleActive();
    currentNode.active = true;
    if (currentNode.parent) {
      currentNode.parent.active = true;
    }

    this.setState({menuStatus: 'visible', currentNode, positionX, positionY});
  }

  addNode = () => {
    const { currentNode } = this.state;
    this.cancleActive();
    if (!currentNode.children) {
      currentNode.children = [];
    }
    currentNode.children.push(constant.NEWNODE);
    let rootNode = currentNode;
    while (rootNode.parent) {
      rootNode = rootNode.parent;
    }
    delete rootNode.data;
    this.initTreeNodes(rootNode);
  }

  deleteNode = () => {
    let { currentNode } = this.state;
    this.cancleActive();
    if (currentNode.children) {
      currentNode.children = null;
    }
    const currentNodeName = currentNode.name;
    const currentNodeParent = currentNode.parent;
    if (currentNodeParent) {
      for (let i = 0; i < currentNodeParent.children.length; i++) {
        if (currentNodeParent.children[i].name === currentNodeName) {
          currentNodeParent.children.splice(i,1);
        }
      }
    } else {
      currentNode = null;
    }
    let rootNode = currentNode;
    if (rootNode) {
      while (rootNode.parent) {
        rootNode = rootNode.parent;
      }
    }
    this.initTreeNodes(rootNode);
  }

  zoomIn = () => {
    const g = d3.select('.tree_map');
    d3.zoom().scaleBy(g, 0.9);
    const tranInfo = d3.zoomTransform(g.node());
    this.setState({tranInfo});
  }

  zoomOut = () => {
    const g = d3.select('.tree_map');
    d3.zoom().scaleBy(g, 1.1);
    const tranInfo = d3.zoomTransform(g.node());
    this.setState({tranInfo});
  }

  viewFullPage = () => {
    if (this.state.isFullScreen) {
      this.exitFullscreen();
    } else {
      this.requestFullScreen();
    }
  }

  requestFullScreen() {
    const de = document.documentElement;
    if (de.requestFullscreen) {
      de.requestFullscreen();
    } else if (de.mozRequestFullScreen) {
      de.mozRequestFullScreen();
    } else if (de.webkitRequestFullScreen) {
      de.webkitRequestFullScreen();
    }
  }

  // exit full screen
  exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }

  watchFullScreen() {
    document.addEventListener(
      "fullscreenchange",
      () => {
        this.setState({
          isFullScreen: document.fullscreen
        });
      },
      false
    );
    document.addEventListener(
      "mozfullscreenchange",
      () => {
        this.setState({
          isFullScreen: document.mozFullScreen
        });
      },
      false
    );
    document.addEventListener(
      "webkitfullscreenchange",
      () => {
        this.setState({
          isFullScreen: document.webkitIsFullScreen
        });
      },
      false
    );
  }

  cancleActive = () => {
    // reset node active
    const { currentNode } = this.state;
    currentNode.active = false;
    if (currentNode.parent) {
      currentNode.parent.active = false;
    }
    this.setState({menuStatus: 'hidden', currentNode});
  }

  render() {
    const { width, height } = this.props;
    const {
      currentNode, links, nodes, positionX, positionY,
      menuStatus, tranInfo, isFullScreen
    } = this.state;

    return (
      <div onClick={this.cancleActive}>
        <svg width={width} height={height}>
          <g
            className="tree_map"
            transform={tranInfo ? `translate(${tranInfo.x},${tranInfo.y}),scale(${tranInfo.k})` : null}>
            <g>
              {
                links.map((link, i) => {
                const start = { x: link.source.x, y: link.source.y + 35 };
                const end = { x: link.target.x, y: link.target.y - 25 };
                const pathLink = this.bezier_curve_generator({ source: start, target: end });

                return <path 
                  key={i}
                  d={pathLink}
                  fill='none'
                  stroke='#444'
                  strokeWidth='1'
                  strokeDasharray='5,5'
                  markerEnd='url(#arrow)'/>
              })}
            </g>
            <g>
              {nodes.map((node, i) => {
                node.type = node.data.type;
                node.tmp = node.data.tmp;
                node.error = node.data.error;
                node.avgTime = node.data.avgTime;
                node.name = node.data.name;

                return (<g key={i} transform={`translate(${node.y}, ${node.x - 10})`}>
                  <defs>
                    <marker id="arrow" markerUnits="strokeWidth"
                      markerWidth='20' markerHeight='20' viewBox='0 0 12 12' 
                      refX='5' refY='6' orient='auto'>
                      <path d='M2,2 L10,6 L2,10 L6,6 L2,2' fill='#999' />
                    </marker>
                  </defs>
                  <circle
                    cx='8'
                    cy='8'
                    r={16}
                    fill='#fff'
                    stroke={node.active ? '#1890ff' : '#333'}
                    strokeWidth={node.active ? 2 : 1}
                    onClick={(event) => this.nodeClick(event, node)} />
                  <image
                    href={node.depth === 0 ? user : node.depth === 1 ? earth : minusCircle} 
                    onClick={(event) => this.nodeClick(event, node)}/>
                  <rect x='10' y='32' width='40' height='20' fill={node.data.type === 'prod' ? '#1890ff' : '#c7254e'} />
                  <text x='17' y='46' fill={node.data.type === 'prod' ? '#000' : '#fff'} style={{fontSize: '12px'}}>
                    {node.type}
                  </text>
                  <text x='5' y='47' fill='#000' textAnchor='end' style={{fontSize: '12px'}}>{node.name}</text>
                </g>)
              })}
            </g>
          </g>
        </svg>
        <div className="menu" style={{visibility: menuStatus, left: positionX, top: positionY}}>
          <div className="info-menu">
            <span>Avg.response time<i>{currentNode.avgTime}</i></span>
            <span>TMP<i style={{width: '135px'}}>{currentNode.tmp}</i></span>
            <span>Error/min.<i style={{width: '105px'}}>{currentNode.error}</i></span>
          </div>
          <div className="add-menu">
            <ul>
              <li onClick={this.addNode}><Icon type="database" />&nbsp;&nbsp;Create Map</li>
              <li onClick={this.deleteNode}><Icon type="delete" />&nbsp;&nbsp;Delete Map</li>
              <li><Icon type="align-center" />&nbsp;&nbsp;View traces</li>
              <li><Icon type="warning" />&nbsp;&nbsp;View error</li>
            </ul>
          </div>
        </div>
        <div className="operate-list">
          <span title="add node" onClick={this.zoomOut}><Icon type="plus-circle" /></span>
          <span title="delete node" onClick={this.zoomIn}><Icon type="minus-circle" /></span>
          <span onClick={this.viewFullPage}>
            {isFullScreen ?<Icon type="fullscreen" /> : <Icon type="fullscreen-exit" />}
          </span>
        </div>
      </div>
    )
  }
}

export default TopographicMap;
