import React from 'react'
import PokemonList from 'components/PokemonList'

class App extends React.Component {
   constructor() {
        super(...arguments)

        this.state = {};

        this.state.ids = [];
        for (let i = 1; i < 10; i++) {
            this.state.ids.push(i);
        }
    }

    render() { 
        return (
            <div className='app'>
                <PokemonList pokemons={this.state.ids}/>
            </div>
        )
    }
}

export default App; 