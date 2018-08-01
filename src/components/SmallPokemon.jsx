import React from 'react'
import Lazimage from './Lazimage'
import PokedexHelper from '../data/PokedexHelper'

class SmallPokemon extends React.Component {
   constructor () {
        super(...arguments)
    }

    onClick () {
        if (this.props.onClick) {
            this.props.onClick(this.props.id)
        }
    }
    
    render () {

        let clazz = this.props.selected ? 'egg-pokemon-selected' : ''
        let genSpanClasses = this.props.showGen ? 'egg-pokemon-gen' : 'hidden'
        let pokemon = PokedexHelper.getPokemon(this.props.id)

        return (
            <div className={ 'egg-pokemon ' + clazz } onClick={ () => this.onClick() }>
                <Lazimage className="egg-pokemon-img"
                    key={ this.props.id } 
                    src='../assets/images/wait.gif'
                    target={ this.getImagePath(pokemon) }/>
                { this.generateName(pokemon) }
                <span className={ genSpanClasses }>{ pokemon.gen }</span>
            </div>
        )
    }

    getImagePath (pokemon) {
        if (this.props.shiny) {
            return PokedexHelper.getImagePath(pokemon, true)
        }

        return PokedexHelper.getImagePath(pokemon)
            
    }

    generateName (pokemon) {
        return this.props.hideName ? null : <label className="egg-pokemon-img-text">{ PokedexHelper.loc(pokemon) }</label>
    }
}

export default SmallPokemon