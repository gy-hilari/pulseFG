import React, { Component } from 'react';
import Aux from '../../hoc/Auxi';
import './sceneManager.css';

import Compendiums from '../compendiums/compendiums';
import CompendiumView from '../../components/compendium/compendiumView/compendiumView';

export const CompContext = React.createContext();

class SceneManager extends Component {
    state = {
        scene: 'title',
        activeComp: null
    }

    setScene = (sceneName) => this.setState({ scene: sceneName });
    setComp = (comp) => { this.setState({ activeComp: comp }) };

    render() {
        return (
            <Aux>
                {
                    this.state.scene === 'title' &&
                    <Aux>
                        <h1>PulseFG</h1>
                        <hr />
                        <button onClick={() => {
                            this.setScene('comps');
                        }}>Start</button>
                    </Aux>
                }
                <CompContext.Provider value={{ stateComp: this.state.activeComp, setComp: this.setComp, test: "test value" }}>
                    {
                        this.state.scene === 'comps' &&
                        <Compendiums setScene={this.setScene} />
                    }
                    {
                        this.state.scene === 'comp' &&
                        <CompendiumView setScene={this.setScene}/>
                    }
                </CompContext.Provider>
            </Aux>
        );
    }
}

export default SceneManager;