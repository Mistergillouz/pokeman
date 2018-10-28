/* eslint-disable no-case-declarations */
import React from 'react'

import BackButton from './BackButton'
import TypeFilter from './TypeFilter'
import PokemanPage from './PokemanPage'
import FontIcon from './FontIcon'
import PokedexHelper from '../data/PokedexHelper'

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

    generateAttackTiles() {
        const attacks = PokedexHelper.searchAttacks(this.state.types, this.state.searchText)
        const parts = Object.keys(attacks).map(id => {
            const attack = PokedexHelper.getAttack(id)
            const species = PokedexHelper.getSpecies(attack.type)
            const key = PokedexHelper.getSpeciesKey(species)
            
            return (
                <div className='attack-page-attack'>
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
        })

        return parts
    }

    render() { 

        const parts = []
        switch (this.state.viewMode) {
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

        parts.push(
            <div>
                <div className="attack-page-switch-div">
                </div>
                <TypeFilter isMono={ true } onTypeClicked={(list) => this.onTypeClicked(list)}/>
                <div className='attack-page-list'>
                    { this.generateAttackTiles() }
                </div>

                { super.render() }     
            </div>
        )

        return parts

    }
}

const ViewMode = { DEFAULT: 0, SEARCH: 1 }
