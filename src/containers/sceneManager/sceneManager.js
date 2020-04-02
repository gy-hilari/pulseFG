import React, { Component } from 'react';
import Aux from '../../hoc/Auxi';
import './sceneManager.css';

import Compendiums from '../compendiums/compendiums';
import CompendiumView from '../../components/compendium/compendiumView/compendiumView';
import SessionView from '../../components/session/sessionView/sessionView';

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
                <CompContext.Provider value={{ stateComp: this.state.activeComp, setComp: this.setComp }}>
                    {
                        this.state.scene === 'comps' &&
                        <Compendiums setScene={this.setScene} />
                    }
                    {
                        this.state.scene === 'comp' &&
                        <SessionContext.Provider value={{ stateSession: this.state.activeSession, setSession: this.setSession }}>
                            <CompendiumView setScene={this.setScene} />
                        </SessionContext.Provider>
                    }
                </CompContext.Provider>
                <SessionContext.Provider value={{ stateSession: this.state.activeSession, setSession: this.setSession }}>
                    {
                        this.state.scene === 'session' &&
                        <SessionView setScene={this.setScene} />
                    }
                </SessionContext.Provider>
            </Aux>
        );
    }
}

export default SceneManager;