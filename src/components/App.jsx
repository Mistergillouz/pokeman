import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'

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


export default class App extends React.Component {
   constructor() {
        super(...arguments)

        this.state = {
            selected: []
        }
    }

    // showTooltip(show, args) {

    //     let pages = this.state.pages.slice()
    //     pages[pages.length - 1].tooltipArgs = show ? args : null
    //     this.setState({ pages: pages })
    // }

    render() { 

        return (
            <Router>
                <Switch>
                    <Route path="/" exact={ true } component={MainPage}/>
                    <Route path="/pokemon/:id" exact={ true } component={ZoomPage}/>
                    <Route path="/pokemon/:id/calc" exact={ true } component={CalculationPage}/>
                    <Route path="/pokemon/eggs" component={EggPage}/>
                    <Route path="/pokemon/evolutions" component={EvolutionPage}/>
                    <Route path="/pokemon/babies" component={BabiesPage}/>
                    <Route path="/pokemon/compare" component={ComparePage}/>
                </Switch>
            </Router>
        )
    }
}
