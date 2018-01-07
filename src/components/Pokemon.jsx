import React from 'react'
import PokedexHelper from 'data/PokedexHelper'
import Constants from 'data/Constants'
import Species from 'components/Species'
import Lazimage from 'components/Lazimage'


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
        //e.preventDefault()
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

        if (!this.moved && !this.ignoreNextUp) {
            this.onPokemonClicked()
        }

        e.preventDefault()
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

    componentDidMount() {
        this.refs.pokemon.addEventListener('touchstart', (e) => { this._onMouseDown(e) })
        this.refs.pokemon.addEventListener('touchend', (e) => { this._onMouseUp(e) })
        this.refs.pokemon.addEventListener('touchmove', (e) => { this._onMouseMove(e) })
        this.refs.pokemon.addEventListener('mousedown', (e) => { this._onMouseDown(e) })
        this.refs.pokemon.addEventListener('mouseup', (e) => { this._onMouseUp(e) })
    }

    render() { 

        let pokemon = PokedexHelper.getPokemon(this.props.id);
        let name = PokedexHelper.loc(pokemon);
        let h2Class = this.props.inactive ? 'inactive-h2' : '';
        let valueClass = this.props.inactive ? 'inactive-value' : 'value';

        return (
            <div className={ "gen " + (this.props.className || '') }>
                <div onClick={ (e) => this.onSelect(false) } className={ this.props.selected ? 'pokemon-checked' : '' }/>
                <a ref="pokemon" key={ 'gen' + this.props.id } className="pokemon g1" href="#" data-gen={ pokemon.gen }>
                <h2 className={ h2Class }>{ name }</h2>
                    <div className="types">
                        { pokemon.species.map((id) => this.buildSpecies(id)) }
                    </div>
                    <Lazimage className="lazimage" src='../assets/images/wait.gif' target={ "https://www.serebii.net/art/th/" + this.props.id + ".png" } style={{ display: 'block' }}/>
                    <div className="bar">
                        <div className={ valueClass }></div>
                    </div>
                    <div className="id">{ this.props.id }</div>
                </a>
            </div>
        )
    }
}

export default Pokemon
