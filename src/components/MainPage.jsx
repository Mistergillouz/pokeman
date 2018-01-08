import React from 'react'
import PokemonList from 'components/PokemonList'
import PokedexHelper from 'data/PokedexHelper'
import FilterPanel from 'components/FilterPanel'
import Hamburger from 'components/Hamburger'
import Constants from 'data/Constants'
import Store from 'data/Store'


class MainPage extends React.Component {
   
    constructor() {
        super(...arguments)

        let storage = getStorageData()
        let country = storage.loc || 'fr'
        PokedexHelper.setLocaleCountry(country)

        this.state = {
            visible: true,
            country: country,
            filterVisible: false,
            
            tooltipTypeId: -1,
            selected: Store.get('selected', []),
            searchSettings: { 
                text: '', 
                genId: null,
                types: [] 
            }
        }
        
        this.tooltip = { x: 0, y: 0};
        
        this.pokemons = []
        for (let i = 1; i < 151; i++) {
            this.pokemons.push(i);
        }
    }

    eventHandler(args) {

        switch (args.eventType) {

            case Constants.EVENT.LocaleSelected:
                this.onLocaleSelected(args.country);
                break;

            case Constants.EVENT.PokemonSelected:
                this.toggleSelected(args.id)
                break;

            case Constants.EVENT.PokemonClicked:
                if (this.state.selected.length) {
                    this.toggleSelected(args.id)
                    break;
                }

                // Fall thru

            default:
                this.props.eventHandler(args)
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

    onCompare() {
        this.props.eventHandler({ 
            eventType: Constants.EVENT.ComparePage,
            pokemons: this.state.selected
        })
    }

    toggleSelected(id) {
        let selected;
        if (id !== -1) {
            selected = this.state.selected.slice()
            let index = selected.indexOf(id)
            if (index === -1) {
                selected.push(id)
            } else {
                selected.splice(index, 1)
            }
        } else {
            selected = []
        }
        this.setState({ selected: selected })
        Store.set('selected', selected)
    }

    render() { 

        if (!this.props.visible) {
            return null;
        }

        let compareButtonClass = this.state.selected.length < 2 ? 'hidden' : ''
        return (
            <div className="page" data-content-id="tiles-container">
                <div className="navbar">

                    <Hamburger eventHandler={ args => this.eventHandler(args) }/>

                    <div className="left-panel">
                        <div key="filter-toggle" className="filter-toggle" ref="filterToggle" onClick={ (e) => this.onToggleFilterPanel(e) }></div>
                        <div className={ 'compare-button ' + compareButtonClass } onClick={ () => this.onCompare() }></div>
                        <input key="search-input" type="text" ref="search"
                            className="search-input ui-styles" 
                            placeholder="Rechercher un Pokémon" 
                            onChange={ e => this.onFilterTextChanged(e) }>
                        </input>
                    </div>

                    
                </div> 

                <FilterPanel 
                    visible={ this.state.filterVisible } 
                    notifyChange={ this.onFilterChangeListener.bind(this) }/>
                <PokemonList
                    pokemons={ this.pokemons } 
                    selected={ this.state.selected }
                    eventHandler={ args => this.eventHandler(args) }/>
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
