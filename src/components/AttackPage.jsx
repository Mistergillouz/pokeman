/* eslint-disable no-case-declarations */
import React from 'react'

import BackButton from './BackButton'
import TypeFilter from './TypeFilter'
import PokemanPage from './PokemanPage'
import FontIcon from './FontIcon'
import PokedexHelper from '../data/PokedexHelper'
import SmallPokemon from './SmallPokemon'

import './css/attackpage.less'

export default class AttackPage extends PokemanPage {
   
    constructor() {
        super('Attaques', arguments)

        const searchParams = new URLSearchParams(this.props.location.search)
        const typeId = parseInt(searchParams.get('type'))
        const attackId = parseInt(searchParams.get('attack'))
        
        Object.assign(this.state, { 
            typeId,
            attackId,
            viewMode: ViewMode.DEFAULT,
            types: [],
            searchText: null
        })
    }

    onAttackPressed(attack) {
        this.setState({ viewMode: ViewMode.ZOOM, attack, prevMode: this.state.viewMode })
    }

    onLeaveZoom() {
        this.setState({ viewMode: this.state.prevMode })
    }

    onTypeClicked(list) {
        this.setState({ types: list })
    }

    onFilterTextChanged (e) {
        clearTimeout(this._timeout)
        const searchText = e.target.value
        this._timeout = setTimeout(() => this.setState({ searchText }), 250)
    }
    
    onActivateSearch (active) {
        this.setState({ viewMode: active ? ViewMode.SEARCH : ViewMode.DEFAULT })
        this._focusInput = true
    }

    componentDidUpdate() {
        if (this.refs.search) {
            setTimeout(() => this.refs.search.focus(), 0)
        }
    }
    
    getEnergyCode(energy, key) {
        if (energy > 0) {
            return (
                <div>
                    <i className="fas fa-plus-square attack-page-energy-plus"/>
                    <span className='attack-page-energy-plus-value'>{ energy }</span>
                </div>
            )
        }

        let percent = 0
        switch (Math.abs(energy)) {
            case 50: percent = 50; break
            case 33: percent = 33; break
            default:
                percent = 100
        }
        
        return <div className={ 'attack-page-attack-nrg' + percent + ' POKEMON_TYPE_' + key }></div>
    }

    generateAttackTile(attack) {
        const species = PokedexHelper.getSpecies(attack.type)
        const key = PokedexHelper.getSpeciesKey(species)
        
        return (
            <div className='attack-page-attack' onClick={() => this.onAttackPressed(attack) }>
                <div className='attack-page-attack-desc'>
                    <div className={ 'attack-page-attack-icon icon-type-' + key }/>
                    <span className='attack-page-attack-name'>{ PokedexHelper.loc(attack) }</span>
                </div>
                <table>
                    <tr>
                        <th>Dégât</th>
                        <th>Durée</th>
                        <th>Energie</th>
                    </tr>
                    <tr>
                        <td>{ attack.dmg }</td>
                        <td>{ attack.duration + 's' }</td>
                        <td>{ this.getEnergyCode(attack.energy, key) }</td>
                    </tr>
                </table>
            </div>
        )
    }

    generateAttackTiles() {
        const attacks = PokedexHelper.searchAttacks(this.state.types, this.state.searchText)
        const parts = Object.keys(attacks).map(id => this.generateAttackTile(attacks[id]))
        return parts
    }

    generateZoom(attack) {
        const parts = []
        
        parts.push(
            <div className='attack-page-selected-attack'>
                { this.generateAttackTile(attack) }
            </div>
        )

        parts.push(
            <div className="attack-page-pokemons">
                { attack.pokemons.map(pokemon => <SmallPokemon id={ pokemon.id }/>) }
            </div>
        )

        return parts

    }

    render() { 

        let showFilters = true
        const parts = []
        switch (this.state.viewMode) {

            case ViewMode.ZOOM:
                parts.push(
                    <div className="navbar">
                        <div className="left-panel">
                            <FontIcon x2 icon={ BackButton.defaultIcon } onClick={ () => this.onLeaveZoom() }/>
                        </div>
                        <sup className='centered-text'>{ this.getPageCaption() }</sup>
                    </div>
                )

                parts.push(...this.generateZoom(this.state.attack))
                showFilters = false
                break

            case ViewMode.SEARCH:

                const styles = { width: '100%' }
                parts.push(
                    <div className="navbar">
                        <div className="left-panel" style={ styles }>
                            <FontIcon icon="fa fa-arrow-left" onClick= {() => this.onActivateSearch(false) }/>
                            <input key="search-input" type="search" ref="search" className="search-input ui-styles" 
                                placeholder="Rechercher une attaque"  onChange={ e => this.onFilterTextChanged(e) }/>
                        </div>
                    </div>
                )
                break

            case ViewMode.DEFAULT:

                parts.push(
                    <div className="attack-page-container">
                        <div className="navbar">
                            <div className="left-panel">
                                <BackButton/>
                            </div>
                            <sup className='centered-text'>{ this.getPageCaption() }</sup>
                            <div className="right-panel">
                                <i className="fa fa-search fa-lg search-icon" aria-hidden="true" onClick={ () => this.onActivateSearch(true) }></i>
                            </div>
                        </div>
                    </div>
                )
                break
        }

        if (showFilters) {
            parts.push(
                <div>
                    <TypeFilter isMono={ true } onTypeClicked={(list) => this.onTypeClicked(list)}/>
                    <div className='attack-page-list'>
                        { this.generateAttackTiles() }
                    </div>
                </div>
            )
        }

        parts.push(
            <div>
                { super.render() }     
            </div>
        )

        return parts

    }
}

const ViewMode = { DEFAULT: 0, SEARCH: 1, ZOOM: 2 }
