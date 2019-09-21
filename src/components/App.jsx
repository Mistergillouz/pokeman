import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'

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
import AttackPage from './AttackPage'
import DiffPage from './DiffPage'

export default class App extends React.Component {
  render () {
    return (
      <Router hashType='noslash'>
        <Switch>
          <Route path='/' exact component={MainPage} />
          <Route path='/pokemon/:id' exact component={ZoomPage} />
          <Route path='/pokemon/:id/shiny' exact component={ZoomPage} />
          <Route path='/pokemon/:id/calc' exact component={CalculationPage} />
          <Route path='/pokemon/:id/resist' exact component={ResistPage} />
          <Route path='/pokemon/:id/ranking' exact component={RankingPage} />
          <Route path='/resist/:ids' component={ResistPage} />
          <Route path='/eggs' component={EggPage} />
          <Route path='/evolutions' component={EvolutionPage} />
          <Route path='/babies' component={BabiesPage} />
          <Route path='/compare' component={ComparePage} />
          <Route path='/forms' component={FormsPage} />
          <Route path='/attacks' component={AttackPage} />
          <Route path='/diffs' component={DiffPage} />
        </Switch>
      </Router>
    )
  }
}
