import React from 'react'
import PokedexHelper from 'data/PokedexHelper'
import Constants from 'data/Constants'

class CombatPanel extends React.Component {
   
    constructor() {
        super(...arguments)
    }

    render() { 

        let attacks = PokedexHelper.getAttacks(this.props.id);

        return (
            <div>
                <table className="attack-table">
                <thead><th>Attaques Rapides</th><th>Attaques chargées</th></thead>
                </table>
            </div>
        )
    }
}

export default CombatPanel
