import React, { Component } from 'react';
import Aux from '../../hoc/Auxi';
import * as API from './compendiumsAPI';
import './compendiums.css';

import CompendiumForm from '../../components/compendium/compendiumForm/compendiumForm';
import CompendiumList from '../../components/compendium/compendiumList/compendiumList';

class Compendiums extends Component {
    state = {
        comps: [],
        data: null,
        action: null
    }

    componentDidMount() {
        this.initializeComps();
    }

    initializeComps = () => API.getComps((res) => this.setState({ comps: res }));
    setCompData = (data) => this.setState({ comps: data });
    setAction = (action) => this.setState({ action: action });

    render() {
        return (
            <Aux>
                <button onClick={() => this.props.setScene('title')}>Go Back</button>
                <hr/>
                <h1>Compendiums</h1>
                <hr />
                <button onClick={() => {
                    this.setAction('create');
                }}>Create Compendium</button>
                {
                    this.state.action === 'create' &&
                    <CompendiumForm
                        update={this.setCompData}
                        cancel={() => this.setAction(null)}
                    />
                }
                {
                    this.state.comps.length > 0 &&
                    <CompendiumList
                        update={this.setCompData}
                        setScene={this.props.setScene}
                        comps={this.state.comps}
                    />
                }
            </Aux>
        );
    }
}

export default Compendiums;