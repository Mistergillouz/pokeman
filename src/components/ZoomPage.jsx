import React from 'react'
import { Redirect } from 'react-router-dom'

import PokemanPage from './PokemanPage';
import Constants from 'data/Constants'
import PokedexHelper from 'data/PokedexHelper'
import CombatPanel from 'components/CombatPanel'
import SmallPokemon from 'components/SmallPokemon'
import EvolutionPanel from 'components/EvolutionPanel'
import BackButton from 'components/BackButton'
import PokemanLink from './PokemanLink';

export default class ZoomPage extends PokemanPage {

    constructor() {
        super(null, arguments)
    }
    
    render() { 

        let id = Number(this.props.match.params.id)
        let evolves = PokedexHelper.getEvolvesList(id)
        
        let label = PokedexHelper.getPokemonName(id)
        this.setPageCaption(label)


        return (

            <div className="page">
                <div className="navbar">
                    <div className="left-panel">
                        <PokemanLink to='/'>
                            <div className="back-button"/>
                        </PokemanLink>
                        <sup className='title-text'>{ label }</sup>
                    </div>
                </div>
                <div className="pokemon-zoom">
                    <EvolutionPanel id={ id } evolves={ evolves }/>
                    <CombatPanel id={ id } eventHandler={ this.props.eventHandler }/>
                </div>
                { super.render() }
		    </div>
        )
    }
}


