import React from 'react'
import { Redirect } from 'react-router-dom'

import PokedexHelper from '../data/PokedexHelper'
import PokemanPage from './PokemanPage'
import BackButton from './BackButton'
import SmallPokemon from './SmallPokemon'
import Utils from '../data/Utils'
import Constants from '../data/Constants'

import './css/shinypage.css'

export default class FormsPage extends PokemanPage {
   
    constructor () {
        super('Shinies', arguments)

        const gens = []
        for (let i = 0; i < Constants.CURRENT_GEN; i++) {
            gens.push(i + 1)
        }
        
        Object.assign(this.state, {
            selectedGens: gens,
            rarity: false
        })
    }

    render () { 

        if (this.state.redirect) {
            return <Redirect push to={ this.state.to }/>
        }
        
        const genButtons = Utils.generateGenButtons(this.state.selectedGens, this.onGenClicked.bind(this), Constants.CURRENT_GEN)

        return <div className="shiny-page">
            <div className="navbar">
                <div className="left-panel">
                    <BackButton/>
                </div>
                <sup className='centered-text'>{ this.getPageCaption() }</sup>
            </div>

            <div className="shiny-filters">
                <span>Génération(s)</span>
                <div className="shiny-filters-gens">
                    { genButtons }
                </div>
            </div>

            <div className="shiny-container">
                { this.generateForms() }
            </div>

            { super.render() }
        </div>
    }

    generateForms () {
        const shinies = PokedexHelper.getShinies().filter(pokemonId => this.state.selectedGens.indexOf(PokedexHelper.getPokemon(pokemonId).gen) !== -1)
        return shinies.map(pokemonId => <SmallPokemon id={ pokemonId } shiny={ true } onClick={ () => this.onPokemonClicked(pokemonId) }/>)
    }

    onPokemonClicked (pokemonId) {
        this.setState({ redirect: true, to: '/pokemon/' + pokemonId + '?shiny=true' })
    }

    onGenClicked (gen) {
        this.setState({ selectedGens: Utils.toggle(this.state.selectedGens, gen, false) })
    }
}
