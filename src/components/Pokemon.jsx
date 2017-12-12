import React from 'react'
import PokedexHelper from 'data/PokedexHelper'
import Species from 'components/Species'

class Pokemon extends React.Component {
   
    constructor() {
        super(...arguments)
    }

    buildSpecies(id) {
        return (<Species key={id} id={id} onShowTooltip={ this.props.onShowTooltip }/>);
    }

    render() { 

        let pokemon = PokedexHelper.getPokemon(this.props.id);
        let name = PokedexHelper.loc(pokemon);
        let h2Class = this.props.inactive ? 'inactive-h2' : '';
        let valueClass = this.props.inactive ? 'inactive-value' : 'value';

        return (
            <div className="gen" data-id={ this.props.id } onClick={(e) => this.props.onPokemonClicked(this.props.id) }>
                <a className="pokemon g1" href="#" data-gen={ pokemon.gen }>
                <h2 className={ h2Class }>{ name }</h2>
                    <div className="types">
                        { pokemon.species.map((id) => this.buildSpecies(id)) }
                    </div>
                    <img className="lazimage" src={ "https://www.serebii.net/art/th/" + this.props.id + ".png" } style={{ display: 'block' }}/>
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
