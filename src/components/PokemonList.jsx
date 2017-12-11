import React from 'react'

import Pokemon from 'components/Pokemon'

class PokemonList extends React.Component {
   
    constructor() {
        super(...arguments)
    }

    buildPokemon(pokemonId) {
        return (<Pokemon id={pokemonId}/>);
    }

    render() { 
        return (
            <div className='pokemon-list'>
                {this.props.pokemons.map(this.buildPokemon)}
            </div>
        )
    }
}

export default PokemonList
