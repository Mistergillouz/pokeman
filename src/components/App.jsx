import React from 'react'
import PokedexHelper from 'data/PokedexHelper'

import MainPage from 'components/MainPage'
import ZoomPage from 'components/ZoomPage'
import EggPage from 'components/EggPage'
import Constants from 'data/Constants'
import SpeciesTooltip from 'components/SpeciesTooltip'

const PAGES = { MainPage: 'MainPage', ZoomPage: 'ZoomPage', EggPage: 'EggPage', TooltipType: 'TooltipType' };

class App extends React.Component {
   constructor() {
        super(...arguments)

        this.state = {
            //page: PAGES.EggPage,
            pageId: PAGES.MainPage,
            args: {}
        }
    }

    showTooltip(show, args) {

        let tooltipArgs;
        if (args.event)
            tooltipArgs = { 
                x: args.event.clientX,
                y: args.event.clientY,
                id: args.id
        }

        this.setState({ tooltipArgs: tooltipArgs })
    }

    eventHandler(args) {

        console.log(args)
        switch (args.eventType) {

            case Constants.EVENT.EggPage: 
                this.setState({ pageId: PAGES.EggPage })
                break;
        
            case Constants.EVENT.ShowTooltip: 
            case Constants.EVENT.HideTooltip: 
                this.showTooltip( args.eventType === Constants.EVENT.ShowTooltip, args)
                break;

            case Constants.EVENT.PokemonSelected:
                this.setState({ pageId: PAGES.ZoomPage, args: args })
                    break;

            case Constants.EVENT.Back:
                this.setState({ pageId: PAGES.MainPage })
                break;
        }
    }

    render() { 

        let pageId = this.state.pageId;
        return (
            <div className='app'>
                <MainPage visible={ pageId === PAGES.MainPage } eventHandler = { this.eventHandler.bind(this) }/>
                <ZoomPage visible={ pageId === PAGES.ZoomPage } args={ this.state.args } eventHandler = { this.eventHandler.bind(this) }/>
                <EggPage visible={ pageId === PAGES.EggPage }  eventHandler = { this.eventHandler.bind(this) }/>
                <SpeciesTooltip visible={ this.state.tooltipArgs } args={ this.state.tooltipArgs } eventHandler={ (args) => this.eventHandler(args)}/>
            </div>
        )
    }
}

export default App; 