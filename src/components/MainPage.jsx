import React from 'react'
import PokemonList from 'components/PokemonList'
import PokedexHelper from 'data/PokedexHelper'
import LocaleFlag from 'components/LocaleFlag'
import LocalePopover from 'components/LocalePopover'
import FilterPanel from 'components/FilterPanel'
import SpeciesTooltip from 'components/SpeciesTooltip'
import Constants from 'data/Constants'

class MainPage extends React.Component {
   
    constructor() {
        super(...arguments)

        this.state = {
            visible: true,
            country: 'fr',
            localePopoverVisible: false,
            filterVisible: false,
            filterPanelHeight: 0,
            pokemons: [],

            tooltipTypeId: -1

        };

        this.props = {};

        this.searchSettings = { text: '', genId: null, types: [] };
        this.tooltip = {
            x: 0,
            y: 0
        };

        for (let i = 1; i < 15; i++) {
            this.state.pokemons.push(i);
        }
    }

    eventHandler(args) {

        switch (args.event) {
            
            case Constants.EVENT.ShowTooltip: 

                this.tooltip.x = args.x;
                this.tooltip.y = args.y;
                this.setState({ tooltipTypeId: args.id });
                break;
            
            case Constants.EVENT.HideTooltip:
                this.setState({ tooltipTypeId: -1 });
                break;
            
            case Constants.EVENT.PokemonSelected:
                this.props.eventHandler(args);
                break;

        }
    }
    
    onToggleFilterPanel(event) {
        this.setState({ filterVisible: !this.state.filterVisible });
    } 

    onToggleLocalePopover() {
        this.setState({ localePopoverVisible: !this.state.localePopoverVisible })
    }

    onLocaleSelected(country) {
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

        if (height && this.state.filterPanelHeight !== height) {
            this.setState({ filterPanelHeight: height });
        }
    }

    applyFilter(args) {
        if (args) {
            Object.assign(this.searchSettings, args);
            let ids = PokedexHelper.search(this.searchSettings);
            this.setState({ pokemons: ids });
        }
    }

    render() { 

        if (!this.props.visible) {
            return null;
        }

        return (
            <div>
                <div className="page" data-content-id="tiles-container">
                    <div className="navbar">

                        <div className="left-panel filter-toggle" onClick={ (e) => this.onToggleFilterPanel(e) }>
                        </div>

                        <input type="search" className="search-input ui-styles" placeholder="Rechercher un Pokémon" onChange={(e) => this.onFilterTextChanged(e)}></input>
                        <div className="right-panel" onClick={ this.onToggleLocalePopover.bind(this) }>
                                <LocaleFlag country={this.state.country}/>
                                <img src="../assets/images/arrow-down.png"/>
                        </div>
                    </div> 

                    <FilterPanel ref="filterPanel" visible={ this.state.filterVisible } notifyChange={ this.onFilterChangeListener.bind(this) }/>
                    <LocalePopover show={this.state.localePopoverVisible} onLocaleSelected={ (id) => this.onLocaleSelected(id) }/>
                    
                </div>

                <PokemonList top={this.state.filterPanelHeight} 
                    pokemons={this.state.pokemons} 
                    eventHandler={(args) => this.eventHandler(args) }/>

                <SpeciesTooltip ref="speciesTooltip" id={ this.state.tooltipTypeId } x={ this.tooltip.x } y={ this.tooltip.y } eventHandler={ (args) => this.eventHandler(args)}/>
            </div>
        )
    }
}

export default MainPage
