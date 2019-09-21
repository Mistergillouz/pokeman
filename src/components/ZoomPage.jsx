import React from 'react'
import { Redirect } from 'react-router-dom'

import PokemanPage from './PokemanPage'
import Constants from '../data/Constants'
import PokedexHelper from '../data/PokedexHelper'
import CombatPanel from './CombatPanel'
import SmallPokemon from './SmallPokemon'
import EvolutionPanel from './EvolutionPanel'
import BackButton from './BackButton'
import FontIcon from './FontIcon'
import PokemanLink from './PokemanLink'

export default class ZoomPage extends PokemanPage {
  constructor () {
    super(null, arguments)

    let params = new URLSearchParams(this.props.location.search)
    this.state = {
      showShiny: params.get('shiny') === 'true'
    }
  }

  onEvent (args) {
    if (args.eventType === Constants.EVENT.ShinyButtonPressed) {
      this.state.showShiny = args.showShiny
      this.render()
    } else {
      this.props.eventHandler(args)
    }
  }

  getUrlParams () {
    return this.state.showShiny ? '&shiny=true' : ''
  }

  render () {
    let id = Number(this.props.match.params.id)
    let evolves = PokedexHelper.getEvolvesList(id)

    let label = PokedexHelper.getPokemonName(id)
    this.setPageCaption(label)

    return (

      <div className='page'>
        <div className='navbar'>
          <div className='left-panel'>
            <BackButton />
          </div>
          <sup className='centered-text'>{ label }</sup>
        </div>
        <div className='pokemon-zoom'>
          <EvolutionPanel id={id} evolves={evolves} />
          <CombatPanel id={id} showShiny={this.state.showShiny} eventHandler={(args) => this.onEvent(args)} />
        </div>
        { super.render() }
      </div>
    )
  }
}
