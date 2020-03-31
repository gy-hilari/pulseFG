import React from 'react';
import Aux from '../../../hoc/Auxi';
import * as API from '../../../containers/compendiums/compendiumsAPI';


const compendiumForm = (props) => {
    return (
        <Aux>
            <input id="compendium-name" type="text" />
            <button onClick={() => {
                if (/\S/.test(document.getElementById('compendium-name'))) {
                    API.createComp(
                        {
                            name: document.getElementById('compendium-name').value
                        },
                        (res) => {
                            props.update(res);
                        });
                }
            }}>Create</button>
            <button onClick={() => props.cancel()}>Cancel</button>
        </Aux>
    );
}

export default compendiumForm;