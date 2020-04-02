import React, { Component } from 'react';
import Aux from '../../hoc/Auxi';
import * as API from './sessionsAPI';
import './sessions.css';

import SessionForm from '../../components/session/sessionForm/sessionForm';
import SessionList from '../../components/session/sessionList/sessionList';

class Sessions extends Component {
    state = {
        sessions: [],
        action: null
    }

    componentDidMount() {
        this.initializeSessions();
    }

    initializeSessions = () => API.getSessionsByCompId(this.props.compId, (res) => this.setState({ sessions: res }));
    setSessionData = (data) => this.setState({ sessions: data });
    setAction = (action) => this.setState({ action: action });

    render() {
        return (
            <Aux>
                {
                    !this.state.action &&
                    <button onClick={() => this.setAction('create')}>Create Session</button>

                }
                {
                    this.state.action === 'create' &&
                    <SessionForm
                        compId={this.props.compId}
                        update={this.setSessionData}
                        cancel={() => this.setAction(null)}
                    />
                }
                {
                    this.state.sessions.length > 0 &&
                    <SessionList
                        compId={this.props.compId}
                        update={this.setSessionData}
                        sessions={this.state.sessions}
                    />
                }
            </Aux>
        );
    }
}

export default Sessions;