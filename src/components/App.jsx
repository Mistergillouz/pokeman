import React from 'react'
import { HashRouter as Router, Switch, Route, browserHistory } from 'react-router-dom'

import PokedexHelper from 'data/PokedexHelper'

import MainPage from 'components/MainPage'
import ZoomPage from 'components/ZoomPage'
import EggPage from 'components/EggPage'
import ComparePage from 'components/ComparePage'
import Constants from 'data/Constants'
import EvolutionPage from 'components/EvolutionPage'
import BabiesPage from 'components/BabiesPage'
import CalculationPage from 'components/CalculationPage'
import ResistPage from 'components/ResistPage'


export default class App extends React.Component {
   constructor() {
        super(...arguments)
    }

    // showTooltip(show, args) {

    //     let pages = this.state.pages.slice()
    //     pages[pages.length - 1].tooltipArgs = show ? args : null
    //     this.setState({ pages: pages })
    // }

    render() { 

        return (
            <Router hashType="noslash">
                <Switch>
                    <Route path="/" exact={ true } component={MainPage}/>
                    <Route path="/pokemon/:id" exact={ true } component={ZoomPage}/>
                    <Route path="/pokemon/:id/calc" exact={ true } component={CalculationPage}/>
                    <Route path="/pokemon/:id/resist" exact={ true } component={ResistPage}/>
                    <Route path="/eggs" component={EggPage}/>
                    <Route path="/evolutions" component={EvolutionPage}/>
                    <Route path="/babies" component={BabiesPage}/>
                    <Route path="/compare" component={ComparePage}/>
                </Switch>
            </Router>
        )
    }
}
