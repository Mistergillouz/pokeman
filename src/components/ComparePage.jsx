import React from 'react'
import { Redirect } from 'react-router-dom'

import PokedexHelper from 'data/PokedexHelper'
import Constants from 'data/Constants'
import SortTable from 'components/SortTable'
import BackButton from 'components/BackButton'

class ComparePage extends React.Component {
   
    constructor() {
        super(...arguments)

        this.state = {}
        let params = new URLSearchParams(this.props.location.search)
        if (params.has('ids')) {
            this.ids = params.get('ids').split(',')
        }
    }

    getColumnName(rowIndex) {
        let pokemonId = this.ids[rowIndex]
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
        return this.ids.map(pokemonId => {
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
        let pokemonId = this.ids[rowIndex]
        this.setState({ redirect: true, to: '/pokemon/' + pokemonId })
    }
    
    render() { 

        if (!this.ids) {
            return null
        }

        if (this.state.redirect) {
            return <Redirect push to={ this.state.to }/>
        }

        return <div className="page">
            <div className="navbar">
                <div className="left-panel">
                    <BackButton/>
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