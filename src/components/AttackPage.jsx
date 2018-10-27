import React from 'react'

import PokedexHelper from '../data/PokedexHelper'
import Constants from '../data/Constants'
import SmallPokemon from './SmallPokemon';
import BackButton from './BackButton'
import PokemanLink from './PokemanLink'
import PokemanPage from './PokemanPage'

import './css/attackpage.css'

export default class AttackPage extends PokemanPage {
   
    constructor() {
        super('Attaques', arguments)
    }

    render() { 

        return (
            <div className="attack-page-container">
                <div className="navbar">
                    <div className="left-panel">
                        <BackButton/>
                        <sup className='title-text'>{ this.getPageCaption() }</sup>
                    </div>
                </div>
                { super.render() }                
            </div>
        )
    }
}
