import React from 'react'
import PokedexHelper from 'data/PokedexHelper'
import Constants from 'data/Constants'
import SmallPokemon from './SmallPokemon';
import '../../assets/styles/babies.css'

export default class BabiesPage extends React.Component {
   
    constructor() {
        super(...arguments)

        this.state = {}
    }

    onBack() {
        this.props.eventHandler({ eventType: Constants.EVENT.Back })
    }

    onPokemonClick(pokemonId) {
        this.props.eventHandler({
            eventType: Constants.EVENT.PokemonClicked,
            id: pokemonId
        })
    }

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
                    { PokedexHelper.getBabies().map(pokemonId => <SmallPokemon id={ pokemonId } onClick={ id => this.onPokemonClick(id) } showGen='true'/>) }
                </div>
            </div>
        )
    }
}
