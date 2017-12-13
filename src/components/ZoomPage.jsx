import React from 'react'
import Constants from 'data/Constants'
import Pokemon from 'components/Pokemon'

class ZoomPage extends React.Component {
   constructor() {
        super(...arguments)
    }

    generateEvolves(evolutions, evolves, level) {    
        
        let children = [], trs = [];
        evolutions.forEach((evolution) => {

            trs.push(
                <tr><td><Pokemon id={ evolution.id } inactive={ !evolution.active }/></td></tr>
            );

            if (evolution.children.length) {
                children.push(evolution.children);
            }
        });

        evolves.push(
            <table className={ 'zoom-indent' + level } border="0" cellspacing="0" cellpadding="0"><tbody>
                {trs}
            </tbody></table>
        );

        children.forEach((child) => {
            this.generateEvolves(child, evolves, level + 1);
        });
    }

    onBack() {

        this.props.eventHandler({
            event: Constants.EVENT.ZoomPageClosed
        });
    }
    
    render() { 

        if (!this.props.visible) {
            return null;
        }

        let evolves = [];
        this.generateEvolves(this.props.evolutions, evolves, 0);

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
		    </div>
        )
    }
}

export default ZoomPage; 