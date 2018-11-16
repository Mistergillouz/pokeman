/* eslint-disable no-case-declarations */
import React from 'react'
import { Redirect } from 'react-router-dom'

import PokemanPage from './PokemanPage'
import PokemanLink from './PokemanLink'
import PokemonList from './PokemonList'
import FilterPanel from './FilterPanel'
import Hamburger from './Hamburger'
import EvolutionPage from './EvolutionPage'
import FontIcon from './FontIcon'
import PokedexHelper from '../data/PokedexHelper'
import Constants from '../data/Constants'
import Store from '../data/Store'


class MainPage extends PokemanPage {
   
    constructor () {
        super(null, arguments)

        let storage = getStorageData()
        let country = storage.loc || 'fr'
        PokedexHelper.setLocaleCountry(country)

        let pokemons = []
        for (let i = 1; i < 151; i++) {
            pokemons.push(i);
        }

        this.state = Store.get('mainpage', {
            filterVisible: false,
            viewMode: ViewMode.DEFAULT,
            selected: [],
            searchSettings: { 
                text: '', 
                genId: null,
                types: [] 
            },
            pokemons: pokemons
        })
        
        
    }

    setState (state, ignore) {

        if (!ignore) {
            Store.set('mainpage', state)
        }
        
        super.setState(state)
    }

    eventHandler (args) {

        switch (args.eventType) {
            case Constants.EVENT.PokemonClicked:
                if (this.state.viewMode === ViewMode.SELECTIONS) {
                    this.toggleSelected(args.id)
                } else {
                    this.setState({ redirect: true, push: true, to: '/pokemon/' +  args.id }, true)
                }
                break

            case Constants.EVENT.PokemonSelected:
                this.toggleSelected(args.id)
                break;

            case Constants.EVENT.LocaleSelected:
                PokedexHelper.setLocaleCountry(args.country)
                this.forceUpdate()
                break
        }
    }

    onToggleFilterPanel () {
        this.setState({ filterVisible: !this.state.filterVisible });
    } 

    onFilterTextChanged () {
        if (this.filterTimerId) {
            clearTimeout(this.filterTimerId)
        }
        this.filterTimerId = setTimeout(() =>  this.applyFilter({ text: this.refs.search.value }), 750)
    }

    onFilterChangeListener(args) {
        this.applyFilter(args);
    }

    applyFilter(args) {
        if (args) {
            let searchSettings = Object.assign({}, this.state.searchSettings, args)
            let pokemons = PokedexHelper.search(searchSettings);
            this.setState({ searchSettings: searchSettings, pokemons: pokemons });
        }
    }

    componentDidUpdate() {
        if (this.refs.search) {
            this.refs.search.value = this.state.searchSettings.text
            if (this._focusInput) {
                delete this._focusInput
                setTimeout(() => this.refs.search.focus(), 0)
            }
        }
    }

    toggleSelected(id) {
        let selected, index;
        switch (id) {
            case Constants.SELECT.UNSELECT_ALL:
                selected = []
                break;
            case Constants.SELECT.SELECT_ALL:
                selected = this.state.pokemons.slice()
                break;
            default:
                selected = this.state.selected.slice()
                index = selected.indexOf(id)
                if (index === -1) {
                    selected.push(id)
                } else {
                    selected.splice(index, 1)
                }
        }

        let state = { selected: selected }
        if (this.state.selected.length === 0 && selected.length > 0) {
            state.viewMode = ViewMode.SELECTIONS
        } 

        this.setState(state)
    }

    onActivateSearch (active) {
        this.setState({ viewMode: active ? ViewMode.SEARCH : ViewMode.DEFAULT })
        this._focusInput = true
    }

    leaveSelection () {
        this.toggleSelected(Constants.SELECT.UNSELECT_ALL)
        this.setState({ viewMode: ViewMode.DEFAULT })
    }

    toggleSelectAll () {
        let id = (this.state.selected.length === this.state.pokemons.length) ? Constants.SELECT.UNSELECT_ALL : Constants.SELECT.SELECT_ALL
        this.toggleSelected(id)
    }

    generateToolbar () {

        switch (this.state.viewMode) {

            case ViewMode.SEARCH:

                const styles = { width: '100%' }
                return (
                    <div className="navbar">
                        <div className="left-panel" style={ styles }>
                            <FontIcon icon="fa fa-arrow-left" onClick= {() => this.onActivateSearch(false) }/>
                            <FontIcon icon="fa fa-filter" onClick={ (e) => this.onToggleFilterPanel(e) }/>
                            <input key="search-input" type="search" ref="search" className="search-input ui-styles" 
                                placeholder="Rechercher un Pokémon"  onChange={ e => this.onFilterTextChanged(e) }/>
                        </div>
                    </div>
                    
                )

            case ViewMode.SELECTIONS:

                let compareVisibility = this.state.selected.length < 2 ? 'hidden' : ''
                let selectIcon = (this.state.selected.length === this.state.pokemons.length) ? 'fa fa-check-circle text-selected' : 'far fa-circle'
        
                return (
                    <div className="navbar">
                        <div className="left-panel">
                            <FontIcon icon="fa fa-arrow-left" onClick={ () => this.leaveSelection() }/>
                            <span className="title-text">Selections</span>
                            <div className="toolbar-button-text-group" onClick={ () => this.toggleSelectAll() }>
                                <FontIcon icon={ selectIcon }/>
                                <span className="toolbar-button-text">Tout</span>
                            </div>
            
                            <PokemanLink to={{ pathname: '/compare', search: '?ids=' + this.state.selected.join(',') }}>
                                <div className={ 'toolbar-button-text-group ' + compareVisibility }>
                                    <div className='compare-button '></div>
                                    <span className="toolbar-button-text">Comparer</span>
                                </div>
                            </PokemanLink>
                        </div>
                    </div>
                )
       
            default:

                return (
                    <div className="navbar">
                        <div className="left-panel">
                            <Hamburger eventHandler={ args => this.eventHandler(args) }/>
                            <FontIcon icon="fa fa-filter" onClick={ (e) => this.onToggleFilterPanel(e) }/>
                        </div>
                        <span className="centered-text">Pokéman</span>
                        <i className="fa fa-search fa-lg search-icon" aria-hidden="true" onClick={ () => this.onActivateSearch(true) }></i>
                    </div>
                )
        }
    }

    render() { 

        if (this.state.redirect) {
            return <Redirect push={ this.state.push } to={ this.state.to }/>
        }

        let compareButtonClass = this.state.selected.length < 2 ? 'hidden' : ''
        return (
            <div className="page" data-content-id="tiles-container">
                { this.generateToolbar() }

                <FilterPanel
                    types={ this.state.searchSettings.types }
                    visible={ this.state.filterVisible } 
                    notifyChange={ this.onFilterChangeListener.bind(this) }/>
                <PokemonList
                    pokemons={ this.state.pokemons } 
                    selected={ this.state.selected }
                    eventHandler={ args => this.eventHandler(args) }/>

                { super.render() }
                
            </div>
        )
    }
}


const ViewMode = {
    DEFAULT: 0, SEARCH: 1, SELECTIONS: 2
}

function getStorageData() {
    if (window.localStorage) {
        let res = localStorage.getItem('pokeman')
        if (res) {
            return JSON.parse(res)
        }
    }

    return {}
}

function setStorageData(value) {
    if (window.localStorage) {
        localStorage.setItem('pokeman', JSON.stringify(value))
    }
}


export default MainPage
