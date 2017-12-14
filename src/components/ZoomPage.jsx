import React from 'react'
import Constants from 'data/Constants'
import PokedexHelper from 'data/PokedexHelper'
import Pokemon from 'components/Pokemon'
import CombatPanel from 'components/CombatPanel'

class ZoomPage extends React.Component {
   constructor() {
        super(...arguments)
    }

    eventHandler(args) {

    }
    generateEvolves(evolutions, evolves, level) {    
        
        let children = [], trs = [];
        evolutions.forEach((evolution) => {

            evolves.push(
                <Pokemon key={ evolution.id } id={ evolution.id } inactive={ !evolution.active } className={ 'zoom-indent' + level } eventHandler={ this.props.eventHandler }/>
            );

            if (evolution.children.length) {
                children.push(evolution.children);
            }
        });

        children.forEach((child) => {
            this.generateEvolves(child, evolves, level + 1);
        });
    }

    onBack() {

        this.props.eventHandler({
            eventType: Constants.EVENT.ZoomPageClosed
        });
    }
    
    render() { 

        if (!this.props.visible) {
            return null;
        }

        let evolves = [];
        let evolutions = PokedexHelper.getEvolvesList(this.props.id);
        this.generateEvolves(evolutions, evolves, 0);

        return (

            <div className="page">
                <div className="navbar">
                    <button className="left-panel back-button" onClick= {() => this.onBack() }></button>
                    <label>Evolutions</label>
                </div>
                <div className="pokemon-zoom">
                    <div className="zoom-container">
                        {evolves}
                    </div>
                    <CombatPanel id={ this.props.id }/>
    		    </div>
		    </div>
        )
    }
}

export default ZoomPage; 