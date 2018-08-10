import React from 'react'
import { Redirect } from 'react-router-dom'

import PokemanPage from './PokemanPage';
import Constants from '../data/Constants'
import PokedexHelper from '../data/PokedexHelper'
import CombatPanel from './CombatPanel'
import SmallPokemon from './SmallPokemon'
import EvolutionPanel from './EvolutionPanel'
import BackButton from './BackButton'
import FontIcon from './FontIcon'
import PokemanLink from './PokemanLink';

export default class ZoomPage extends PokemanPage {

    constructor() {
        super(null, arguments)

        let params = new URLSearchParams(this.props.location.search)
        this.state = {
            showShiny: params.get('shiny') === 'true'
        }
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
                        <BackButton/>
                        <sup className='title-text'>{ label }</sup>
                    </div>
                </div>
                <div className="pokemon-zoom">
                    <EvolutionPanel id={ id } evolves={ evolves }/>
                    <CombatPanel id={ id } showShiny={ this.state.showShiny } eventHandler={ this.props.eventHandler }/>
                </div>
                { super.render() }
		    </div>
        )
    }
}


