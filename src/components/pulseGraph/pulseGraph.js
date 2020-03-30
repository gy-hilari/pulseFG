import React, { Component } from 'react';
import './pulseGraph.css';
import '../../../node_modules/react-vis/dist/style.css';
import Radium, { Style } from 'radium';
import { XYPlot, XAxis, YAxis, LineMarkSeries, makeHeightFlexible, makeWidthFlexible, Hint, Crosshair } from 'react-vis';

const FlexPlot = makeWidthFlexible(XYPlot);

class PulseGraph extends Component {
    state = {
        data: this.generateData(5),
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
            <div>
                <button onClick={() =>
                    this.setState({
                        data: this.pushData(this.state.data)
                    })
                }>
                    Update
                </button>
                <div className="graph-wrap">
                    <FlexPlot
                        height={300}
                    // onMouseLeave={() => this.setState({ focusValue: false })}
                    >
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
                            data={this.state.data}
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
            </div>
        );
    }
}

export default Radium(PulseGraph);
