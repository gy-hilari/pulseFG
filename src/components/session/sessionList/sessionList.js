import React, { useContext } from 'react';
import { SessionContext } from '../../../containers/sceneManager/sceneManager';
import Aux from '../../../hoc/Auxi';
import * as API from '../../../containers/sessions/sessionsAPI';
import './sessionList.css';

const SessionList = (props) => {
    const sessionContext = useContext(SessionContext);
    return (
        <Aux>
            {
                props.sessions.map((session, idx) => {
                    return (
                        <Aux key={session.id}>
                            <div className="session-card">
                                <p className="session-text">{session.name}</p>
                                <p className="session-text">{session.unitOfMeasure}</p>
                                <p className="session-text">{new Date(session.createdAt).toISOString().split('T')[0]}</p>
                                <p className="session-delete" onClick={() => {
                                    API.deleteSessionById(
                                        { sessionId: session.id, compId: props.compId },
                                        () => API.getSessionsByCompId(props.compId, (res) => props.update(res))
                                    );
                                }}>
                                    DELETE
                                </p>
                            </div>
                        </Aux>
                    );
                })
            }
        </Aux>
    );
}

export default SessionList;
