import React from 'react'
import Lazimage from './Lazimage'
import PokedexHelper from '../data/PokedexHelper'

class SmallPokemon extends React.Component {
  onClick () {
    if (this.props.onClick) {
      this.props.onClick(this.props.id)
    }
  }

  render () {
    let clazz = this.props.selected ? 'egg-pokemon-selected' : ''

    if (!this.props.onClick) {
      clazz += ' default-cursor'
    }

    let genSpanClasses = this.props.showGen ? 'egg-pokemon-gen' : 'hidden'
    let pokemon = PokedexHelper.getPokemon(this.props.id)

    return (
      <div className={'egg-pokemon ' + clazz} onClick={() => this.onClick()}>
        <Lazimage className='egg-pokemon-img'
          key={this.props.id}
          src='../assets/images/wait.gif'
          target={this.getImagePath(pokemon)} />
        { this.generateName(pokemon) }
        <span className={genSpanClasses}>{ pokemon.gen }</span>
      </div>
    )
  }

  getImagePath (pokemon) {
    return PokedexHelper.getImagePath(pokemon, this.props.shiny)
  }

  generateName (pokemon) {
    return this.props.hideName ? null : <label className='egg-pokemon-img-text'>{ PokedexHelper.loc(pokemon) }</label>
  }
}

export default SmallPokemon
