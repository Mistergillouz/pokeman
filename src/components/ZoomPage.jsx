import React from 'react'
import { Link } from 'react-router-dom'

import PokemanPage from './PokemanPage';
import Constants from 'data/Constants'
import PokedexHelper from 'data/PokedexHelper'
import CombatPanel from 'components/CombatPanel'
import SmallPokemon from 'components/SmallPokemon'
import EvolutionPanel from 'components/EvolutionPanel'
import BackButton from 'components/BackButton'

export default class ZoomPage extends PokemanPage {

    constructor(args) {
        super(args)

        Object.assign(this.state, {
            highlightedId: this.props.match.params.id
        })
    }
    
    onPokemonClicked(pokemonId) {
        this.setState({ highlightedId: pokemonId })
    }

    selectedId() {
        return Number(this.state.highlightedId)
    }

    render() { 

        let id = this.props.match.params.id
        let label = PokedexHelper.getPokemonName(id)
        let evolves = PokedexHelper.getEvolvesList(id)

        return (

            <div className="page">
                <div className="navbar">
                    <div className="left-panel">
                        <BackButton/>
                        <sup className='title-text'>{ label }</sup>
                    </div>
                </div>
                <div className="pokemon-zoom">
                    <EvolutionPanel id={ this.selectedId() } evolves={ evolves } onClick={ id => this.onPokemonClicked(id) }/>
                    <CombatPanel id={ this.selectedId() } eventHandler={ this.props.eventHandler }/>
                </div>
		    </div>
        )
    }
}


