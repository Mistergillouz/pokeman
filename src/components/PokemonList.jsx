import React from 'react'

import Pokemon from 'components/Pokemon'
import NotFound from 'components/NotFound'

class PokemonList extends React.Component {
   
    constructor() {
        super(...arguments)
    }

    buildPokemon(pokemonId) {
        return (<Pokemon id={pokemonId} eventHandler={ this.props.eventHandler }/>);
    }

    generateList() {

        if (this.props.pokemons.length) {
            return this.props.pokemons.map((id) => this.buildPokemon(id))
        }

        return <NotFound text='Pas de pokémons retournés par votre recherche...'/>
    }    

    render() { 

        let content = this.generateList();
        return (
            <div className='pokemon-list'>
                { content }
            </div>
                
        )
    }
}

export default PokemonList
