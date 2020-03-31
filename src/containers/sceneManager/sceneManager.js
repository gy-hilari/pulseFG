import React, { Component } from 'react';
import Aux from '../../hoc/Auxi';
import './sceneManager.css';

import Compendiums from '../compendiums/compendiums';

class SceneManager extends Component {
    state = {
        scene: 'title'
    }

    setScene = (sceneName) => {
        this.setState({ scene: sceneName });
    }

    render() {
        return (
            <Aux>
                {
                    this.state.scene === 'title' &&
                    <Aux>
                        <h1>PulseFG</h1>
                        <hr/>
                        <button onClick={() => {
                            this.setScene('comp');
                        }}>Start</button>
                    </Aux>
                }
                {
                    this.state.scene === 'comp' &&
                    <Compendiums
                        setScene={this.setScene}
                    />
                }
            </Aux>
        );
    }
}

export default SceneManager;