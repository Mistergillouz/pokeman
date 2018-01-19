import React from 'react'

import PokedexHelper from 'data/PokedexHelper'
import Constants from 'data/Constants'
import SmallPokemon from './SmallPokemon';
import BackButton from './BackButton'

import './css/babies.css'

export default class BabiesPage extends React.Component {
   
    render() { 

        let rows = null
        return (
            <div className="baby-container">
                <div className="navbar">
                    <div className="left-panel">
                        <BackButton/>
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
