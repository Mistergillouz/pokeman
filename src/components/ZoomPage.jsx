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
            id: this.props.match.params.id
        })

        let params = new URLSearchParams(this.props.location.search)
        this.navigateBack = params.has('back')

    }
    
    onPokemonClicked(pokemonId) {
        this.setState({ id: pokemonId })
    }

    componentWillReceiveProps(newProps) {
        this.setState({ id: newProps.match.params.id })
    }

    render() { 

        let id = this.state.id
        let label = PokedexHelper.getPokemonName(id)
        let evolves = PokedexHelper.getEvolvesList(id)

        return (

            <div className="page">
                <div className="navbar">
                    <div className="left-panel">
                        <BackButton history={ this.navigateBack ? this.props.history : null }/>
                        <sup className='title-text'>{ label }</sup>
                    </div>
                </div>
                <div className="pokemon-zoom">
                    <EvolutionPanel id={ id } evolves={ evolves } onClick={ id => this.onPokemonClicked(id) }/>
                    <CombatPanel id={ id } eventHandler={ this.props.eventHandler }/>
                </div>
		    </div>
        )
    }
}


