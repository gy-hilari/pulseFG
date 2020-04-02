import React, { useContext } from 'react';
import { CompContext } from '../../../containers/sceneManager/sceneManager';
import Aux from '../../../hoc/Auxi';
import * as API from '../../../containers/compendiums/compendiumsAPI';
import './compendiumList.css';

const CompendiumList = (props) => {
    const compContext = useContext(CompContext);
    return (
        <Aux>
            {
                props.comps.map((comp, idx) => {
                    return (
                        <Aux key={comp.id}>
                            <div className="comp-card">
                                <p className="comp-text"
                                    onClick={() => {
                                        compContext.setComp(comp);
                                        props.setScene('comp');
                                    }}>  {`Name: ${comp.name}, Created: ${new Date(comp.createdAt).toLocaleString('en-US', { 'dateStyle': 'medium', 'timeStyle': 'short', 'hour12': 'false' })}`}</p>
                                <p className="comp-delete" onClick={() => API.deleteComp(comp.id, (res) => props.update(res))}>DELETE</p>
                            </div>
                        </Aux>
                    );
                })
            }
        </Aux>
    );
}

export default CompendiumList;