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

            trs.push(
                <tr><td><Pokemon id={ evolution.id } inactive={ !evolution.active } eventHandler={ this.props.eventHandler }/></td></tr>
            );

            if (evolution.children.length) {
                children.push(evolution.children);
            }
        });

        evolves.push(
            <table className={ 'zoom-indent' + level } border="0" cellSpacing="0" cellPadding="0"><tbody>
                {trs}
            </tbody></table>
        );

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
                <div className="pokemon-zoom" >
                    <div className="zoom-container">
                        {evolves}
                    </div>
    		    </div>
               <CombatPanel id={ this.props.id }/>
		    </div>
        )
    }
}

export default ZoomPage; 