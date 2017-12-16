import React from 'react'
import PokedexHelper from 'data/PokedexHelper'

import MainPage from 'components/MainPage'
import ZoomPage from 'components/ZoomPage'
import EggPage from 'components/EggPage'
import Constants from 'data/Constants'
import SpeciesTooltip from 'components/SpeciesTooltip'

const PAGES = { MainPage: 'MainPage', ZoomPage: ' ZoomPage', EggPage: 'EggPage' };

class App extends React.Component {
   constructor() {
        super(...arguments)

        this.state = {
            //page: PAGES.EggPage,
            page: PAGES.MainPage,
            tooltipTypeId: -1,
            tooltip: {}
        }
    }

    eventHandler(args) {

        switch (args.eventType) {

            case Constants.EVENT.EggPage: 
                this.setState({ page: PAGES.EggPage })
                break;
        
            case Constants.EVENT.ShowTooltip: 
            
                this.setState({ tooltipTypeId: args.id, tooltip: { x: args.event.clientX, y: args.event.clientY } });
                break;
        
            case Constants.EVENT.HideTooltip:
                this.setState({ tooltipTypeId: -1 });
                break;
            
            case Constants.EVENT.PokemonSelected:

                this.setState({
                    page: PAGES.ZoomPage,
                    id: args.id
                });

                break;

            case Constants.EVENT.Back:

                this.setState({
                    page: PAGES.MainPage,
                });

                break;
        }
    }

    render() { 
        return (
            <div className='app'>
                <MainPage visible={ this.state.page === PAGES.MainPage } eventHandler = { this.eventHandler.bind(this) }/>
                <ZoomPage visible={ this.state.page === PAGES.ZoomPage } id={ this.state.id } eventHandler = { this.eventHandler.bind(this) }/>
                <EggPage visible={ this.state.page === PAGES.EggPage }  eventHandler = { this.eventHandler.bind(this) }/>
                <SpeciesTooltip id={ this.state.tooltipTypeId } x={ this.state.tooltip.x } y={ this.state.tooltip.y } eventHandler={ (args) => this.eventHandler(args)}/>
            </div>
        )
    }
}

export default App; 