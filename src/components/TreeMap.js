/**
 * @author Fine
 * @description tree map
 */
import React from 'react';
import * as d3 from 'd3';
import { Icon } from 'antd';
import CONSTANT from '../utils/CONSTANT';
import TreeComponent from './TreeComponent';

class TreeMap extends React.Component {
  state = {
    currentNode: {}, // select node
    menuStatus: 'hidden',
    positionY: 0,
    positionX: 0,
    tranInfo: {
      k: 1, // scale param
      x: 60, // translate x
      y: -30, // translate y
    },
    isFullScreen: false,
    dataSource: null,
  }

  componentDidMount() {
    this.watchFullScreen();
    this.setState({dataSource: this.props.data});
  }

  nodeClick(event, currentNode) {
    event.stopPropagation();
    const positionX = event.pageX + CONSTANT.DIFF.X + 'px';
    const positionY = event.pageY + CONSTANT.DIFF.Y  + 'px';

    this.setState({menuStatus: 'visible', currentNode, positionX, positionY});
  }

  addNode = () => {
    const { currentNode } = this.state;
    this.cancleActive();
    if (!currentNode.children) {
      currentNode.children = [];
    }
    CONSTANT.NEWNODE.name = Math.random() * 10;
    currentNode.children.push(CONSTANT.NEWNODE);

    let rootNode = currentNode;
    while (rootNode.parent) {
      rootNode = rootNode.parent;
    }
    delete rootNode.data;
    this.setState({dataSource: rootNode});
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
    this.setState({dataSource: rootNode});
  }

  cancleActive = () => {
    // reset node active
    this.setState({menuStatus: 'hidden', currentNode: {}});
  }

  nodeClick = (event, currentNode) => {
    const positionX = event.pageX + CONSTANT.DIFF.X + 'px';
    const positionY = event.pageY + CONSTANT.DIFF.Y  + 'px';

    event.stopPropagation();
    this.setState({menuStatus: 'visible', currentNode, positionX, positionY});
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

  render() {
    const {
      currentNode, positionX, positionY,
      menuStatus, tranInfo, isFullScreen, dataSource
    } = this.state;

    return (
      <div onClick={this.cancleActive}>
        <TreeComponent {...this.props} tranInfo={tranInfo} nodeClick={this.nodeClick}
          dataSource={dataSource} currentNode={currentNode}/>
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

export default TreeMap;
