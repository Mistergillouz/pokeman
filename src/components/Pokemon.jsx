import React from 'react'
import PokedexHelper from 'data/PokedexHelper'
import Constants from 'data/Constants'
import Species from 'components/Species'
import Lazimage from 'components/Lazimage'

class Pokemon extends React.Component {
   
    constructor() {
        super(...arguments)
    }

    buildSpecies(id) {
        return (<Species key={id} id={id} eventHandler={ this.props.eventHandler }/>);
    }

    onPokemonClicked(event) {
        if (this.props.eventHandler) {
            this.props.eventHandler({
                eventType: Constants.EVENT.PokemonSelected,
                id: this.props.id
            });
        }
    }

    render() { 

        let pokemon = PokedexHelper.getPokemon(this.props.id);
        let name = PokedexHelper.loc(pokemon);
        let h2Class = this.props.inactive ? 'inactive-h2' : '';
        let valueClass = this.props.inactive ? 'inactive-value' : 'value';

        return (
            <div className={ "gen " + (this.props.className || '') } onClick={ (e) => this.onPokemonClicked(e) }>
                <a className="pokemon g1" href="#" data-gen={ pokemon.gen }>
                <h2 className={ h2Class }>{ name }</h2>
                    <div className="types">
                        { pokemon.species.map((id) => this.buildSpecies(id)) }
                    </div>
                    <Lazimage className="lazimage" key={ this.props.id } src='../assets/images/wait.gif' target={ "https://www.serebii.net/art/th/" + this.props.id + ".png" } style={{ display: 'block' }}/>
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
