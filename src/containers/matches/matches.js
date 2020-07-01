import React, { Component } from 'react';
import Aux from '../../hoc/Auxi';
import * as API from './matchesAPI';
import PulseGraph from '../../components/pulseGraph/pulseGraph';
import MatchForm from '../../components/matches/matchForm/matchForm';

class Matches extends Component {
    state = {
        matches: [],
        measures: {},
        action: null,
        activeMatch: null
    }

    componentDidMount() {
        this.initializeMatches();
    }

    initializeMatches = () => API.getMatchesBySessionId(this.props.session.id, (res) => { console.log(res); this.setState({ matches: res }) });
    setMatchById = (matchId) => API.getMatchById(matchId, (res) => {
        // console.log(res.session);
        this.setState({ activeMatch: res });
    });
    createMatch = (form) => API.createMatch(form, (res) => { console.log(res) });
    deleteActiveMatch = (form) => API.deleteMatchById(form, (res) => { this.initializeMatches(); })

    render() {
        return (
            <Aux>
                {
                    !this.state.action && this.state.matches.length > 0 &&
                    <PulseGraph
                        matchData={this.state.matches}
                        datasets={Object.keys(JSON.parse(this.state.matches[0].results))}
                        measurements={this.props.measurements}
                        test={"test"}
                        setMatch={this.setMatchById}
                        createMatch={this.createMatch}
                        sessionId={this.props.session.id}
                    />
                }
                {
                    !this.state.action &&
                    <Aux>
                        <button onClick={() => this.setState({ action: 'create' })}>Create Match</button>
                    </Aux>
                }
                {
                    !this.state.action && this.state.activeMatch &&
                    <Aux>
                        {
                            Object.keys(this.state.activeMatch).map((key, idx) => {
                                if (key === "name") return <p key={`${this.state.activeMatch.id}-keys-${idx}`}>{this.state.activeMatch[key]}</p>
                                if (key === "results") return (
                                    <Aux key={`${this.state.activeMatch.id}-keys-${idx}`}>
                                        <hr />
                                        {
                                            this.props.measurements.map((measure) => {
                                                return measure.mode !== 'binary'
                                                    ? <p style={{ border: `2px solid ${measure.color}`, padding: '5px', width: 'max-content', margin: '5px auto' }} key={measure.id}> <span style={{ fontWeight: 'bold' }}>{`${measure.name} : `}</span> {`${JSON.parse(this.state.activeMatch[key])[measure.id]}`}</p>
                                                    : JSON.parse(this.state.activeMatch[key])[measure.id] === measure.maximum
                                                        ? <p style={{ border: `2px solid ${measure.color}`, padding: '5px', width: 'max-content', margin: '5px auto' }} key={measure.id}> <span style={{ fontWeight: 'bold' }}>{`${measure.name} : `}</span> {`Positive`}</p>
                                                        : <p style={{ border: `2px solid ${measure.color}`, padding: '5px', width: 'max-content', margin: '5px auto' }} key={measure.id}> <span style={{ fontWeight: 'bold' }}>{`${measure.name} : `}</span> {`Negative`}</p>
                                            })
                                        }
                                    </Aux>
                                );
                                return null;
                            })
                        }
                        <button onClick={() => this.deleteActiveMatch({matchId: this.state.activeMatch.id, sessionId: this.state.activeMatch.session})}>Delete Match</button>
                    </Aux>
                }
                {
                    this.state.action === 'create' &&
                    <Aux>
                        <MatchForm
                            measurements={this.props.measurements}
                            sessionId={this.props.session.id}
                            createMatch={this.createMatch}
                            refresh={() => {
                                this.initializeMatches();
                                this.setState({ action: null });
                            }}
                        />
                        <button onClick={() => this.setState({ action: null })}>Cancel</button>
                    </Aux>
                }
            </Aux>
        );
    }
}

export default Matches;