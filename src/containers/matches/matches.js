import React, { Component } from 'react';
import Aux from '../../hoc/Auxi';
import * as API from './matchesAPI';
import PulseGraph from '../../components/pulseGraph/pulseGraph';

class Matches extends Component {
    state = {
        matches: [],
        action: null,
        activeMatch: null
    }

    componentDidMount() {
        this.initializeMatches();
    }

    initializeMatches = () => API.getMatchesBySessionId(this.props.session.id, (res) => this.setState({ matches: res }));
    setMatchById = (matchId) => API.getMatchById(matchId, (res) =>  this.setState({ activeMatch: res }));
    setActiveMatch = (match) => this.setState({ activeMatch: match });
    createMatch = (form) => API.createMatch(form, (res) => { console.log(res) });

    render() {
        return (
            <Aux>
                {
                    this.state.matches.length > 0 &&
                    <PulseGraph
                        matchData={this.state.matches}
                        datasets={Object.keys(JSON.parse(this.state.matches[0].results))}
                        test={"test"}
                        setMatch={this.setMatchById}
                        createMatch={this.createMatch}
                        sessionId={this.props.session.id}
                    />
                }
                {
                    !this.state.action &&
                    <button onClick={() => {
                        this.createMatch({
                            name: "test",
                            results: {
                                a: Math.random() * 1000,
                                b: Math.random() * 1000,
                                c: Math.random() * 1000
                            },
                            sessionId: this.props.session.id
                        });
                        this.initializeMatches();
                    }}>Add Match</button>
                }
                {
                    this.state.action === 'create'
                }
                {
                    this.state.activeMatch &&

                    <Aux>
                        <p>Test</p>
                        {
                            Object.keys(this.state.activeMatch).map((key) => {
                                if(key !== 'results') return <p>{`${key}: ${this.state.activeMatch[key]}`}</p>
                            })
                        }
                    </Aux>
                }
            </Aux>
        );
    }
}

export default Matches;