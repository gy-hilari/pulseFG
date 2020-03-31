import React, { Component } from 'react';
import Aux from '../../../hoc/Auxi';
import * as API from '../../../containers/compendiums/compendiumsAPI';
import './compendiumList.css';

const compendiumList = (props) => {
    return (
        <Aux>
            {
                props.comps.map((comp, idx) => {
                    return (
                        <Aux key={comp.id}>
                            <p>{`Name: ${comp.name}, Created At: ${comp.createdAt}`}</p>
                        </Aux>
                    );
                })
            }
        </Aux>
    );
}

export default compendiumList;
