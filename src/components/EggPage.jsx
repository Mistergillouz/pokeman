import React from 'react'
import Constants from 'data/Constants'
import PokedexHelper from 'data/PokedexHelper'
import Lazimage from 'components/Lazimage'

class EggPage extends React.Component {
   constructor() {
        super(...arguments)

        
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
            eggs[distance].forEach(pokemonId => {
                callback(distance, PokedexHelper.pokemon(pokemonId))
            })
        })
    }
    
    generatePokemons(pokemons) {
        let tiles = pokemons.map(pokemon => {
            return (
                <div className="egg-pokemon">
                    <Lazimage className="egg-pokemon-img"
                        key={ pokemon.name } 
                        src='../assets/images/wait.gif'
                        target={ "https://www.serebii.net/art/th/" + pokemon.id + ".png" }/>
                    <label className="egg-pokemon-img-text">{ PokedexHelper.loc(pokemon) }</label>
                </div>
            )
        })

        return tiles
    }
    generateSection(pokemons, distance, addSectionText) {

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
        distances.forEach(distance => {
            sections.push(this.generateSection(eggs[distance], distance, eggs.length > 0));
        });

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
                <label className={ "gen-button " + clazz } onClick={(e) => { this.onGenClicked(i) }}>{ i }</label>
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
                <label className={ "gen-button " + clazz } onClick={(e) => { this.onDistanceClicked(keys[i]) }}>{ keys[i] }</label>
            )
        }
        return buttons
    }

    onDistanceClicked(distance) {
        let distances = PokedexHelper.toggle(this.state.distances, distance)
        this.setState({ distances: distances })
    }

    onGenClicked(gen) {
        let gens = PokedexHelper.toggle(this.state.gens, gen)
        this.setState({ gens: gens })
    }
    
    onBack() {
        this.props.eventHandler({ eventType: Constants.EVENT.Back })
    }

    render() { 

        if (!this.props.visible) {
            return null
        }

        return (
            <div className="page">
                <div className="navbar">
                <div className="left-panel">
                    <button className="back-button" onClick= {() => this.onBack() }></button>
                    { this.generateDistancesFilter() }
                </div>
                <sup>Oeufs</sup>
                <div className="right-panel">
                    { this.generateGenFilter() }
                </div>
                </div>
                <div className="eggs-container">
                    { this.generatePage() }
    		    </div>
		    </div>
        )
    }
}

export default EggPage; 