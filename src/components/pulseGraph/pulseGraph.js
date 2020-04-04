import React, { Component } from 'react';
import Aux from '../../hoc/Auxi';
import './pulseGraph.css';
import '../../../node_modules/react-vis/dist/style.css';
import { XYPlot, XAxis, YAxis, LineMarkSeries, makeHeightFlexible, makeWidthFlexible, Hint, Crosshair } from 'react-vis';

const FlexPlot = makeWidthFlexible(XYPlot);

class PulseGraph extends Component {
    state = {
        datasets: {},
        idSet: [],
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
        let idSet = [];
        this.props.datasets.forEach((set) => {
            this.props.matchData.forEach((match) => {
                !allSets[set] ? allSets[set] = [JSON.parse(match.results)[set]] : allSets[set].push(JSON.parse(match.results)[set])
                idSet.push(match.id);
            });
        });
        let formattedSets = {};
        for (let key of Object.keys(allSets)) {
            formattedSets[key] = this.formatData(allSets[key]);
        }
        this.setState({ datasets: formattedSets, idSet: idSet });
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
                            Object.keys(this.state.datasets).map((set) => {
                                return (
                                    <LineMarkSeries
                                        data={this.state.datasets[set]}
                                        lineStyle={{
                                            stroke: 'green'
                                        }}
                                        markStyle={{
                                            fill: 'green'
                                        }}
                                        animation={'gentle'}
                                        onNearestX={(datapoint, { event, innerX, index }) => {
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
                            <Crosshair
                                values={this.state.focusValue}
                                titleFormat={(d) => ({ title: 'X', value: d[0].x + 1 })}
                                itemsFormat={(d) =>
                                    [{ title: 'Value', value: d[0].y }]
                                }
                            />
                        }
                    </FlexPlot>
                </div>
            </Aux>
        );
    }
}

export default PulseGraph;
