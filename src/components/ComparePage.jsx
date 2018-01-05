import React from 'react'
import PokedexHelper from 'data/PokedexHelper'
import Constants from 'data/Constants'
import SortTable from 'components/SortTable'

class ComparePage extends React.Component {
   
    constructor() {
        super(...arguments)
    }

    generatePage() {
        return (
            null
        )
    }

    onBack() {
        this.props.eventHandler({ eventType: Constants.EVENT.Back })
    }

    getColumns() {

        return [
            { text: 'Nom' },
            { text: 'PC', align: 'right' },
            { text: 'ATK', align: 'right' },
            { text: 'DEF', align: 'right' },
            { text: 'RES', align: 'right' }
        ]
    }

    getDatas() {
        return this.props.pokemons.map(pokemonId => {
            let pokemon = PokedexHelper.getPokemon(pokemonId)
            return [
                PokedexHelper.loc(pokemon),
                _val(pokemon.cpmax),
                _val(pokemon.atk),
                _val(pokemon.def),
                _val(pokemon.sta)
            ]
        })
    }
    render() { 
        if (!this.props.visible) {
            return null
        }

        return <div className="page">
            <div className="navbar">
                <div className="left-panel">
                    <button className="back-button" onClick= {() => this.onBack() }></button>
                </div>
                <sup>Comparaisons</sup>
            </div>
            <div className="compare-container">
                <SortTable columns={ this.getColumns() } datas={ this.getDatas() }/>
            </div>
        </div>
    }
}

function _val(value) {
    return value !== undefined ? value : '-'
}

export default ComparePage