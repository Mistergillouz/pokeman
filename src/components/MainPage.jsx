import React from 'react'
import PokemonList from 'components/PokemonList'
import PokedexHelper from 'data/PokedexHelper'
import LocaleFlag from 'components/LocaleFlag'
import LocalePopover from 'components/LocalePopover'
import FilterPanel from 'components/FilterPanel'

class MainPage extends React.Component {
   
    constructor() {
        super(...arguments)

        this.state = {
            visible: true,
            country: 'fr',
            localePopoverVisible: false,
            filterVisible: false,
            filterPanelHeight: 0,
            pokemons: []
        };

        this.query = { text: '', genId: null,types: [] };
        
        for (let i = 1; i < 15; i++) {
            this.state.pokemons.push(i);
        }
    }


    onToggleFilterPanel(event) {
        this.refs.filterPanel.toggle();
        //updateListOrigin();
    } 

    onToggleLocalePopover() {
        this.setState({ localePopoverVisible: !this.state.localePopoverVisible })
    }

    onLocaleSelected(event) {
        let country = event.currentTarget.dataset.id;
        PokedexHelper.setLocaleCountry(country);
        this.setState({ country: country });

        this.onToggleLocalePopover();
        this.forceUpdate();
    }

    onFilterTextChanged(event) {
        this.applyFilter({ text:  event.target.value });
    }

    onFilterChangeListener(args, height) {
        this.applyFilter(args);

        if (this.state.filterPanelHeight !== height) {
            this.setState({ filterPanelHeight: height });
        }
    }

    applyFilter(args) {
        if (args) {
            Object.assign(this.query, args);
            let ids = PokedexHelper.search(this.query);
            this.setState({ pokemons: ids });
        }
    }

    render() { 

        return (
            <div>
                <div className="page" data-content-id="tiles-container">
                    <div className="navbar">

                    <div className="left-panel filter-toggle" onClick={ (e) => this.onToggleFilterPanel(e) }></div>
                        <input type="search" className="search-input ui-styles" placeholder="Rechercher un Pokémon" onChange={(e) => this.onFilterTextChanged(e)}></input>
                        <div className="right-panel" onClick={ this.onToggleLocalePopover.bind(this) }>
                                <LocaleFlag country={this.state.country}/>
                                <img src="../assets/images/arrow-down.png"/>
                        </div>
                    </div> 

                    <FilterPanel ref="filterPanel" notifyChange={ this.onFilterChangeListener.bind(this) }/>
                    
                </div>
                <PokemonList top={this.state.filterPanelHeight} pokemons={this.state.pokemons}/>
                <LocalePopover show={this.state.localePopoverVisible} onLocaleSelected={this.onLocaleSelected.bind(this)}/>
            </div>
        )
    }
}

export default MainPage
