import React from 'react'
import PokedexHelper from 'data/PokedexHelper'

import MainPage from 'components/MainPage'
import ZoomPage from 'components/ZoomPage'
import EggPage from 'components/EggPage'
import Constants from 'data/Constants'
import SpeciesTooltip from 'components/SpeciesTooltip'

const PAGES = { MainPage: 'MainPage', ZoomPage: 'ZoomPage', EggPage: 'EggPage', TooltipType: 'TooltipType' }

class App extends React.Component {
   constructor() {
        super(...arguments)

        this.state = {
            pages: [{ pageId: PAGES.MainPage }]
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
        let pages = this.state.pages.slice(), entry = { pageId: pageId, args: args }
        if (!args || !args.noPageStack) {
            pages.push(entry)
        } else {
            pages[pages.length - 1] = entry
        }

        this.setState({ pages: pages })
    }

    popPage() {
        let pages = this.state.pages.slice().splice(0, this.state.pages.length - 1)
        this.setState({ pages: pages })
    }

    currentPage() {
        return this.state.pages[this.state.pages.length - 1] || {}
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

            case Constants.EVENT.PokemonClicked:
                this.pushPage(PAGES.ZoomPage, args)
                break

            case Constants.EVENT.Back:
                this.popPage()
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
                <SpeciesTooltip visible={ page.tooltipArgs } args={ page.tooltipArgs } eventHandler={ (args) => this.eventHandler(args)}/>
            </div>
        )
    }
}

export default App