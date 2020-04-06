import React from 'react';
import Aux from '../../../hoc/Auxi'

/*
    FOR GOD'S SAKE REFACTOR THIS LATER.....
    Figure out a more 'elegant' way to handle the return statement scope
 */

const MatchForm = (props) => {
    const formatResults = () => {
        let results = {};
        let invalid = false;
        props.measurements.forEach((measure, idx) => {
            let value = document.getElementById(`result-value-${idx}`).value;
            if (measure.mode === "binary") {
                results[measure.id] = parseInt(value) === measure.maximum ? parseInt(value) : 0;
            } else {
                let intVal = parseInt(value);
                if (!intVal) invalid = true;
                if (intVal > 0 && intVal <= measure.maximum) {
                    results[measure.id] = intVal;
                } else {
                    invalid = true;
                }
            }
        });
        return !invalid ? results : false;
    }
    
    return (
        <Aux>
            <input id="match-name" type="text" placeholder="Match Name" />
            <hr />
            <p style={{ "color": "red" }}>Maximum Value: {props.measurements[0].maximum}</p>
            {
                props.measurements.map((measure, idx) => {
                    return (
                        <div>
                            <p>{measure.name}</p>
                            {
                                measure.mode === "binary" ?
                                    <select id={`result-value-${idx}`}>
                                        <option value={measure.maximum}>Positive</option>
                                        <option value={"negative"}>Negative</option>
                                    </select>
                                    :
                                    <input id={`result-value-${idx}`} type="text" placeholder="value" />
                            }
                            <hr />
                        </div>
                    );
                })
            }
            <button onClick={() => {
                let formattedResults = formatResults();
                let matchName = document.getElementById('match-name').value;
                if (/\S/.test(matchName) && formattedResults) {
                    props.createMatch({
                        name: matchName,
                        results: formattedResults,
                        sessionId: props.sessionId
                    });
                    props.refresh();
                }
            }}>Add Match</button>
        </Aux>
    );
}

export default MatchForm;