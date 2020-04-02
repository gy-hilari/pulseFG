import React from 'react';
import Aux from '../../../hoc/Auxi';
import * as API from '../../../containers/sessions/sessionsAPI';

const validate = () => {
     return (/\S/.test(document.getElementById('session-name').value) && /\S/.test(document.getElementById('session-unit').value)) ? true : false;
}

const compendiumForm = (props) => {
    return (
        <Aux>
            <input id="session-name" type="text" placeholder="Session Name"/>
            <input id="session-unit" type="text" placeholder="Unit of Measure"/>
            <button onClick={() => {
                if (validate()) {
                    API.createSession(
                        {
                            compId: props.compId,
                            name: document.getElementById('session-name').value,
                            unit: document.getElementById('session-unit').value
                        },
                        (res) => {
                            props.update(res);
                            props.cancel();
                        });
                }
            }}>Create</button>
            <button onClick={() => props.cancel()}>Cancel</button>
        </Aux>
    );
}

export default compendiumForm;