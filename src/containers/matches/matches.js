import React, { Component } from 'react';
import Aux from '../../hoc/Auxi';
import * as API from './matchesAPI';
import PulseGraph from '../../components/pulseGraph/pulseGraph';

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

    /* 
        EXPORT INTO MATCH FORM COMPONENT
    */
    formatResults = () => {
        let results = {};
        let invalid = false;
        this.props.measurements.forEach((measure, idx) => {
            console.log(measure.mode);
            let value = document.getElementById(`result-value-${idx}`).value;
            if (measure.mode === "binary") {
                console.log(value);
                results[measure.id] = parseInt(value) === measure.maximum ? parseInt(value) : 0;
            } else {
                let intVal = parseInt(value);
                console.log(intVal);
                if (!intVal) invalid = true;
                if (intVal > 0 && intVal <= measure.maximum) {
                    results[measure.id] = intVal;
                } else {
                    invalid = true;
                }
            }
        });
        return !invalid ? results : false;
    }

    render() {
        return (
            <Aux>
                {
                    !this.state.action && this.state.matches.length > 0 &&
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
                    <Aux>
                        <button onClick={() => this.setState({ action: 'create' })}>Create Match</button>
                    </Aux>
                }
                {
                    !this.state.action && this.state.activeMatch &&
                    Object.keys(this.state.activeMatch).map((key) => {
                        if (key !== 'results') return <p>{`${key}: ${this.state.activeMatch[key]}`}</p>
                    })
                }
                {
                    /* 
                        EXPORT INTO MATCH FORM COMPONENT
                    */

                    this.state.action === 'create' &&
                    <Aux>
                        <input id="match-name" type="text" placeholder="Match Name" />
                        <hr />
                        <p style={{ "color": "red" }}>Maximum Value: {this.props.measurements[0].maximum}</p>
                        {
                            this.props.measurements.map((measure, idx) => {
                                return (
                                    <div>
                                        <p>{measure.name}</p>
                                        {
                                            measure.mode === "binary" ?
                                                <select id={`result-value-${idx}`}>
                                                    <option value={measure.maximum}>Positive</option>
                                                    <option value={"negative"}>Negative</option>
                                                </select>
                                                :
                                                <input id={`result-value-${idx}`} type="text" placeholder="value" />
                                        }
                                        <hr />
                                    </div>
                                );
                            })
                        }
                        <button onClick={() => {
                            let formatResults = this.formatResults();
                            console.log(formatResults);
                            let matchName = document.getElementById('match-name').value;
                            if (/\S/.test(matchName) && formatResults) {
                                this.createMatch({
                                    name: matchName,
                                    results: formatResults,
                                    sessionId: this.props.session.id
                                });
                                this.initializeMatches();
                                this.setState({ action: null });
                            }
                        }}>Add Match</button>
                        <button onClick={() => this.setState({ action: null })}>Cancel</button>
                    </Aux>
                }
            </Aux>
        );
    }
}

export default Matches;