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
                <td align="left">{atkName}</td>
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
            this.generateTable('Meilleures attaques', rows, true)
        )
    }

    generateSection(title, quick) {
        return (
            <tr>
                <td className="section" align="left" colSpan="2">{title}</td>
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
        
        if (!isNaN(pokemon.candy)) {
            rows.push(<tr><td colSpan="2" align="left">Bonbons par évolution</td><td align="right">{ pokemon.candy }</td></tr>)
        }
        rows.push(<tr><td colSpan="2" align="left">Distance copain</td><td align="right">{ pokemon.buddy }</td></tr>)
        return this.generateTable("Informations", rows)
    }

    generateTypesTable(species) {
        let rows = species.map(id => {
            let species = PokedexHelper.species(id)
            return <div className={ 'icon-type-' + PokedexHelper.getSpeciesKey(species) }/>
        })

        return (
            <div className='info-types-table'>{ rows }</div>
        )
    }

    render() { 

        let pokemon = PokedexHelper.pokemon(this.props.id)

        if (pokemon.gen < 4) {
            let typesTable = this.generateTypesTable(pokemon.species)
            let species = PokedexHelper.species(pokemon.species[0])
            let typeKey = PokedexHelper.getSpeciesKey(species)
            let attacks = PokedexHelper.getAttacks(this.props.id)
            let styles = {
                backgroundImage: 'url(https://www.serebii.net/art/th/' + this.props.id + '.png)'
            }

            return (
                <div className={ 'info-container info-back-' + typeKey }>
                    <div className='info-cp-label'>PC<span className='info-cp-value'>{ pokemon.gen < 4 ? pokemon.cpmax : '???' }</span></div>
                    <div className='info-cp-circle'>
                        <div className='info-pokemon-img' style={ styles }/>
                    </div>
                    <div className="info-pokemon-details">
                        <span className='info-pokemon-name'>{ PokedexHelper.loc(pokemon) }</span>
                        { typesTable }
                        { this.generateSummaryTable(attacks) }
                        { this.generateDetailsTable(attacks) }
                        { this.generateInfoTable(pokemon) }
                        <div className='close-button' onClick={() => this.props.onClose() }/>
                    </div>
                </div>
            )
        } else {
            return <NotFound text="Désolé. Seules les informations sur les pokémons existants dans Pokemon-Go sont disponibles"/>
        }
    }
}

export default CombatPanel