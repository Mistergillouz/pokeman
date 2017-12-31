import React from 'react'
import PokedexHelper from 'data/PokedexHelper'
import Constants from 'data/Constants'
import NotFound from 'components/NotFound'

class CombatPanel extends React.Component {
   
    constructor() {
        super(...arguments)
    }

    generateTable(title, rows) {

        return (
            <table className="attack-table" border="0" cellSpacing="0" cellPadding="0">
                <thead><tr><th colSpan="100">{title}</th></tr></thead>
                <tbody>
                    {rows}
                </tbody>
            </table>);
    }

    generateAttackRow(attack, summary, quick) {
        if (!attack) {
            return null
        }

        let species = PokedexHelper.species(attack.type)
        let iconClass = 'icon-type-' + PokedexHelper.getSpeciesKey(species)
        let atkName = PokedexHelper.loc(attack)

        let tds = []
        if (!summary) {
            if (quick) {
                tds.push(<td align="right">{ attack.dpe }</td>);
            } else {
                tds.push(<td align="right">{ Math.abs(attack.energy) }</td>);
            }
        }

        tds.push(<td align="right">
            { attack.dps }
            {(summary ? (<sup>&nbsp;dps</sup>) : null)}
            </td>);
        
        return (
            <tr>
                <td><div className={ iconClass }></div></td>
                <td>{atkName}</td>
                {tds}
            </tr>
        )
    }

    generateSummaryTable(attacks) {
        let rows = [
            this.generateAttackRow(attacks.fast[0], true),
            this.generateAttackRow(attacks.charged[0], true)
        ]

        return (
            this.generateTable('Meilleurs attaques', rows, true)
        )
    }

    generateSection(title, quick) {
        return (
            <tr>
                <td className="section" colSpan="2">{title}</td>
                { quick ? <td className="section-td" align="right">EPS</td> :  <td className="section-td" align="right">Energie</td> }
                <td className="section-td" align="right">DPS</td>
            </tr>
        )
    }

    generateDetailsTable(attacks) {
        let rows = []

        rows.push(this.generateSection('Attaques rapides', true))
        attacks.fast.forEach(attack => {
            rows.push(this.generateAttackRow(attack, false))
        });

        rows.push(this.generateSection('Attaques Chargées'));
        attacks.charged.forEach(attack => {
            rows.push(this.generateAttackRow(attack, false))
        });

        return (
            this.generateTable('Toutes les attaques', rows)
        )
    }
    
    generateInfoTable(pokemon) {
        let rows = []
        rows.push(<tr><td colSpan="2" align="left">Maximum CP</td><td align="right">{ pokemon.cpmax }</td></tr>)
        rows.push(<tr><td colSpan="2" align="left">Bonbons par évolution</td><td align="right">{ pokemon.candy }</td></tr>)
        rows.push(<tr><td colSpan="2" align="left">Distance copain</td><td align="right">{ pokemon.buddy }</td></tr>)
        return this.generateTable("Statistiques", rows)
    }

    render() { 

        let pokemon = PokedexHelper.pokemon(this.props.id)
        let attacks = PokedexHelper.getAttacks(this.props.id)
        let elements = []
        elements.push(this.generateInfoTable(pokemon))
        if (attacks.fast.length && attacks.charged.length) {
            elements.push(this.generateSummaryTable(attacks))
            elements.push(this.generateDetailsTable(attacks))
        }

        return elements
    }
}

export default CombatPanel
