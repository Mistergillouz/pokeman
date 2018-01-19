import React from 'react'
import { Redirect } from 'react-router-dom'

import PokemanPage from 'components/PokemanPage'
import PokemanLink from 'components/PokemanLink'
import PokemonList from 'components/PokemonList'
import FilterPanel from 'components/FilterPanel'
import Hamburger from 'components/Hamburger'
import EvolutionPage from 'components/EvolutionPage';
import PokedexHelper from 'data/PokedexHelper'
import Constants from 'data/Constants'
import Store from 'data/Store'


class MainPage extends PokemanPage {
   
    constructor() {
        super(...arguments)

        let storage = getStorageData()
        let country = storage.loc || 'fr'
        PokedexHelper.setLocaleCountry(country)

        this.state = {
            visible: true,
            country: country,
            filterVisible: false,
            searchEnabled: false,
            tooltipTypeId: -1,
            selected: Store.get('selected', []),
            searchSettings: { 
                text: '', 
                genId: null,
                types: [] 
            }
        }
        
        this.pokemons = []
        for (let i = 1; i < 151; i++) {
            this.pokemons.push(i);
        }
    }

    eventHandler(args) {

        switch (args.eventType) {
            case Constants.EVENT.PokemonClicked:
                if (this.state.selected.length) {
                    this.toggleSelected(args.id)
                } else {
                    this.setState({ redirect: true, push: true, to: '/pokemon/' +  args.id })
                }
                break

            case Constants.EVENT.PokemonSelected:
                this.toggleSelected(args.id)
                break;
        }
    }

    onToggleFilterPanel() {
        this.refs.filterToggle.classList.toggle('filter-toggle-off')
        this.setState({ filterVisible: !this.state.filterVisible });
    } 

    onLocaleSelected(country) {
        PokedexHelper.setLocaleCountry(country);
        this.setState({ country: country });

        let data = getStorageData()
        data.loc = country
        setStorageData(data)
    }

    onFilterTextChanged(event) {
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
            this.pokemons = PokedexHelper.search(searchSettings);
            this.setState({ searchSettings: searchSettings });
        }
    }

    componentDidUpdate() {
        if (this.refs.search) {
            this.refs.search.value = this.state.searchSettings.text
        }
    }

    toggleSelected(id) {
        let selected;
        switch (id) {
            case Constants.SELECT.UNSELECT_ALL:
                selected = []
                break;
            case Constants.SELECT.SELECT_ALL:
                selected = this.pokemons.slice()
                break;
            default:
                selected = this.state.selected.slice()
                let index = selected.indexOf(id)
                if (index === -1) {
                    selected.push(id)
                } else {
                    selected.splice(index, 1)
                }
        }

        this.setState({ selected: selected })
        Store.set('selected', selected)
    }

    onActivateSearch (active) {
        this.setState({ searchEnabled: active })
        this.setInputFocus = active

    }

    generateToolbar() {
        let compareButtonClass = this.state.selected.length < 2 ? 'hidden' : ''
        if (this.state.searchEnabled) {

            return (
                <div className="left-panel">
                    <div className="back-button-2" onClick= {() => this.onActivateSearch(false) }></div>
                    <div key="filter-toggle" className="filter-toggle" ref="filterToggle" onClick={ (e) => this.onToggleFilterPanel(e) }></div>
                    <input key="search-input" type="search" ref="search" className="search-input ui-styles" 
                        placeholder="Rechercher un Pokémon"  onChange={ e => this.onFilterTextChanged(e) }/>
                </div>
            )

        } else {

            return (
                <div>
                    <Hamburger eventHandler={ args => this.eventHandler(args) }/>
                    <div className="left-panel">
                        <div key="filter-toggle" className="filter-toggle" ref="filterToggle" onClick={ (e) => this.onToggleFilterPanel(e) }></div>
                        <PokemanLink to={{ pathname: '/compare', search: '?ids=' + this.state.selected.join(',') }}>
                            <div className={ 'compare-button ' + compareButtonClass }></div>
                        </PokemanLink>
                        <span className="pokeman-title">Pokéman</span>
                        <div className="search-icon" onClick={ () => this.onActivateSearch(true) }/>
                    </div>
                </div>
            )
        }
    }

    componentDidUpdate() {
        if (this.state.searchEnabled && this.setInputFocus) {
            this.setInputFocus = false
            setTimeout(() => this.refs.search.focus(), 0)
        }
    }

    render() { 

        if (this.state.redirect) {
            return <Redirect push={ this.state.push } to={ this.state.to }/>
        }

        let compareButtonClass = this.state.selected.length < 2 ? 'hidden' : ''
        return (
            <div className="page" data-content-id="tiles-container">
                <div className="navbar">
                    { this.generateToolbar() }
                </div> 

                <FilterPanel 
                    visible={ this.state.filterVisible } 
                    notifyChange={ this.onFilterChangeListener.bind(this) }/>
                <PokemonList
                    pokemons={ this.pokemons } 
                    selected={ this.state.selected }
                    eventHandler={ args => this.eventHandler(args) }/>

                { super.render() }
                
            </div>
        )
    }
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
