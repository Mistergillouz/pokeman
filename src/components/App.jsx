import React from 'react'
import PokedexHelper from 'data/PokedexHelper'

import MainPage from 'components/MainPage'
import ZoomPage from 'components/ZoomPage'
import EggPage from 'components/EggPage'
import ComparePage from 'components/ComparePage'
import Constants from 'data/Constants'
import SpeciesTooltip from 'components/SpeciesTooltip'
import EvolutionPage from 'components/EvolutionPage'
import BabiesPage from 'components/BabiesPage'
import CalculationPage from 'components/CalculationPage'


const PAGES = { 
    MainPage: 'MainPage', 
    ZoomPage: 'ZoomPage', EggPage: 'EggPage', TooltipType: 'TooltipType', 
    ComparePage: 'ComparePage', EvolutionPage: 'EvolutionPage', BabisPage: 'BabiesPage',
    CalculationPage: 'CalculationPage'
}

class App extends React.Component {
   constructor() {
        super(...arguments)

        this.state = {
            selected: [],
            pages: [_pageEntry(PAGES.MainPage)]
            
        }
    }

    showTooltip(show, args) {

        let tooltipArgs
        if (args.event)
            tooltipArgs = { 
                x: args.event.clientX,
                y: args.event.clientY,
                id: args.id
        }

        let pages = this.state.pages.slice()
        pages[pages.length - 1].tooltipArgs = tooltipArgs
        this.setState({ pages: pages })
    }

    pushPage(pageId, args) {
        let pages = this.state.pages.slice(), entry = _pageEntry(pageId, args)
        if (!args || !args.noPageStack) {
            pages.push(entry)
        } else {
            pages[pages.length - 1] = entry
        }this.setState({ pages: pages })
    }

    popPage() {
        let pages = this.state.pages.slice().splice(0, this.state.pages.length - 1)
        this.setState({ pages: pages })
    }

    currentPage() {
        return this.state.pages[this.state.pages.length - 1] || { args: {}}
    }

    eventHandler(args) {

        switch (args.eventType) {

            case Constants.EVENT.EggPage: 
                this.pushPage(PAGES.EggPage)
                break
        
            case Constants.EVENT.ShowTooltip: 
            case Constants.EVENT.HideTooltip: 
                this.showTooltip(args.eventType === Constants.EVENT.ShowTooltip, args)
                break

            case Constants.EVENT.PokemonSelected:
                this.toggleSelected(args.id)
                break;

            case Constants.EVENT.PokemonClicked:
                if (this.state.selected.length) {
                    this.toggleSelected(args.id)
                } else {
                    this.pushPage(PAGES.ZoomPage, args)
                }
                break;

            case Constants.EVENT.ComparePage:
                this.pushPage(PAGES.ComparePage, args)
                break

            case Constants.EVENT.Back:
                this.popPage()
                break
            
            case Constants.EVENT.EvolutionPage:
                this.pushPage(PAGES.EvolutionPage, args)
                break

            case Constants.EVENT.BabiesPage:
                this.pushPage(PAGES.BabiesPage, args)
                break
            case Constants.EVENT.CalculationPage:
            this.pushPage(PAGES.CalculationPage, args)
            break
        }
    }

    render() { 

        let page = this.currentPage(), pageId = page.pageId
        return (
            <div className='app'>
                <MainPage visible={ pageId === PAGES.MainPage } eventHandler = { this.eventHandler.bind(this) }/>
                <ZoomPage visible={ pageId === PAGES.ZoomPage } args={ page.args } eventHandler = { this.eventHandler.bind(this) }/>
                <EggPage visible={ pageId === PAGES.EggPage }  eventHandler = { this.eventHandler.bind(this) }/>
                <ComparePage visible={ pageId === PAGES.ComparePage } pokemons={ page.args.pokemons } eventHandler = { this.eventHandler.bind(this) }/>
                <SpeciesTooltip visible={ page.tooltipArgs } args={ page.tooltipArgs } eventHandler={ (args) => this.eventHandler(args)}/>
                <EvolutionPage visible={ pageId === PAGES.EvolutionPage } eventHandler = { this.eventHandler.bind(this)} />
                <BabiesPage visible={ pageId === PAGES.BabiesPage } eventHandler = { this.eventHandler.bind(this)} />
                <CalculationPage visible={ pageId === PAGES.CalculationPage } id={ page.args.id } eventHandler = { this.eventHandler.bind(this)} />
            </div>
        )
    }
}

function _pageEntry(pageId, args) {
    return {
        pageId: pageId,
        args: args || {}
    }
}

export default App