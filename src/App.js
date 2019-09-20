/**
 * @author Fine
 * @description Topographic Map
 */
import React from 'react';
import TreeMap from './components/TreeMap';
import data from './assets/data';
import './App.css';

class App extends React.Component {
  
  info = {
    data: data,
    width: 1000,
    height: 800,
  }

  render() {
    return (
      <TreeMap {...this.info} />
    );
  }
}

export default App;
