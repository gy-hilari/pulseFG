import React, { Component } from 'react';
import Aux from '../../hoc/Auxi';
import './sceneManager.css';

import Compendiums from '../compendiums/compendiums';
import CompendiumView from '../../components/compendium/compendiumView/compendiumView';

export const CompContext = React.createContext();
export const SessionContext = React.createContext();

class SceneManager extends Component {
    state = {
        scene: 'title',
        activeComp: null,
        activeSession: null
    }

    setScene = (sceneName) => this.setState({ scene: sceneName });
    setComp = (comp) => { this.setState({ activeComp: comp }) };
    setSession = (session) => { this.setState({ activeSession: session }) };

    render() {
        return (
            <Aux>
                {
                    this.state.scene === 'title' &&
                    <Aux>
                        {/* PLACE TITLE SCREEN COMPONENT HERE */}
                        <h1>PulseFG</h1>
                        <hr />
                        <button onClick={() => {
                            this.setScene('comps');
                        }}>Start</button>
                    </Aux>
                }
                <CompContext.Provider value={{ stateComp: this.state.activeComp, setComp: this.setComp}}>
                    {
                        this.state.scene === 'comps' &&
                        <Compendiums setScene={this.setScene} />
                    }
                    {
                        this.state.scene === 'comp' &&
                        <CompendiumView setScene={this.setScene} />
                    }
                </CompContext.Provider>
                <SessionContext.Provider value={{ stateSession: this.state.activeSession, setSession: this.activeSession}}>
                    {
                        this.state.scene === 'sessions'
                    }
                </SessionContext.Provider>
            </Aux>
        );
    }
}

export default SceneManager;