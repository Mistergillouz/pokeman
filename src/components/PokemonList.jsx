import React from 'react'

import Pokemon from 'components/Pokemon'

class PokemonList extends React.Component {
   
    constructor() {
        super(...arguments)
    }

    buildPokemon(pokemonId) {
        return (<Pokemon id={pokemonId} onPokemonClicked={ this.props.onPokemonClicked } onShowTooltip={ this.props.onShowTooltip }/>);
    }

    componentDidMount() {
        console.log('After render called');
    }
    
    render() { 

        let styles = this.props.top ? { top: this.props.top + 'px'} : {};
        return (
            <div className='pokemon-list' style={styles}>
                { this.props.pokemons.map((id) => this.buildPokemon(id)) }
            </div>
        )
    }
}

export default PokemonList
