import React from 'react'
import PokemonList from 'components/PokemonList'
import PokedexHelper from 'data/PokedexHelper'
import LocaleFlag from 'components/LocaleFlag'
import LocalePopover from 'components/LocalePopover'
import FilterPanel from 'components/FilterPanel'
import Constants from 'data/Constants'

class MainPage extends React.Component {
   
    constructor() {
        super(...arguments)

        let storage = getStorageData()
        let country = storage.loc || 'fr'
        PokedexHelper.setLocaleCountry(country)

        this.state = {
            visible: true,
            country: country,
            localePopoverVisible: false,
            filterVisible: false,
            pokemons: [],

            tooltipTypeId: -1

        };

        this.searchSettings = { text: '', genId: null, types: [] };
        this.tooltip = { x: 0, y: 0};

        for (let i = 1; i < 151; i++) {
            this.state.pokemons.push(i);
        }
    }

    onToggleFilterPanel() {
        this.setState({ filterVisible: !this.state.filterVisible });
    } 

    onToggleLocalePopover() {
        this.setState({ localePopoverVisible: !this.state.localePopoverVisible })
    }

    onLocaleSelected(country) {
        PokedexHelper.setLocaleCountry(country);
        this.setState({ country: country });
        this.onToggleLocalePopover();

        let data = getStorageData()
        data.loc = country
        setStorageData(data)
    }

    onFilterTextChanged(event) {
        this.applyFilter({ text:  event.target.value });
    }

    onFilterChangeListener(args) {
        this.applyFilter(args);
    }

    applyFilter(args) {
        if (args) {
            Object.assign(this.searchSettings, args);
            let ids = PokedexHelper.search(this.searchSettings);
            this.setState({ pokemons: ids });
        }
    }

    onShowEggPanel() {
        this.props.eventHandler({ eventType: Constants.EVENT.EggPage })
    }

    render() { 

        if (!this.props.visible) {
            return null;
        }

        return (
            <div className="page" data-content-id="tiles-container">
                <div className="navbar">

                    <div className="left-panel">
                        <div className="filter-toggle" onClick={ (e) => this.onToggleFilterPanel(e) }></div>
                        <div className="egg-button" onClick={ (e) => this.onShowEggPanel(e) }></div>
                    </div>

                    <input type="search" 
                        className="search-input ui-styles" 
                        placeholder="Rechercher un Pokémon" 
                        onChange={(e) => this.onFilterTextChanged(e)}
                        value={ this.searchSettings.text }>
                    </input>
                    <div className="right-panel" onClick={ this.onToggleLocalePopover.bind(this) }>
                            <LocaleFlag country={this.state.country}/>
                            <img src="../assets/images/arrow-down.png"/>
                    </div>
                </div> 

                <FilterPanel visible={ this.state.filterVisible } notifyChange={ this.onFilterChangeListener.bind(this) }/>
                <LocalePopover show={this.state.localePopoverVisible} onLocaleSelected={ (id) => this.onLocaleSelected(id) }/>
                <PokemonList
                    pokemons={this.state.pokemons} 
                    eventHandler={ this.props.eventHandler }/>
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
