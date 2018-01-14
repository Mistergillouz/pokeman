import React from 'react'
import PokedexHelper from 'data/PokedexHelper'
import Constants from 'data/Constants'
import SortTable from 'components/SortTable'

class ComparePage extends React.Component {
   
    constructor() {
        super(...arguments)
    }

    onBack() {
        this.props.eventHandler({ eventType: Constants.EVENT.Back })
    }

    getColumnName(rowIndex) {
        let pokemonId = this.props.pokemons[rowIndex]
        let pokemon = PokedexHelper.getPokemon(pokemonId)
        let name = PokedexHelper.loc(pokemon)
        let typeIcons = pokemon.species.map(specie => {
            let type = PokedexHelper.getSpecies(specie)
            let key = PokedexHelper.getSpeciesKey(type)   
            return <div className={ 'icon-type-' + key + ' icon-type-small'}/> 
        });
        return (
            <div className='compare-col-0'>
                { name }
                <div className='compare-col-0'>
                    { typeIcons }
                </div>
            </div>
        )
    }

    getColumns() {

        return [
            { text: 'Pokemon', align: 'left', callback: row => this.getColumnName(row) },
            { text: 'PC', default: true, type: 'number' },
            { text: 'ATK', type: 'number' },
            { text: 'DEF', type: 'number' },
            { text: 'RES', type: 'number' }
        ]
    }

    getDatas() {
        return this.props.pokemons.map(pokemonId => {
            let pokemon = PokedexHelper.getPokemon(pokemonId)
            return [
                PokedexHelper.loc(pokemon),
                pokemon.cpmax,
                pokemon.atk,
                pokemon.def,
                pokemon.sta
            ]
        })
    }

    onCellClicked(rowIndex) {
        this.props.eventHandler({ eventType: Constants.EVENT.PokemonClicked, id: this.props.pokemons[rowIndex] })
    }
    
    render() { 
        if (!this.props.visible) {
            return null
        }

        return <div className="page">
            <div className="navbar">
                <div className="left-panel">
                    <button className="back-button" onClick= {() => this.onBack() }></button>
                    <sup className='title-text'>Comparaisons</sup>
                </div>
            </div>
            <div className="compare-container">
                <SortTable columns={ this.getColumns() } datas={ this.getDatas() } onCellClicked={ (row, col) => this.onCellClicked(row, col) }/>
            </div>
        </div>
    }
}

export default ComparePage