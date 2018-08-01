import React from 'react'
import { Link } from 'react-router-dom'

import PokedexHelper from '../data/PokedexHelper'
import Constants from '../data/Constants'
import Species from './Species'
import Lazimage from './Lazimage'
import FontIcon from './FontIcon'

const LONG_PRESS_DURATION = 500

class Pokemon extends React.Component {
   
    constructor() {
        super(...arguments)
        this.state = {}
    }

    buildSpecies(id) {
        return (<Species key={id} id={id} eventHandler={ this.props.eventHandler }/>)
    }

    onPokemonClicked() {

        if (this.props.eventHandler) {
            this.props.eventHandler({
                eventType: Constants.EVENT.PokemonClicked,
                id: this.props.id
            });
        }
    }

    _onMouseDown(e) {
        this.timer = setTimeout(() => this._onLongPress(), LONG_PRESS_DURATION)
    }

    _onMouseMove(e) {
        this.moved = true
    }

    _onLongPress() {
        if (!this.moved) {
            this.onSelect(true)
            this.ignoreNextUp = true
        }
    }

    _onMouseUp(e) {

        if (!this.moved) {
            if (!this.ignoreNextUp) {
                this.onPokemonClicked()
            }
            e.preventDefault()
        }

        clearTimeout(this.timer)
        delete this.timer
        delete this.ignoreNextUp
        delete this.moved
    }

    onSelect(selected) {
        if (this.props.eventHandler) {
            this.props.eventHandler({
                eventType: Constants.EVENT.PokemonSelected,
                id: this.props.id,
                selected: selected
            });
        }
    }

    render() { 

        let pokemon = PokedexHelper.getPokemon(this.props.id);
        let name = PokedexHelper.loc(pokemon);
        let h2Class = this.props.inactive ? 'inactive-h2' : '';
        let valueClass = this.props.inactive ? 'inactive-value' : 'value';

        return (
            <div className={ 'gen ' + (this.props.className || '') }>
                { this.props.selected ? <FontIcon icon="fa fa-check-circle text-selected pokemon-checked"/> : <div className="pokemon-id">{ this.props.id }</div> }
                <a ref="pokemon" key={ 'gen' + this.props.id } className="pokemon g1" href="#" data-gen={ pokemon.gen }
                    onTouchStart={ e => this._onMouseDown(e) }
                    onTouchEnd={ e => this._onMouseUp(e) }
                    onTouchMove={ e => this._onMouseMove(e) }
                    onMouseDown={ e => this._onMouseDown(e) }
                    onMouseUp={ e => this._onMouseUp(e) }>

                <h2 className={ h2Class }>{ name }</h2>
                    <div className="types">
                        { pokemon.species.map((id) => this.buildSpecies(id)) }
                    </div>
                    <Lazimage className="lazimage" src='../assets/images/wait.gif' target={ PokedexHelper.getImagePath(pokemon) } style={{ display: 'block' }}/>
                    <div className="bar">
                        <div className={ valueClass }></div>
                    </div>
                    
                </a>
            </div>
        )
    }
}

export default Pokemon
