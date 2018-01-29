import React from 'react'

import PokedexHelper from '../data/PokedexHelper'
import Constants from '../data/Constants'
import SmallPokemon from './SmallPokemon';
import BackButton from './BackButton'
import PokemanLink from './PokemanLink'
import PokemanPage from './PokemanPage'

import './css/babies.css'

export default class BabiesPage extends PokemanPage {
   
    constructor() {
        super('Maternelle', arguments)
    }

    render() { 

        let rows = null
        return (
            <div className="baby-container">
                <div className="navbar">
                    <div className="left-panel">
                        <BackButton/>
                        <sup className='title-text'>{ this.getPageCaption() }</sup>
                    </div>
                </div>

                <div className="baby-results">
                    { PokedexHelper.getBabies().map(pokemonId => {
                        return (
                            <PokemanLink to={ '/pokemon/' + pokemonId }>
                                <SmallPokemon id={ pokemonId } showGen='true'/>
                            </PokemanLink>
                        )
                    })}
                </div>

                { super.render() }
                
            </div>
        )
    }
}
