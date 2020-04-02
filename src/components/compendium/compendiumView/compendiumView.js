import React, { useState, useContext } from 'react';
import { CompContext } from '../../../containers/sceneManager/sceneManager';
import Aux from '../../../hoc/Auxi';
import * as API from '../../../containers/compendiums/compendiumsAPI';
import Sessions from '../../../containers/sessions/sessions';
import './compendiumView.css';

const CompendiumView = (props) => {
    const compData = useContext(CompContext);
    const [compName, compRename] = useState(compData.stateComp.name);
    const [compEdit, compEditMode] = useState(null);

    const updateComp = () => {
        API.updateComp(
            { id: compData.stateComp.id, name: document.getElementById('compendium-name').value },
            (res) => refreshComp(res)
        );
    }
    
    const refreshComp = (updatedComp) => {
        compData.setComp(updatedComp);
        compEditMode(null);
    }

    return (
        <Aux>
            <button onClick={() => props.setScene('comps')}>Go Back</button>
            <hr />
            {
                !compEdit &&
                <h1 onDoubleClick={() => compEditMode('name')}>{compData.stateComp.name}</h1>
            }
            {
                compEdit === "name" &&
                <Aux>
                    <input id="compendium-name" type="text" />
                    <button onClick={() => { if (/\S/.test(document.getElementById('compendium-name').value)) updateComp(); }}>Confirm</button>
                    <button onClick={() => compEditMode(null)}>Cancel</button>
                </Aux>
            }
            <hr />
            <Sessions
                compId={compData.stateComp.id}
                setScene={props.setScene}
            />
        </Aux>
    );
}

export default CompendiumView;