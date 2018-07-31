import React from 'react'
import { HashRouter as Router, Switch, Route, browserHistory } from 'react-router-dom'

import MainPage from './MainPage'
import ZoomPage from './ZoomPage'
import EggPage from './EggPage'
import ComparePage from './ComparePage'
import EvolutionPage from './EvolutionPage'
import BabiesPage from './BabiesPage'
import CalculationPage from './CalculationPage'
import ResistPage from './ResistPage'
import RankingPage from './RankingPage'
import FormsPage from './FormsPage'
import ShinyPage from './ShinyPage'

export default class App extends React.Component {
   constructor() {
        super(...arguments)
    }

    render() { 

        return (
            <Router hashType="noslash">
                <Switch>
                    <Route path="/" exact={ true } component={MainPage}/>
                    <Route path="/pokemon/:id" exact={ true } component={ZoomPage}/>
                    <Route path="/pokemon/:id/calc" exact={ true } component={CalculationPage}/>
                    <Route path="/pokemon/:id/resist" exact={ true } component={ResistPage}/>
                    <Route path="/pokemon/:id/ranking" exact={ true } component={RankingPage}/>
                    <Route path="/resist/:ids" component={ResistPage}/>
                    <Route path="/eggs" component={EggPage}/>
                    <Route path="/evolutions" component={EvolutionPage}/>
                    <Route path="/babies" component={BabiesPage}/>
                    <Route path="/compare" component={ComparePage}/>
                    <Route path="/forms" component={FormsPage}/>
                    <Route path='/shinies' component={ShinyPage}/>
                </Switch>
            </Router>
        )
    }
}
