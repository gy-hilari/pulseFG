import React, { Component } from 'react';
import './App.css';
import PulseGraph from './components/pulseGraph/pulseGraph';

class App extends Component {
  render() {
    return (
      <div className="App">
        <PulseGraph/>
      </div>
    );
  };
}

export default App;