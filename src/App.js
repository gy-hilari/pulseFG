import React, { Component } from 'react';
import './App.css';
import SceneManager from './containers/sceneManager/sceneManager';

class App extends Component {
  render() {
    return (
      <div className="App">
        <SceneManager/>
      </div>
    );
  };
}

export default App;