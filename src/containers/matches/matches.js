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
    setMatchById = (matchId) => API.getMatchById(matchId, (res) => this.setState({ activeMatch: res }));
    setActiveMatch = (match) => this.setState({ activeMatch: match });
    createMatch = (form) => API.createMatch(form, (res) => { console.log(res) });

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
                                                ? <p key={measure.id}>{`${measure.name} : ${JSON.parse(this.state.activeMatch[key])[measure.id]}`}</p>
                                                : JSON.parse(this.state.activeMatch[key])[measure.id] === measure.maximum 
                                                    ? <p key={measure.id}>{`${measure.name} : Positive`}</p>
                                                    : <p key={measure.id}>{`${measure.name} : Negative`}</p>
                                            })
                                        }
                                    </Aux>
                                );
                                return null;
                                // return key !== 'results'
                                //     ? <p key={`${this.state.activeMatch.id}-keys-${idx}`}>{`${key} : ${this.state.activeMatch[key]}`}</p>
                                //     : <Aux key={`${this.state.activeMatch.id}-keys-${idx}`}>
                                //         <hr />
                                //         {
                                //             this.props.measurements.map((measure) => {
                                //                 return <p key={measure.id}>{`${measure.name} : ${JSON.parse(this.state.activeMatch[key])[measure.id]}`}</p>
                                //             })
                                //         }
                                //     </Aux>
                            })
                        }
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