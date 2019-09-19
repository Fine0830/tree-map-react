/**
 * @author Fine
 * @description Topographic Map
 */
import React from 'react';
import TopographicMap from './components/TopographicMap';
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
      <TopographicMap {...this.info} />
    );
  }
}

export default App;
