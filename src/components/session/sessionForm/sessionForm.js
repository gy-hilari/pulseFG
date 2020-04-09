import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import Aux from '../../../hoc/Auxi';
import * as API from '../../../containers/sessions/sessionsAPI';
import './sessionForm.css';

const SessionForm = (props) => {
    const validate = (element) => {
        return (/\S/.test(element)) ? true : false;
    }

    const [measures, setMeasures] = useState(1);
    const [measureColor, setMeasureColor] = useState([]);

    const measureForms = () => {
        let forms = [];
        for (let i = 0; i < measures; i++) {
            forms.push(pushMeasureForm(i));
        }
        return forms;
    }

    const pushMeasureForm = (idx) => {
        return (
            <div key={`measure-form-${idx}`} className="session-measure">
                <input id={`session-measure-${idx}`} className="session-measure" type="text" placeholder="Measurement Name" />
                <select id={`session-measure-mode-${idx}`}>
                    <option value="score">{`score (higher is better)`}</option>
                    <option value="placement">{`placement (lower is better)`}</option>
                    <option value="binary">{`binary (win / loss)`}</option>
                </select>
                <div style={{ width: 'max-content', margin: '0px auto' }}>
                    <ChromePicker
                        color={measureColor[idx]}
                        onChangeComplete={(color) => {
                            console.log(color.hex);
                            let colorArr = measureColor;
                            colorArr[idx] = color.hex;
                            setMeasureColor(colorArr);
                        }}
                    />
                </div>
            </div>
        );
    }

    const createMeasurements = (sessionId) => {
        for (let i = 0; i < measures; i++) {
            API.createMeasurement(
                {
                    name: document.getElementById(`session-measure-${i}`).value,
                    mode: document.getElementById(`session-measure-mode-${i}`).value,
                    maximum: document.getElementById(`session-measure-max`).value,
                    color: measureColor[i] ? measureColor[i] : '#22194D',
                    sessionId: sessionId
                },
                () => { }
            );
        }
    }

    const validateMeasurements = () => {
        for (let i = 0; i < measures; i++) {
            if (!validate(document.getElementById(`session-measure-${i}`).value) || !validate(document.getElementById(`session-measure-mode-${i}`).value))
                return false;
            let sessionMax = parseInt(document.getElementById(`session-measure-max`).value);
            if (sessionMax) if (sessionMax < 0) return false;
        }
        return true;
    }

    return (
        <Aux>
            <input id="session-name" type="text" placeholder="Session Name" />
            <hr />
            <input id={`session-measure-max`} className="session-measure" type="text" placeholder="Measurement Maximum" />
            <button onClick={() => setMeasures(measures + 1)}>Add Measurement</button>
            <button onClick={() => measures - 1 > 0 ? setMeasures(measures - 1) : null}>Remove Measurement</button>
            {
                measureForms().map((form) => {
                    return form;
                })
            }
            <hr />
            <button onClick={() => {
                if (validate(document.getElementById('session-name').value) && validateMeasurements()) {
                    API.createSession(
                        {
                            compId: props.compId,
                            name: document.getElementById('session-name').value
                        },
                        (res) => {
                            API.getSessionsByCompId(props.compId, (res) => {
                                props.update(res);
                            });
                            createMeasurements(res);
                            props.cancel();
                        });
                }
            }}>Create</button>
            <button onClick={() => props.cancel()}>Cancel</button>
        </Aux>
    );
}

export default SessionForm;