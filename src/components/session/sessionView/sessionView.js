import React, { useState, useContext } from 'react';
import { SessionContext } from '../../../containers/sceneManager/sceneManager';
import Aux from '../../../hoc/Auxi';
import * as API from '../../../containers/sessions/sessionsAPI';
import PulseGraph from '../../pulseGraph/pulseGraph';
import './sessionView.css';

const SessionView = (props) => {
    const sessionData = useContext(SessionContext);
    const [sessionEdit, sessionEditMode] = useState(null);

    const updateSessionName = () => {
        API.updateSessionName(
            { sessionId: sessionData.stateSession.id, name: document.getElementById('session-name').value },
            (res) => refreshSession(res)
        );
    }

    const refreshSession = (updatedSession) => {
        sessionData.setSession(updatedSession);
        sessionEditMode(null);
    }

    return (
        <Aux>
            <button onClick={() => props.setScene('comp')}>Go Back</button>
            <hr />
            {
                !sessionEdit &&
                <h1 onDoubleClick={() => sessionEditMode('name')}>{sessionData.stateSession.name}</h1>
            }
            {
                sessionEdit === "name" &&
                <Aux>
                    <input id="session-name" type="text" />
                    <button onClick={() => { if (/\S/.test(document.getElementById('session-name').value)) updateSessionName(); }}>Confirm</button>
                    <button onClick={() => sessionEditMode(null)}>Cancel</button>
                </Aux>
            }
            <hr />
            <p>{`Measuring: ${sessionData.stateSession.unitOfMeasure}`}</p>
            <PulseGraph />
        </Aux>
    )
}

export default SessionView;