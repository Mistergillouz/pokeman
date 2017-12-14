import React from 'react'

import Pokemon from 'components/Pokemon'

class PokemonList extends React.Component {
   
    constructor() {
        super(...arguments)
    }

    buildPokemon(pokemonId) {
        return (<Pokemon id={pokemonId} eventHandler={ this.props.eventHandler }/>);
    }

    componentDidMount() {
        console.log('After render called');
    }
    
    render() { 

        return (
            <div className='pokemon-list'>
                { this.props.pokemons.map((id) => this.buildPokemon(id)) }
            </div>
        )
    }
}

export default PokemonList
