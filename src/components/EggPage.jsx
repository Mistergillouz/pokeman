import React from 'react'

import Constants from '../data/Constants'
import PokedexHelper from '../data/PokedexHelper'
import Utils from '../data/Utils'
import SmallPokemon from './SmallPokemon'
import BackButton from './BackButton'
import PokemanLink from './PokemanLink'
import PokemanPage from './PokemanPage'

class EggPage extends PokemanPage {
   constructor() {
        super('Oeufs', arguments)
        
        this.eggs = PokedexHelper.getEggs()

        this.maxGen = 0
        this.iterator(this.eggs, (distance, pokemon) => {
            this.maxGen = Math.max(this.maxGen, pokemon.gen)
        })

        this.state = {
            distances: [],
            gens: [ this.maxGen ]
        }

    }


    filter() {

        let eggs = {}
        this.iterator(this.eggs, (distance, pokemon) => {
            if (this.state.distances.length && this.state.distances.indexOf(distance) === -1) {
                return;
            }
            if (this.state.gens.length && this.state.gens.indexOf(pokemon.gen) === -1) {
                return;
            }

            if (!eggs[distance]) {
                eggs[distance] = []
            }

            eggs[distance].push(pokemon)
        })

        Object.keys(eggs).forEach(distance => {
            eggs[distance].sort((a, b) => PokedexHelper.loc(a).localeCompare(PokedexHelper.loc(b)))
        })

        return eggs;
    }
    
    iterator(eggs, callback) {

        Object.keys(eggs).forEach(distance => {
            for (let pokemonId of eggs[distance]) {
                callback(distance, PokedexHelper.getPokemon(pokemonId))
            }
        })
    }

    generatePokemons(pokemons) {
        let tiles = pokemons.map(pokemon => {
            return (
                <PokemanLink to={ '/pokemon/' + pokemon.id }>
                    <SmallPokemon id={ pokemon.id }/>
                </PokemanLink>
            )
        })

        return tiles
    }
    generateSection(pokemons, distance) {

        let tiles = this.generatePokemons(pokemons)
        return (
            <div className="egg-group">
                <div className="egg-group-text">{ distance + 'km' }</div>
                <div className="egg-section">
                    { tiles }
                </div>
            </div>
        )
    }

    generatePage() {
        let eggs = this.filter(this.eggs)
        let distances = Object.keys(eggs) 

        let sections = [];
        for (let distance of distances) {
            sections.push(this.generateSection(eggs[distance], distance, eggs.length > 0));
        }

        return sections;
    }

    generateGenFilter() {
        let buttons = []
        for (let i = 1; i <= this.maxGen; i++) {

            let clazz = (i === 1) ? 'gen-button-left' : (i === this.maxGen) ? 'gen-button-right' : 'gen-button-center'
            if (this.state.gens.indexOf(i) !== -1) {
                clazz += ' selected';
            }

            buttons.push(
                <label className={ 'gen-button ' + clazz } onClick={() => { this.onGenClicked(i) }}>{ i }</label>
            )
        }
        return buttons
    }

    generateDistancesFilter() {
        
        let buttons = [], keys = Object.keys(this.eggs)
        for (let i = 0; i < keys.length; i++) {

            let clazz = (i === 0) ? 'gen-button-left' : (i === (keys.length - 1)) ? 'gen-button-right' : 'gen-button-center'
            if (this.state.distances.indexOf(keys[i]) !== -1) {
                clazz += ' selected';
            }

            buttons.push(
                <label className={ 'gen-button ' + clazz } onClick={() => { this.onDistanceClicked(keys[i]) }}>{ keys[i] }</label>
            )
        }
        return buttons
    }

    onDistanceClicked(distance) {
        let distances = Utils.toggle(this.state.distances, distance, true)
        this.setState({ distances: distances })
    }

    onGenClicked(gen) {
        let gens = Utils.toggle(this.state.gens, gen, true)
        this.setState({ gens: gens })
    }
    
    render() { 

        return (
            <div className="page">
                <div className="navbar">
                <div className="right-panel">
                    { this.generateGenFilter() }
                </div>

                <div className="left-panel">
                    <BackButton/>
                    { this.generateDistancesFilter() }
                    <sup className='centered-text'>{ this.getPageCaption() }</sup>
                </div>
                
                </div>
                <div className="eggs-container">
                    { this.generatePage() }
    		    </div>

                { super.render() }
		    </div>
        )
    }
}

export default EggPage; 