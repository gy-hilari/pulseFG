import React, { useState } from 'react';
import Aux from '../../../hoc/Auxi';
import * as API from '../../../containers/sessions/sessionsAPI';
import './sessionForm.css';

const CompendiumForm = (props) => {
    const validate = () => {
        return (/\S/.test(document.getElementById('session-name').value)) ? true : false;
    }

    const [measures, setMeasures] = useState(1);

    const measureForms = () => {
        let forms = [];
        for (let i = 0; i < measures; i++) {
            forms.push(pushMeasureForm());
        }
        return forms;
    }

    const pushMeasureForm = () => {
        return (
            <div className="session-measure">
                <input className="session-measure" type="text" placeholder="Measurement Name" />
                <select>
                    <option value="score">score</option>
                    <option value="placement">placement</option>
                    <option value="binary">{`binary (win / loss)`}</option>
                </select>
            </div>
        );
    }

    return (
        <Aux>
            <input id="session-name" type="text" placeholder="Session Name" />
            <hr />
            {
                measureForms().map((form) => {
                    return form;
                })
            }
            <button onClick={() => setMeasures(measures + 1)}>Add Measurement</button>
            <button onClick={() => measures - 1 > 0 ? setMeasures(measures - 1) : null}>Remove Measurement</button>
            <hr />
            <button onClick={() => {
                if (validate()) {
                    API.createSession(
                        {
                            compId: props.compId,
                            name: document.getElementById('session-name').value
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

export default CompendiumForm;