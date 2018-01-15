import React from 'react'
import PokemanPage from './PokemanPage';
import Constants from 'data/Constants'
import PokedexHelper from 'data/PokedexHelper'
import CombatPanel from 'components/CombatPanel'
import SmallPokemon from 'components/SmallPokemon'
import EvolutionPanel from 'components/EvolutionPanel'

export default class ZoomPage extends PokemanPage {

    componentWillReceiveProps(nextProps) {
        if (nextProps.args) {
            this.setState({ highlightedId: nextProps.args.id })
        }
    }
    
    onPokemonClicked(pokemonId) {
        this.setState({ highlightedId: pokemonId })
    }

    selectedId() {
        return Number(this.state.highlightedId)
    }

    render() { 

        if (!this.props.visible) {
            return null;
        }

        let label = PokedexHelper.getPokemonName(this.props.args.id)
        let evolves = PokedexHelper.getEvolvesList(this.props.args.id)

        return (

            <div className="page">
                <div className="navbar">
                    <div className="left-panel">
                        <button className="back-button" onClick= {() => this.onBack() }></button>
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


