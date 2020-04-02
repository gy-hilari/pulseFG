import React, { useContext } from 'react';
import { CompContext } from '../../../containers/sceneManager/sceneManager';
import Aux from '../../../hoc/Auxi';
import * as API from '../../../containers/compendiums/compendiumsAPI';
import './compendiumView.css';

const CompendiumView = (props) => {
    const compData = useContext(CompContext);
    return (
        <Aux>
            <button onClick={() => props.setScene('comps')}>Go Back</button>
            <h1>{compData.stateComp.name}</h1>
            <hr />
        </Aux>
    );
}

export default CompendiumView;