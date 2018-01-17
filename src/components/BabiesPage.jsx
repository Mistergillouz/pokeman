import React from 'react'
import PokemanPage from './PokemanPage';
import PokedexHelper from 'data/PokedexHelper'
import Constants from 'data/Constants'
import SmallPokemon from './SmallPokemon';
import './css/babies.css'

export default class BabiesPage extends PokemanPage {
   
    render() { 

        if (!this.props.visible) {
            return null
        }

        let rows = null
        return (
            <div className="baby-container">
                <div className="navbar">
                    <div className="left-panel">
                        <button className="back-button" onClick= {() => this.onBack() }></button>
                        <sup className='title-text'>Maternelle</sup>
                    </div>
                </div>

                <div className="baby-results">
                    { PokedexHelper.getBabies().map(pokemonId => <SmallPokemon id={ pokemonId } onClick={ id => this.onPokemonSelected(id) } showGen='true'/>) }
                </div>
            </div>
        )
    }
}
