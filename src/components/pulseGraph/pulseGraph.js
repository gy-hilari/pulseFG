import React, { Component } from 'react';
import Aux from '../../hoc/Auxi';
import './pulseGraph.css';
import '../../../node_modules/react-vis/dist/style.css';
import { XYPlot, XAxis, YAxis, LineMarkSeries, makeWidthFlexible, Crosshair } from 'react-vis';

const FlexPlot = makeWidthFlexible(XYPlot);

class PulseGraph extends Component {
    state = {
        datasets: {},
        idSet: [],
        dateCreatedSet: [],
        focusValue: false,
        lockGraph: false
    }

    componentDidMount() {
        this.initializeData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.matchData !== prevProps.matchData) {
            let lockStatus = this.state.lockGraph;
            if (!lockStatus) this.setState({ lockGraph: true });
            this.initializeData();
            this.setState({ lockGraph: lockStatus });
        }
    }

    initializeData = () => {
        let allSets = {};
        let idSet = [], dateCreatedSet = [];
        this.props.datasets.forEach((set) => {
            this.props.matchData.forEach((match) => {
                !allSets[set] ? allSets[set] = [JSON.parse(match.results)[set]] : allSets[set].push(JSON.parse(match.results)[set])
                idSet.push(match.id);
                dateCreatedSet.push(new Date(match.createdAt).toLocaleString('en-US', { 'dateStyle': 'medium', 'timeStyle': 'short', 'hour12': 'false' }));
            });
        });
        let formattedSets = {};
        for (let key of Object.keys(allSets)) {
            formattedSets[key] = this.formatData(allSets[key]);
        }
        this.setState({ datasets: formattedSets, idSet: idSet, dateCreatedSet: dateCreatedSet });
    }

    formatData = (set) => { return [...new Array(set.length)].map((elm, idx) => ({ x: idx, y: set[idx] })) }


    render() {
        return (
            <Aux>
                <div className="graph-wrap">
                    <p>Lock Graph</p>
                    <input type="checkbox" defaultValue={this.state.lockGraph} onChange={() => this.setState({ lockGraph: !this.state.lockGraph })} />
                    <FlexPlot height={300} onClick={() => {
                        this.props.setMatch(this.state.idSet[this.state.focusValue[0].x]);
                    }}>
                        <XAxis
                            title="X Axis"
                            style={{
                                line: { stroke: '#ADDDE1' },
                                ticks: { stroke: '#ADDDE1' },
                                text: { stroke: 'none', fill: '#6b6b76', fontWeight: 600 }
                            }}
                        />
                        <YAxis title="Y Axis" />
                        {
                            Object.keys(this.props.measurements).map((measure) => {
                                return (
                                    <LineMarkSeries
                                        key={`dataset-${this.props.measurements[measure].id}`}
                                        data={this.state.datasets[this.props.measurements[measure].id]}
                                        lineStyle={{
                                            stroke: this.props.measurements[measure].color
                                        }}
                                        markStyle={{
                                            fill: this.props.measurements[measure].color
                                        }}
                                        animation={'gentle'}
                                        onNearestX={(datapoint) => {
                                            if (!this.state.lockGraph) {
                                                this.setState({ focusValue: [datapoint] });
                                            }
                                        }}
                                    />
                                )
                            })
                        }

                        {
                            this.state.focusValue &&
                            <Crosshair values={this.state.focusValue}>
                                <div style={{ background: 'black', padding: '10px', width: '200px', textAlign: 'center' }}>
                                    <p>{this.state.dateCreatedSet[this.state.focusValue[0].x]}</p>
                                </div>
                            </Crosshair>
                        }
                    </FlexPlot>
                </div>
            </Aux>
        );
    }
}

export default PulseGraph;
