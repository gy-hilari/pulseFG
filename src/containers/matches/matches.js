import React, { Component } from 'react';
import Aux from '../../hoc/Auxi';
import * as API from './matchesAPI';
import PulseGraph from '../../components/pulseGraph/pulseGraph';
import continuousColorLegend from 'react-vis/dist/legends/continuous-color-legend';

class Matches extends Component {
    state = {
        matches: [],
        measures: {},
        action: null,
        activeMatch: null
    }

    componentDidMount() {
        this.initializeMatches();
        this.generateMeasurements();
    }

    /*  
        BEGIN WORKING ON DYNAMIC JSON FORM FOR MATCH 'RESULTS' FIELD
    */

    /* 
        MEASUREMENT NEEDS A MAX VALUE IN ORDER FOR BINARY PULSE TO SCALE CORRECTLY
    */

    initializeMatches = () => API.getMatchesBySessionId(this.props.session.id, (res) =>{console.log(res); this.setState({ matches: res })});
    setMatchById = (matchId) => API.getMatchById(matchId, (res) => this.setState({ activeMatch: res }));
    setActiveMatch = (match) => this.setState({ activeMatch: match });
    createMatch = (form) => API.createMatch(form, (res) => { console.log(res) });
    generateMeasurements = () => {
        console.log(this.props.measurements);
        let measures = {};
        this.props.measurements.forEach(measure => {
            console.log(measure);
            measures[measure.id] = this.measurementFormat(measure.mode, measure.maximum);
        });
        console.log(measures);
        this.setState({ measures: measures });
    }
    measurementFormat = (measurement, maxVal) => {
        if (measurement === "score") return Math.random() * maxVal;
        if (measurement === "placement") return Math.random() * maxVal;
        if (measurement === "binary") return Math.round(Math.random()) * maxVal;
    }

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
                        this.generateMeasurements();
                        this.createMatch({
                            name: "test",
                            results: this.state.measures,
                            sessionId: this.props.session.id
                        });
                        this.initializeMatches();
                    }}>Generate Match</button>
                }
                {
                    this.state.action === 'create'
                }
                {
                    this.state.activeMatch &&
                    Object.keys(this.state.activeMatch).map((key) => {
                        if (key !== 'results') return <p>{`${key}: ${this.state.activeMatch[key]}`}</p>
                    })
                }
            </Aux>
        );
    }
}

export default Matches;