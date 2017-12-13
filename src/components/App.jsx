import React from 'react'
import PokedexHelper from 'data/PokedexHelper'

import MainPage from 'components/MainPage'
import ZoomPage from 'components/ZoomPage'
import Constants from 'data/Constants'

class App extends React.Component {
   constructor() {
        super(...arguments)
        this.state = {
            showMainPage: true
        }
    }

    eventHandler(args) {

        switch (args.event) {

            case Constants.EVENT.PokemonSelected:

                let evolutions = PokedexHelper.getEvolvesList(args.id);
                this.setState({
                    showMainPage: false,
                    evolutions: evolutions
                });

                break;

            case Constants.EVENT.ZoomPageClosed:

                this.setState({
                    showMainPage: true
                });

                break;
        }
    }

    render() { 
        return (
            <div className='app'>
                <MainPage eventHandler = { this.eventHandler.bind(this) } visible={ this.state.showMainPage }/>
                <ZoomPage visible={ !this.state.showMainPage } evolutions={ this.state.evolutions } eventHandler = { this.eventHandler.bind(this) }/>
            </div>
        )
    }
}

export default App; 