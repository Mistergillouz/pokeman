import React from 'react'

import Pokemon from 'components/Pokemon'
import NotFound from 'components/NotFound'


class PokemonList extends React.Component {
   
    constructor() {
        super(...arguments)
    }

    componentDidMount() {
        this.refs['pokemon-list'].addEventListener('scroll', (e) => {
            PokemonList.scrollTop = e.target.scrollTop
        })

        this.refs['pokemon-list'].scrollTop = PokemonList.scrollTop
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
            <div ref="pokemon-list" key="pokelist" className='pokemon-list'>
                { content }
            </div>
                
        )
    }
}

PokemonList.scrollTop = 0

export default PokemonList
