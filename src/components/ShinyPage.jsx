import React from 'react'
import { Redirect } from 'react-router-dom'

import PokedexHelper from '../data/PokedexHelper'
import PokemanPage from './PokemanPage'
import BackButton from './BackButton'
import SmallPokemon from './SmallPokemon'

import './css/shinypage.css'

export default class FormsPage extends PokemanPage {
   
    constructor () {
        super('Shinies', arguments)
        this.state = {}
    }

    render () { 

        if (this.state.redirect) {
            return <Redirect push to={ this.state.to }/>
        }

        return <div className="shiny-page">
            <div className="navbar">
                <div className="left-panel">
                    <BackButton/>
                    <sup className='title-text'>{ this.getPageCaption() }</sup>
                </div>
            </div>
            <div className="shiny-container">
                { this.generateForms() }
            </div>

            { super.render() }
        </div>
    }

    generateForms () {
        const shinies = PokedexHelper.getShinies()
        return shinies.map(pokemonId => <SmallPokemon id={ pokemonId } shiny={ true } onClick={ () => this.onPokemonClicked(pokemonId) }/>)
    }

    onPokemonClicked (pokemonId) {
        this.setState({ redirect: true, to: '/pokemon/' + pokemonId + '?shiny=true' })
    }
}
