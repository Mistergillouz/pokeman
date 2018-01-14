import React from 'react'
import Lazimage from 'components/Lazimage'
import PokedexHelper from 'data/PokedexHelper'

class SmallPokemon extends React.Component {
   constructor() {
        super(...arguments)
    }

    onClick() {
        if (this.props.onClick) {
            this.props.onClick(this.props.id)
        }
    }
    render() {

        let clazz = this.props.selected ? 'egg-pokemon-selected' : ''
        let genSpanClasses = this.props.showGen ? 'egg-pokemon-gen' : 'hidden'
        let pokemon = PokedexHelper.getPokemon(this.props.id)

        return (
            <div className={ 'egg-pokemon ' + clazz } onClick={ () => this.onClick() }>
                <Lazimage className="egg-pokemon-img"
                    key={ this.props.id } 
                    src='../assets/images/wait.gif'
                    target={ '../assets/pokemons/' + this.props.id + '.png' }/>
                <label className="egg-pokemon-img-text">{ PokedexHelper.loc(pokemon) }</label>
                <span className={ genSpanClasses }>{ pokemon.gen }</span>
            </div>
        )
    }
}

export default SmallPokemon