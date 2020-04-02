import React, { useState, useContext } from 'react';
import { SessionContext } from '../../../containers/sceneManager/sceneManager';
import Aux from '../../../hoc/Auxi';
import * as API from '../../../containers/sessions/sessionsAPI';
import PulseGraph from '../../pulseGraph/pulseGraph';
import './sessionView.css';

const SessionView = (props) => {
    const sessionData = useContext(SessionContext);
    const [sessionEdit, sessionEditMode] = useState(null);

    return (
        <Aux>
            <button onClick={() => props.setScene('comp')}>Go Back</button>
            <hr />
            {
                !sessionEdit &&
                <h1>{sessionData.stateSession.name}</h1>
            }
            <hr />
            <p>{`Measuring: ${sessionData.stateSession.unitOfMeasure}`}</p>
            <PulseGraph />
        </Aux>
    )
}

export default SessionView;