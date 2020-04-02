import React, { Component } from 'react';
import Aux from '../../hoc/Auxi';
import './pulseGraph.css';
import '../../../node_modules/react-vis/dist/style.css';
import { XYPlot, XAxis, YAxis, LineMarkSeries, makeHeightFlexible, makeWidthFlexible, Hint, Crosshair } from 'react-vis';

const FlexPlot = makeWidthFlexible(XYPlot);

class PulseGraph extends Component {
    state = {
        data1: this.generateData(5),
        data2: this.generateData(5),
        focusValue: false,
    }

    generateData(rowCount) {
        return [...new Array(rowCount)].map((row, idx) => ({
            x: idx,
            y: Math.random() * 1000
        }));
    }

    pushData(arr) {
        console.log(arr);
        arr.push({
            x: arr.length + 1,
            y: Math.random() * 1000
        });
        return arr;
    };

    render() {
        return (
            <Aux>

                <button onClick={() =>
                    this.setState({
                        data1: this.pushData(this.state.data1),
                        data2: this.pushData(this.state.data2)
                    })
                }>
                    Update
                </button>
                <div className="graph-wrap">
                    <FlexPlot height={300}>
                        <XAxis
                            title="X Axis"
                            style={{
                                line: { stroke: '#ADDDE1' },
                                ticks: { stroke: '#ADDDE1' },
                                text: { stroke: 'none', fill: '#6b6b76', fontWeight: 600 }
                            }}
                        />
                        <YAxis title="Y Axis" />
                        <LineMarkSeries
                            data={this.state.data1}
                            lineStyle={{
                                stroke: 'green'
                            }}
                            markStyle={{
                                fill: 'green'
                            }}
                            animation={'gentle'}
                            onNearestX={(datapoint, { event, innerX, index }) => {
                                this.setState({ focusValue: datapoint });
                            }}
                            onValueClick={(datapoint, { event, innerX, index }) => {
                                console.log(datapoint);
                            }} />
                        <LineMarkSeries
                            data={this.state.data2}
                            lineStyle={{
                                stroke: 'red'
                            }}
                            markStyle={{
                                fill: 'red'
                            }}
                            animation={'gentle'}
                            onNearestX={(datapoint, { event, innerX, index }) => {
                                this.setState({ focusValue: datapoint });
                            }}
                            onValueClick={(datapoint, { event, innerX, index }) => {
                                console.log(datapoint);
                            }} />
                        {
                            this.state.focusValue &&
                            <Crosshair
                                values={[this.state.focusValue]}
                                titleFormat={(d) => ({ title: 'X', value: d[0].x })}
                                itemsFormat={(d) =>
                                    [
                                        {
                                            title: 'Y',
                                            value: d[0].y
                                        }
                                    ]
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
