import React from 'react'
import PokemanLink from './PokemanLink'
import PokedexHelper from '../data/PokedexHelper'
import Constants from '../data/Constants'
import NotFound from './NotFound'
import BackButton from './BackButton'
import FontIcon from './FontIcon'
import RankingPage from './RankingPage'

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

        let species = PokedexHelper.getSpecies(attack.type)
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
        for (let attack of attacks.fast) {
            rows.push(this.generateAttackRow(attack, false))
        }

        rows.push(this.generateSection('Attaques Chargées'));
        for (let attack of attacks.charged) {
            rows.push(this.generateAttackRow(attack, false))
        }

        return (
            this.generateTable('Toutes les attaques', rows)
        )
    }
    
    generateInfoTable(pokemon) {
        let rows = []
        
        if (pokemon.candy) {
            rows.push(<tr><td colSpan="2" align="left">Bonbons par évolution</td><td align="right">{ pokemon.candy }</td></tr>)
        }
        rows.push(<tr><td colSpan="2" align="left">Distance copain</td><td align="right">{ pokemon.buddy }</td></tr>)

        if (pokemon.gender.m && pokemon.gender.f) {
            rows.push(<tr><td colSpan="2" align="left">Male</td><td align="right">{ (pokemon.gender.m * 100) + '%' }</td></tr>)
            rows.push(<tr><td colSpan="2" align="left">Femelle</td><td align="right">{ (pokemon.gender.f * 100) + '%' }</td></tr>)
        }

        return this.generateTable("Informations", rows)
    }

    generateTypesTable(species) {
        let rows = species.map(id => {
            let species = PokedexHelper.getSpecies(id)
            return <div className={ 'icon-type-' + PokedexHelper.getSpeciesKey(species) }/>
        })

        return (
            <div className='info-types-table'>{ rows }</div>
        )
    }

    generateFormInfos(pokemon) {
        if (!pokemon.form) {
            return null
        }

        return <span className='info-pokemon-form-name'>{ 'Forme ' + PokedexHelper.loc(pokemon.form) }</span>
    }
    render() { 

        let pokemon = PokedexHelper.getPokemon(this.props.id)
        
        if (pokemon.gen > Constants.CURRENT_GEN) {
            return <NotFound text="Désolé. Seules les informations sur les pokémons existants dans Pokemon-Go sont disponibles"/>
        }
        
        let rankings = PokedexHelper.getRankings(this.props.id)
        let typesTable = this.generateTypesTable(pokemon.species)
        let species = PokedexHelper.getSpecies(pokemon.species[0])
        let typeKey = PokedexHelper.getSpeciesKey(species)
        let attacks = PokedexHelper.getAttacks(this.props.id)
        let styles = {
            backgroundImage: 'url(../assets/pokemons/' + this.props.id + '.png)'
        }

        return (
            <div className={ 'info-container info-back-' + typeKey }>
                <div className='info-cp-label'>PC<span className='info-cp-value'>{ pokemon.cpmax }</span></div>
                <div className='info-cp-circle'>
                    <div className='info-pokemon-img' style={ styles }/>
                </div>
                <div className="info-pokemon-details">
                    <div className="info-pokemon-name-container">
                        <span className='info-pokemon-name'>{ PokedexHelper.loc(pokemon) }</span>
                        { this.generateFormInfos(pokemon) }
                    </div>
                    { typesTable }
                    { this.generateSummaryTable(attacks) }
                    { this.generateDetailsTable(attacks) }
                    { this.generateInfoTable(pokemon) }
                    <BackButton image='close-button'/>
                </div>
                <div className="info-cp-button-container">
                    <PokemanLink to={ '/pokemon/' + this.props.id + '/calc' }> 
                        <div className="info-cp-button info-cp-button-calc"/>
                    </PokemanLink>
                    <PokemanLink to={ '/pokemon/' + this.props.id + '/resist' }> 
                        <div className="info-cp-button info-cp-button-shield"/>
                    </PokemanLink>
                    <PokemanLink to={ '/pokemon/' + this.props.id + '/ranking'}>
                        <FontIcon icon="fa-line-chart" className="info-cp-button"/>
                    </PokemanLink>
                    
                </div>
            </div>
        )
    }
}

export default CombatPanel