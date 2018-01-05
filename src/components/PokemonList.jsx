import React from 'react'

import Pokemon from 'components/Pokemon'
import NotFound from 'components/NotFound'
import Constants from '../data/Constants';
import Store from '../data/Store';

class PokemonList extends React.Component {
   
    constructor() {
        super(...arguments)
        this.state = {
            selected: Store.get('selected', [])
        }
    }

    componentDidMount() {
        this.refs['pokemon-list'].addEventListener('scroll', (e) => {
            PokemonList.scrollTop = e.target.scrollTop
        })

        this.refs['pokemon-list'].scrollTop = PokemonList.scrollTop
    }

    eventHandler(args) {

        switch (args.eventType) {

            case Constants.EVENT.PokemonSelected:
                this.toggleSelected(args.id)
                break;

            case Constants.EVENT.PokemonClicked:
                if (this.state.selected.length) {
                    this.toggleSelected(args.id)
                } else {
                    this.props.eventHandler(args)
                }
                break;
        }
    }

    toggleSelected(id) {
        let selected = this.state.selected.slice(), index = selected.indexOf(id)
        if (index === -1) {
            selected.push(id)
        } else {
            selected.splice(index, 1)
        }

        this.setState({ selected: selected })
        Store.set('selected', selected)
    }

    buildPokemon(pokemonId) {
        let selected = this.state.selected.indexOf(pokemonId) !== -1
        return (<Pokemon key={ pokemonId } id={ pokemonId } selected={ selected } eventHandler={ args => this.eventHandler(args) }/>);
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
            <div ref="pokemon-list" className='pokemon-list'>
                { content }
            </div>
                
        )
    }
}

PokemonList.scrollTop = 0

export default PokemonList
